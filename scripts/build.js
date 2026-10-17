const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

let html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');

// Replace stylesheet link with inline CSS
const cssPath = path.join(srcDir, 'styles', 'main.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(
    '<link rel="stylesheet" href="styles/main.css"/>',
    `<style>\n${cssContent}\n</style>`
  );
}

// Replace script tags with inlined JS code
const jsFiles = ['editor.js', 'converters.js', 'ai.js', 'builder.js', 'dev.js', 'assets.js', 'app.js'];
let combinedJs = '';

jsFiles.forEach((file) => {
  const filepath = path.join(srcDir, 'js', file);
  if (fs.existsSync(filepath)) {
    combinedJs += `\n/* --- ${file} --- */\n` + fs.readFileSync(filepath, 'utf8') + '\n';
  }
});

// Remove script imports in HTML and place combined JS before </body>
jsFiles.forEach((file) => {
  const tag = new RegExp(`<script src="js/${file}"><\\/script>\\s*`, 'g');
  html = html.replace(tag, '');
});

html = html.replace('</body>', `<script>\n${combinedJs}\n</script>\n</body>`);

const outputPath = path.join(distDir, 'index.html');
fs.readFileSync(path.join(srcDir, 'index.html')); // test read
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`Successfully built standalone distribution at ${outputPath} (${(html.length / 1024).toFixed(1)} KB)`);
