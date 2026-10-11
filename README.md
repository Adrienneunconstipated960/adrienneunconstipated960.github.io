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

- fourteen individual CSS-rendered book spines represent engineering projects: NASA Robotics, IVerify, Thermal Controller & Logger, Fingerprint Authentication, Virtual Network Analyzer, 3-Link Leg Simulation, ProDriver Sim, HueMotion, and DMX Controller.
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


## Book pages, not tab panels

The project reader is now styled as an open physical hardcover. The story and technical information are printed directly on two facing paper pages with a book binding, paper-stack edges, page numbers, chapter headings, and a hinged cover. The reader no longer looks like a framed tab or card.

On smaller screens the book displays **one page at a time**: first the story, then the engineering details. Visitors turn that page using the control printed at the bottom of the sheet. The Previous / Next book navigation still moves among all fourteen projects, and the existing Close button, Escape key, and external project links remain.

The upgrade only modifies \`index.html\`, \`bookshelf.css\`, and \`bookshelf.js\`. All visuals are CSS shapes. No JPEG, MP4, PDF or other asset was uploaded, removed or changed.


## Additional engineering source content (October 2026)

Three new project books were added, based on privately supplied technical coursework:

- **UR3e Robot Kinematics (ME422, collaborative)**: Six-link Denavit–Hartenberg frame modeling, homogeneous transforms, Jacobian velocity analysis, and rank-5 singularity at the evaluated zero-angle configuration.
- **STM32 Motor Timing & PWM**: Embedded motor timing, PWM control and encoder capture from the CV, complemented by STM32 timer/channel-2 duty-cycle examples from the uploaded microprocessor lab materials.
- **VHDL Digital Logic (EE421)**: Pure combinational 4-bit binary-to-decimal display and two-operand 4-bit addition plus carry-in, producing a 0–31 result on seven-segment displays.

The existing Fingerprint Authentication book was expanded with team-based, library-free UART packet handling, guided enrollment, template indexing, and success/failure LED signaling. The Three-Link Simulation book now mentions the MATLAB S-function, Jacobian kinematics, and Newton–Euler dynamics.

Additional CV evidence is included selectively in the About and Skills sections: Honors Baccalaureate, two 2026 Outstanding Service awards, mentoring, VHDL, PWM, FFT/radar processing, and cleanroom photolithography. The original NASA work, links, photographs, MP4 demos, and resume PDF remain intact.

**Privacy and source handling:** The original academic reports and CV remain private; no PDF/DOCX files, source code dumps, or source images were uploaded. The site contains concise public-facing summaries only. New books do not invent public GitHub repository links that were not already available. Group work is explicitly described as collaborative.


## October 2026 additional coursework and research context

The user provided additional engineering coursework, a capstone report, and research statements. The public site **does not upload or link to any of the original documents**.

Changes incorporated selectively:
- **Pipelined VHDL ALU** is a new project book: 4-bit registered datapath, ripple-carry adder, pass-through, increment, addition, subtraction and XOR, with one-cycle output latency. This is distinct from the previously listed combinational VHDL seven-segment project.
- **Hall-effect wafer characterization** is a new lab book: M91 FastHall, Van der Pauw four-contact geometry, Hall measurements, and characterization of transport properties. The report showed large uncertainties and unexpected results, so no precise carrier properties are portrayed as validated.
- **IVerify** describes an external clip-on tubing-force sensing concept, an analog front end, threshold and microcontroller logic, and a simplified two-LED proof-of-concept prototype, separately from the intended three-state final design. It is not a clinically approved medical device.
- **Three-link biomechanics** remains a completed simulation. Aspirations to develop future prosthetic or assistive devices are explicitly future-focused, not claimed as completed hardware.
- **Research interests** mention reliable robotic sensing and assistive technologies without presenting grant proposal performance targets as achieved.

The EE291 power-line numerical-methods document is an assignment prompt, not evidence of a completed implementation, so no completed solver project was added. Sensitive personal details from the scholarship statements and proprietary engineering measurements are not published.

The shelf now has fourteen books in two rows of seven. The keyboard's up/down navigation moves between those rows. Existing interactive book animation, GitHub links, JPEG and MP4 paths, and resume links are unchanged. Only HTML, JavaScript, CSS, and project documentation are committed.


## Mobile reading and purposeful space motion (October 2026)

- Two seven-book shelves remain native horizontal scroll regions on mobile, with scroll snapping, larger touch targets, and visible swipe hints. Visitors can use the **Next collection** / **Previous collection** actions to move between shelf groups.
- The open-book dialog keeps the same two-page story on desktop and displays **only one readable page at a time** on mobile, with larger text, more room for content and explicit page-turn labels.
- **Return to Bookshelf** closes the dialog. The script restores the visitor's vertical scroll position, both shelf scroll offsets, and keyboard focus without an unwanted jump.
- Each book remembers its last-opened story/details page for the current browser session while that website page remains loaded. It does not store progress on the server or in browser storage.
- The homepage has one CSS-shape orbital accent near the introduction. Two faint constellation lines draw when scrolled into view. Tiny stars animate only when visitors click collection-navigation controls. Earlier scattered animated decorations were disabled to make the theme intentional.
- All new animations respect \`prefers-reduced-motion\`; content, navigation and the two-page reader work with animations disabled.
- No photographs, videos, resumes or uploaded academic files were published or modified. All existing media paths remain unchanged.

Only \`index.html\`, \`bookshelf.css\`, \`bookshelf.js\`, \`ux.css\`, \`ux.js\`, and this README changed.


## Curated engineering bookshelf collections

The interactive bookshelf now organizes all 14 projects into three labeled, color-coordinated shelves:

1. **Space & Robotics** (plum, 3 books): NASA Robotics, UR3e Analysis, 3-Link Leg Simulation.
2. **Embedded & Digital Systems** (muted blue, 5 books): STM32 Security, STM32 Motor, VHDL Logic, Pipelined ALU, DMX Controller.
3. **Sensing & Engineering Tools** (dusty rose, 6 books): IVerify, Thermal Logger, Virtual VNA, Hall Measurements, ProDriver, HueMotion.

Hovering over or keyboard-focusing a book displays its title and a brief descriptive subtitle under its shelf. The preview is provided from the existing, source-accurate project data in \`bookshelf.js\`, so the subtitle is maintained in one place. Accessible book labels also include the subtitle.

Keyboard arrow navigation is collection-aware (Left/Right within a shelf, Up/Down between shelves) and works with unequal shelf lengths. Previous/Next book inside the reader follows the same visible collection order. Mobile horizontal swipe, touch targets, individual book reading position, Return to Bookshelf and CSS-only page animations remain intact.

Collection navigation buttons and restrained star-trail accents continue to work between all three shelves. No JPEGs, MP4s, PDFs, or user-uploaded source documents were modified or uploaded.


## Focused homepage and concise project summaries (October 2026)

The visitor journey now starts with a shorter hero that explicitly identifies Kailani as an electrical engineer, NASA Marshall OSTEM intern, and M.S. Electrical Engineering student. It presents exactly **two primary hero actions**: **Explore My Work** (scrolls to the engineering bookshelf) and **View Resume** (opens the existing resume PDF).

- The interactive **three-collection bookshelf** is now the first substantial section after the hero. Its 14 book descriptions, animations, keyboard controls, mobile swipe and reading-position behavior remain unchanged.
- The redundant three-card navigation row is removed.
- The separate About section is more focused and continues to preserve education, honors, and mentoring context.
- Featured NASA work remains as a concise one-card highlight with 34 requirements, six scenarios, and the high-vacuum target. Four duplicate expanded project cards and their detail panels were removed from the homepage; the underlying projects and substantive technical descriptions remain available in the books.
- The five public GitHub code cards now have short summaries, technology tags, and source links. Longer duplicated card details were removed. Search and category filters remain available behind an optional **Filter or search repositories** control, and both MP4 demonstrations remain referenced as before.
- CSS reduces unnecessary hero height and card spacing, preserving responsive accessibility and the existing gentle space animation motifs.

The changes do **not** upload or alter any JPEG, MP4, PDF, or confidential source document. The existing image, video, resume, and GitHub repository links remain unchanged. The interactive arm, timeline, and remaining professional sections are preserved.
