const test = require('node:test');
const assert = require('node:assert/strict');

const EditorModule = require('../src/js/editor.js');
const ConvertersModule = require('../src/js/converters.js');
const BuilderModule = require('../src/js/builder.js');
const AiModule = require('../src/js/ai.js');

test('EditorModule.renderMd converts markdown headings and bold text', () => {
  const md = '# Hello World\n\nThis is **bold** text.';
  const html = EditorModule.renderMd(md);
  assert.ok(html.includes('<h1 id="hello-world">Hello World</h1>'));
  assert.ok(html.includes('<strong>bold</strong>'));
});

test('EditorModule.sanitize strips dangerous scripts and onclick handlers', () => {
  const unsafe = '<p onclick="alert(1)">Text <script>alert("xss")</script></p>';
  const safe = EditorModule.sanitize(unsafe);
  assert.equal(safe, '<p>Text </p>');
});

test('ConvertersModule.csvToMarkdown converts CSV to markdown table', () => {
  const csv = 'Name,Role\nAlice,Admin\nBob,User';
  const mdTable = ConvertersModule.csvToMarkdown(csv, ',');
  assert.ok(mdTable.includes('| Name | Role |'));
  assert.ok(mdTable.includes('| Alice | Admin |'));
});

test('ConvertersModule.jsonToMarkdown converts JSON object to markdown list', () => {
  const json = JSON.stringify({ project: 'ViewIt Studio', license: 'MIT' });
  const md = ConvertersModule.jsonToMarkdown(json);
  assert.ok(md.includes('**project**: ViewIt Studio'));
  assert.ok(md.includes('**license**: MIT'));
});

test('BuilderModule.parseStyleString handles styles with colons in values', () => {
  const styleStr = 'color: red; background-image: url("https://example.com/img.png"); margin: 10px;';
  const parsed = BuilderModule.parseStyleString(styleStr);
  assert.equal(parsed.color, 'red');
  assert.equal(parsed['background-image'], 'url("https://example.com/img.png")');
  assert.equal(parsed.margin, '10px');
});

test('BuilderModule.serializeTree correctly outputs HTML with attributes', () => {
  const tree = [
    {
      id: 'b1',
      tag: 'button',
      attrs: { class: 'primary-btn' },
      text: 'Click',
      styles: { color: 'blue' },
      children: []
    }
  ];
  const html = BuilderModule.serializeTree(tree);
  assert.equal(html, '<button class="primary-btn" style="color:blue;">Click</button>');
});

test('AiModule.sanitizeApiKey trims whitespace', () => {
  assert.equal(AiModule.sanitizeApiKey('  sk-test-key  '), 'sk-test-key');
});
