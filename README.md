# ViewIt Studio — Write it. Build it. View it.

<div align="center">
  <img src="https://i.postimg.cc/mktFV3n0/Viewitlogo.png" width="96" height="96" alt="ViewIt Studio Logo" />
  <h3>Browser-Based Writing & Development Workspace</h3>
  <p><b>Write it. Build it. View it.</b></p>
  <a href="https://viewiter.blogspot.com/">Live Demo (Blogger Hosted)</a>
</div>

---

## 🌟 Overview

**ViewIt Studio** is a private, local-first browser application designed for technical writing, HTML development, visual site building, file conversions, and AI-assisted workflows. It runs entirely inside the client browser with zero mandatory dependencies on external servers or paid subscriptions.

## ✨ Core Features

1. **Write Mode (Markdown & HTML)**
   - Live side-by-side or focused preview
   - Real-time statistics (word count, character count, estimated reading time)
   - Line numbers & gutter sync
   - Table of contents generation
   - Fullscreen presentation mode & PDF export

2. **Convert & Formats Studio**
   - Multi-format conversion (PDF, Word DOCX, Excel XLSX, HTML, CSV, JSON, TXT to Markdown)
   - Client-side execution ensuring user data remains local

3. **AI Studio (Bring Your Own API Key)**
   - Support for OpenAI, Anthropic, Gemini, Groq, OpenRouter, DeepSeek, Mistral, and custom OpenAI-compatible endpoints
   - Floating, draggable, resizable window interface
   - API keys stored securely in browser `localStorage` and never sent to third-party tracking servers

4. **Visual Builder Mode**
   - Drag-and-drop / tap-to-add element component library
   - Live canvas preview with responsive device viewports (Mobile, Tablet, Desktop)
   - Bi-directional visual and HTML source code synchronization

5. **Developer Studio (Dev Mode)**
   - Multi-file code editor with project management
   - Live sandboxed preview with integrated console logging
   - Full ZIP archive project import and export

6. **Keyless Assets Library**
   - Integration with free keyless APIs: Iconify (SVG icons), Openverse (Commercial-use images), Google Fonts, and cdnjs (JavaScript libraries)

---

## 📱 Mobile-First Design

ViewIt Studio is engineered for mobile web browsers (including Chrome on Android and Samsung Internet).
- Touch target sizes optimized to at least 44x44px
- Responsive mobile navigation tab bars
- Adaptable floating panels and virtual keyboard accommodation

---

## 🔒 Security & Privacy

- **Local-First Architecture:** Documents and local media (IndexedDB) remain on your device.
- **Client-Side Sanitization:** User-generated HTML rendered in previews undergoes strict DOM sanitization to strip dangerous script tags and event handlers.
- **API Key Security:** API keys configured in AI Studio are transmitted directly from your client browser to your specified provider. No backend intermediary server is used.

---

## 🛠️ Development & Packaging

### Directory Structure
```
├── src/
│   ├── index.html        # Shell HTML markup
│   ├── styles/
│   │   └── main.css      # CSS styles and theme variables
│   └── js/
│       ├── app.js        # Main initialization logic
│       ├── editor.js     # Markdown & HTML editor functions
│       ├── converters.js # File conversion helpers
│       ├── ai.js         # AI Studio module
│       ├── builder.js    # Visual Builder module
│       ├── dev.js        # Developer Studio module
│       └── assets.js     # Assets library module
├── scripts/
│   └── build.js          # Standalone HTML packager
├── test/
│   └── app.test.js       # Node.js test suite
└── dist/
    └── index.html        # Compiled single-file distribution
```

### Running Tests
```bash
node --test test/app.test.js
```

### Building Standalone Distribution (Blogger Compatible)
```bash
node scripts/build.js
```
The resulting `dist/index.html` contains the full standalone single-file distribution that can be pasted directly into Blogger or hosted on static hosts like GitHub Pages.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Crafted by **Tlotlego Monnaemang**.
