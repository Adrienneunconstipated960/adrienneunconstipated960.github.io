# Kailani | Personal Portfolio

A pink, bookish, space-inspired engineering portfolio built as a static website with HTML, CSS, and vanilla JavaScript. No installation, build step, account, or paid hosting required.

## Included files

- `index.html` - complete single-page portfolio
- `styles.css` - colors, typography, animations, and responsive layout
- `script.js` - mobile menu and illustrative robotic arm motion profiles
- `assets/space-window.jpg` - provided space photograph used in the homepage
- `assets/Kailani_Alarcon_Resume.pdf` - provided one-page engineering resume, accessible through the site

## Preview locally

Double click `index.html` to open the page in a browser. Internet access is only used to load optional Google Fonts; the website works with system font fallbacks when offline.

## Publish on GitHub Pages

1. Sign in at https://github.com and create a **public** repository named `kalarcon775.github.io` if `kalarcon775` is your username. If your username is different, replace it accordingly.
2. Click **Add file** > **Upload files** and upload **the contents** of this folder. `index.html` must be at the top level of the repository, not inside another folder.
3. Commit the files to the `main` branch.
4. Under **Settings** > **Pages**, choose **Deploy from a branch**, then `main` and `/(root)` and click **Save**.
5. Visit `https://kalarcon775.github.io` after deployment finishes. Publication may take several minutes.

If you already published a previous portfolio, replace its old `index.html`, `styles.css`, `script.js`, and upload the `assets` folder. You can delete obsolete files such as the old `resume.html` if unused.

## Update your site

- **Name and intro:** edit hero text in `index.html`.
- **Photo:** replace `assets/space-window.jpg` with another photo of the same name.
- **Resume:** replace `assets/Kailani_Alarcon_Resume.pdf` with a newer PDF of the same name.
- **Links:** update LinkedIn/GitHub/email links in `index.html`.
- **Colors:** edit CSS variables at the top of `styles.css`.
- **Robot presets:** edit `poses` in `script.js`.

## Notes on accuracy and privacy

- Professional details were taken from the uploaded resume. The NASA robotic arm content is based on the resume's public-level description.
- The IVerify project description is intentionally high level. **The uploaded confidential technical design report is not published or bundled with the website.** IVerify is an academic prototype concept, not a clinically approved product.
- A transcript with private academic and identifying information was **not bundled**.
- The resume PDF contains the applicant's contact details and will be public when deployed. Review before publishing.
- The website's robotic arm is an artistic 2D concept using illustrative dimensions and scripted motion profiles. It is not connected to hardware and should not be interpreted as a collision-safe or physically validated simulation.
- Project visuals are stylized illustrations, not actual hardware photographs. Feel free to add approved, non-confidential images later.
