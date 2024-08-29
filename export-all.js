import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'qgn-react-project-code-base.txt');

function readDirRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      readDirRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function exportAllCode() {
  const allFiles = readDirRecursive(sourceDir);
  let output = '';

  allFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.scss')) {
      output += `// File: ${path.relative(__dirname, file)}\n`;
      output += fs.readFileSync(file, 'utf8') + '\n\n';
    }
  });

  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`All code exported to ${outputFile}`);
}

exportAllCode();
