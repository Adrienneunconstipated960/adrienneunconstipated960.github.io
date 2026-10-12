# DMX Controller | Security and provenance review

## Facts established by source inspection

Original public source contains Flask route validation, newline USB serial commands, an Arduino Mega DMX frame transmitter, RGBW scenes, and a browser UI. Historical user documentation names nominal current values for RGBW channels, but the source **does not generate or measure those currents**. The original code does not include a current shunt, ADC feedback or driver-current configuration interface.

**Successful HTTP POST response means a USB serial write was attempted without raising an error**, not that Arduino parsed the command or that the DMX fixture applied a scene.

## Original source fixes completed

1. **Arduino compile typo**: original `fconst int DMX_TX_PIN` fixed to `const int DMX_TX_PIN` in the existing public firmware. Other Arduino compilation or hardware faults are not ruled out.
2. **Flask default binding**: original `0.0.0.0` changed to `127.0.0.1` by default via optional `DMX_HOST`. The non-authenticated controller can now be accessed only from the same machine unless explicitly reconfigured.
3. **Serial-port convenience**: new `DMX_ARDUINO_PORT` environment variable with default `COM5`. No serial protocol changes.
4. **Original README**: corrected setup instructions, clarified network access and recorded unverified limitations.

No credentials, protected data or corporate test logs were accessed or republished.

## Security gaps still present

- Flask `POST /scene/<name>` and `POST /brightness/<value>` have **no authentication or role-based authorization**. Changing `DMX_HOST` to `0.0.0.0` exposes scene control to network clients that can reach the port.
- No anti-CSRF token or request-origin checks. Restrict remote access unless separately protected by suitable authentication and network controls.
- No per-command rate limit or safe concurrency queue. Serial command writes can block or interleave under multiple requests depending on server/runtime behavior.
- The original Python app contains no fixture ACK or post-command health check, and the sketch does not implement a robust remote-control watchdog.
- The Arduino `inputCommand` grows until newline without a fixed maximum; production use should bound received line length and handle malformed commands explicitly.
- DMX fixtures can have different channel arrangements or modes. The labels in the browser are not proof of electrical load safety.

## Deployment recommendations

Keep Flask on loopback for solo desktop demos. For remote operation, add server-side access control and a trusted TLS/reverse-proxy layer or a secure local network; keep unauthorized networks from accessing serial/scene routes. Apply rate limiting and command logging. Commission on a de-energized or otherwise safe bench setup before connecting active fixtures. Add a safe, explicit Off / emergency fallback policy, connection supervision and independent physical isolation as needed for the lighting system.

## Physical validation not performed

Arduino sketch compilation, flash/upload, UART voltage levels, DMX BREAK duration, DMX bit timing, channel order on the fixture, serial latency, demo sequence accuracy, dimmer linearity, LED current, photometry and safety cannot be established without actual hardware. The original portfolio demonstration video remains a demo rather than a timed DMX-specific validation.
