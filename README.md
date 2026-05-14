# QR Code Generator

A free, privacy-first QR code generator that runs entirely in the browser.
No signup, no expiration, no watermarks.

**[sugiro.ai/tools/qr-code-generator](https://sugiro.ai/tools/qr-code-generator)**

---

## Features

- **Instant QR generation** from any URL or text
- **Customizable size** — 128px to 1024px
- **Custom colors** with live preview
- **Transparent background (.png)** option with checkerboard preview
- **Error correction** levels (L, M, Q, H)
- **Download** as PNG
- **Dark / light theme** with system-aware toggle
- **English & Portuguese** translations
- **Fully offline capable** — no external requests after page load
- **Mobile friendly** responsive design

---

## How it works

1. Enter a URL or text
2. Pick a size, color, and error correction level
3. Optionally enable transparent background
4. Click **Generate QR Code**
5. Download the PNG

---

## Tech

- Plain HTML, CSS & JavaScript — zero frameworks
- [qr-creator](https://github.com/simonepm/qr-creator) (MIT) for QR rendering
- CSS custom properties for theming
- No tracking, no analytics, no cookies

---

## Run locally

```bash
git clone https://github.com/lularocha/qr-code-generator.git
cd qr-code-generator
open index.html
```

Or with a local server:

```bash
cd qr-code-generator
python3 -m http.server 8080
# Open http://localhost:8080
```


