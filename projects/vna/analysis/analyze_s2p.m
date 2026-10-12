function result = analyze_s2p(filename, makePlots)
% ANALYZE_S2P Import and analyze a Touchstone 1.0 two-port file.
% Recovery reconstruction, NOT the original 2025 VNA acquisition or SOLT code.
% Supports # FREQ S {RI|MA|DB} R <ohms>. Examples: # GHz S MA R 50
% Touchstone two-port order is S11, S21, S12, S22 (NOT S11,S12,S21,S22).
% Does NOT calibrate raw VNA measurements, communicate with hardware,
% or support Touchstone 2.0 multiport/matrix format.
%
% Example: x = analyze_s2p('../examples/synthetic_twoport.s2p', true);

if nargin < 2
    makePlots = true;
end
fid = fopen(filename, 'r');
if fid == -1
    error('Cannot open Touchstone file: %s', filename);
end
cleanupFile = onCleanup(@() fclose(fid)); %#ok<NASGU>
frequencyUnit = 'GHZ'; formatName = 'MA'; z0 = 50;
values = [];
while true
    line = fgetl(fid);
    if ~ischar(line)
        break;
    end
    excl = strfind(line, '!');
    if ~isempty(excl)
        line = line(1:excl(1)-1);
    end
    line = strtrim(line);
    if isempty(line)
        continue;
    end
    if line(1) == '['
        error('Touchstone 2.0 is not supported: %s', line);
    end
    if line(1) == '#'
        opt = regexp(upper(strtrim(line(2:end))), '\s+', 'split');
        if numel(opt) < 3 || ~strcmp(opt{2}, 'S')
            error('Only two-port S-parameters are supported.');
        end
        frequencyUnit = opt{1}; formatName = opt{3};
        rloc = find(strcmp(opt, 'R'), 1);
        if ~isempty(rloc)
            if rloc >= numel(opt)
                error('Missing reference impedance after R');
            end
            z0 = str2double(opt{rloc+1});
        end
        continue;
    end
    % Touchstone permits records to be split across multiple lines.
    line = regexprep(line, '([0-9])([dD])([+-]?\d+)', '$1E$3');
    parsed = sscanf(line, '%f');
    if isempty(parsed)
        error('Found a nonnumeric Touchstone data line: %s', line);
    end
    values = [values; parsed]; %#ok<AGROW>
end
if isempty(values) || mod(numel(values), 9) ~= 0
    error('Expected one frequency and 8 S-parameter values per two-port record.');
end
if ~(isfinite(z0) && z0 > 0)
    error('Reference impedance must be a positive real value.');
end
switch frequencyUnit
    case 'HZ';  factor = 1;
    case 'KHZ'; factor = 1e3;
    case 'MHZ'; factor = 1e6;
    case 'GHZ'; factor = 1e9;
    otherwise; error('Unsupported frequency unit: %s', frequencyUnit);
end
if ~any(strcmp(formatName, {'RI','MA','DB'}))
    error('Unsupported S-parameter data format: %s', formatName);
end
mat = reshape(values, 9, []).';
freqHz = mat(:,1) * factor;
if any(~isfinite(mat(:))) || any(freqHz <= 0) || any(diff(freqHz) <= 0)
    error('Numeric data must be finite and frequencies strictly increasing and positive.');
end
params = complex(zeros(size(mat,1), 4));
for k = 1:4
    a = mat(:,k*2);
    b = mat(:,k*2+1);
    switch formatName
        case 'RI'; params(:,k) = complex(a, b);
        case 'MA'; params(:,k) = a .* exp(1i .* b * pi / 180);
        case 'DB'; params(:,k) = 10.^(a/20) .* exp(1i .* b * pi / 180);
    end
end
s11 = params(:,1); s21 = params(:,2);
s12 = params(:,3); s22 = params(:,4);
gamma = abs(s11);
vswr = nan(size(gamma));
vswr(gamma < 1) = (1 + gamma(gamma < 1)) ./ (1 - gamma(gamma < 1));
vswr(gamma == 1) = Inf;
zin = z0 * (1 + s11) ./ (1 - s11);
result = struct();
result.frequency_Hz = freqHz;
result.reference_impedance_ohms = z0;
result.S11 = s11; result.S21 = s21;
result.S12 = s12; result.S22 = s22;
result.S11_dB = 20 * log10(abs(s11));
result.S21_dB = 20 * log10(abs(s21));
result.S12_dB = 20 * log10(abs(s12));
result.S22_dB = 20 * log10(abs(s22));
result.return_loss_dB = -result.S11_dB;
result.VSWR = vswr;
result.input_impedance_ohms = zin;
result.calibrated = false; % Imported files may be calibrated externally; unverified here.
if makePlots
    figure('Name','S-parameter magnitudes');
    plot(freqHz/1e9, result.S11_dB, 'LineWidth', 1.5); hold on;
    plot(freqHz/1e9, result.S21_dB, 'LineWidth', 1.5);
    grid on; xlabel('Frequency (GHz)'); ylabel('Magnitude (dB)');
    legend('S11','S21','Location','best'); title('S-parameters (imported, calibration unverified)');
    figure('Name','S11 reflection coefficient plane');
    angle = linspace(0,2*pi,361);
    plot(cos(angle),sin(angle),'k--'); hold on;
    plot(real(s11),imag(s11),'o-','LineWidth',1.3); axis equal;
    grid on; xlabel('Real(S11)'); ylabel('Imag(S11)');
    title('Reflection-coefficient plane (not a calibrated Smith chart)');
end
end
