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
