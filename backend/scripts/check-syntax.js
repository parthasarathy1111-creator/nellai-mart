'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        checkDirectory(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      try {
        execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
      } catch (err) {
        console.error(`❌ Syntax Error in file: ${fullPath}`);
        console.error(err.stderr ? err.stderr.toString() : err.message);
        process.exit(1);
      }
    }
  }
}

console.log('🔍 Checking syntax for all backend files...');
checkDirectory(path.resolve(__dirname, '..'));
console.log('✅ ALL BACKEND JAVASCRIPT FILES ARE SYNTAX VALID!');
