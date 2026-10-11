# Kailani | Engineering & Curiosity

A minimalist, elegant portfolio that maintains a blush-and-plum aesthetic while focusing attention on engineering work, actual GitHub repositories, and personal photographs.

## Files

- `index.html`, `styles.css`, `script.js`
- `assets/` with six selectively integrated personal photographs and the provided PDF resume

## Preview locally

Open `index.html` in a browser, or use `python -m http.server 8000` to preview at `http://localhost:8000`.

## Publish on GitHub Pages

1. Open your repository at `https://github.com/kalarcon775/kalarcon775.github.io`.
2. Upload `index.html`, `styles.css`, `script.js`, and the files in `assets/` to the repository root and `assets/` respectively.
3. Commit the changes. GitHub Pages will republish from your `main` branch if configured for `/(root)`.
4. Visit `https://kalarcon775.github.io` when deployment finishes.

The PDF resume is intended to be public once deployed and contains personal contact information. Review before publishing.

## Content and photographs

- NASA robotic-arm project descriptions are based on the supplied engineering resume.
- The NASA robotics lab image is a personal site photograph, **not** a claim that the pictured rover is the user's robotic-arm project.
- IVerify content remains conceptual: it is not an approved clinical product.
- The confidential IVerify report and the academic transcript are not included.
- The robot lab is an artistic simplified 2D kinematic visualization, not a real hardware controller or collision-safe simulation.
- Photos appear within their relevant sections. There is no gallery page.
- The GitHub projects are authored links to public repositories and can be searched/filtered without an API key.

## How to edit

- Change content in `index.html`.
- Adjust the refined palette at the top of `styles.css`.
- Replace photos or the resume PDF within `assets/` with the same filenames.
- Change robot poses in `script.js`.

## Image update

The earlier Earth-window silhouette photo has been removed and is no longer part of this website. The Interests section instead features the provided space helmet photograph.

## Upload your own media (JPEG and MP4 only)

The website code references these exact filenames inside the root-level `assets/` directory. **Do not rename the files arbitrarily**: GitHub Pages paths are case-sensitive.

- `sls-rocket-kailani.jpeg` - standing by NASA rocket (homepage)
- `graduation-flowers.jpeg` - graduation photo (About)
- `robotics-lab-rover.jpeg` - NASA robotics-lab photo (featured project)
- `nasa-mission-training-complex.jpeg` - NASA mission training photo (Experience)
- `cleanroom-suit.jpeg` - cleanroom photo (Education)
- `space-helmet.jpeg` - space helmet photo (Interests)
- `huemotion-demo.mp4` - HueMotion hand tracking demonstration (GitHub section)
- `lighting-demo.mp4` - illuminated light demonstration (GitHub section)

Do not upload the braid or Earth-window silhouette photo. Any older `.jpg` files remain unused by the updated HTML. Upload the actual JPEG bytes with the filename extension `.jpeg`, rather than merely relabeling files encoded in a different format. MP4 clips should be encoded in a browser-compatible format such as H.264. The video modules remain hidden until the MP4 metadata can be loaded.

The existing `assets/Kailani_Alarcon_Resume.pdf` is a resume document rather than a photo/video and remains unchanged.


## October 2026 interactive upgrade

The portfolio now includes:
- Motion-safe scroll reveal transitions and a subtle CSS space orbit
- Expandable engineering case studies in the featured project and project cards
- More informative GitHub repository cards and links to the existing MP4 demos
- Three illustrative joint-angle sliders and a reset control for the ceiling-mounted arm
- An expandable experience timeline
- A keyboard-navigable Jane Austen / Project Hail Mary reading shelf

### Media upload policy

No images, videos, or PDF documents are added by this code update. Media remains under your control. The existing HTML references the following exact filenames under \`assets/\`:

| Section | Asset |
|---|---|
| Homepage NASA rocket | \`sls-rocket-kailani.jpeg\` |
| About and graduation | \`graduation-flowers.jpeg\` |
| Featured NASA robotics project | \`robotics-lab-rover.jpeg\` |
| Experience | \`nasa-mission-training-complex.jpeg\` |
| Education | \`cleanroom-suit.jpeg\` |
| Interests | \`space-helmet.jpeg\` |
| HueMotion demonstration | \`huemotion-demo.mp4\` |
| Lighting demonstration | \`lighting-demo.mp4\` |

The existing resume link, \`assets/Kailani_Alarcon_Resume.pdf\`, remains unchanged. No new media is required for the interactive features. This site never references the braid photo. All robotic motions and angle ranges are illustrative, not verified hardware settings.


## Interactive engineering bookshelf

The Engineering Bookshelf is an interactive project library at `#bookshelf`.

- Nine individual CSS-rendered book spines represent engineering projects: NASA Robotics, IVerify, Thermal Controller & Logger, Fingerprint Authentication, Virtual Network Analyzer, 3-Link Leg Simulation, ProDriver Sim, HueMotion, and DMX Controller.
- Selecting a book opens a two-page story in a native accessible dialog, with a CSS book-cover turning animation, an overview and concrete technical details.
- Dialog controls include Close, Previous book, Next book, Escape key to close, click outside to close, and keyboard arrow navigation among spines.
- CSS honors `prefers-reduced-motion`; narrow screens display readable pages stacked vertically.
- The existing project summaries, GitHub repositories, resume PDF, JPEG photos and MP4 videos remain in place. The former small reading tabs were replaced by the full project bookshelf. Literature interests remain in their existing prose section.

**No new assets are needed.** This feature uses `bookshelf.css`, `bookshelf.js` and an updated `index.html` only. Add or change book descriptions in `bookshelf.js`. The stories are based on the existing project and GitHub descriptions; links to private or confidential documents have not been added.


## Streamlined navigation and subtle space elements

The latest update retains the full interactive bookshelf, GitHub project filters, robot joint controls, experience timeline, JPEG photographs, MP4 demos, and resume. It adds:

- A three-option quick-navigation row below the hero (project bookshelf, robot lab, and GitHub code).
- A main homepage call-to-action that opens the project bookshelf directly.
- A collapsible group of four supplementary project cards, keeping their existing details while shortening the default page.
- A lightweight reading-progress line in the sticky header, updated with one throttled requestAnimationFrame per scroll frame.
- CSS-only star details, a restrained orbiting planet near the bookshelf, and a shooting-star accent beside the robot lab.
- Improved section spacing, tappable links, responsive layouts, keyboard-friendly native disclosure, and support for reduced-motion preferences.

All design elements in \`ux.css\` are implemented with CSS shapes and no media assets. \`ux.js\` handles only the progress indicator and the disclosure hint. No JPEGs, MP4s, or PDFs were uploaded or edited. Keep the existing JPEG and MP4 media filenames documented above.


## Book opening and page-turning interaction

Selecting any project spine now triggers a physical-book-inspired sequence:

1. The selected book pulls upward from the shelf.
2. A closed, matching-color hardback appears in the center of an accessible dialog.
3. The front cover rotates around its hinge, revealing an open two-page project story.
4. Previous and Next animate a paper page turning in the appropriate direction.

The content is still text, readable, and accessible. Native Escape, Close, and outside-dialog dismissal work. The animations use only CSS shapes and transforms, and are disabled for visitors who prefer reduced motion. The narrow-screen version provides a stacked reading layout with a smaller opening-book effect.

Only \`index.html\`, \`bookshelf.css\`, and \`bookshelf.js\` were changed for the interaction. No media assets are required or uploaded.
