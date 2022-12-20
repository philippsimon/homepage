const fs = require('fs');
const path = require('path');

const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

const srcDir = `./src`;
const distDir = `./dist`;

/**
 * 
 * @param {string} dir 
 */
function buildDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      buildDir(filePath);
    } else if (stat.isFile()) {
      buildFile(filePath);
    }
  });
}

/**
 * 
 * @param {string} filePath 
 */
function buildFile(filePath) {
  console.log(`Building ${filePath}`);

  const fileParsedPath = path.parse(filePath);

  if (fileParsedPath.ext !== '.md') {
    return;
  }

  const contentMarkdown = fs.readFileSync(filePath, 'utf8');
  const contentHTML = marked.parse(contentMarkdown);

  const distFileDir = path.join(distDir, path.relative(srcDir, fileParsedPath.dir));
  const distFilePath = `${distFileDir}/${fileParsedPath.name}.html`;

  fs.mkdirSync(distFileDir, { recursive: true });
  fs.writeFileSync(distFilePath, contentHTML);
}

buildDir(srcDir);
