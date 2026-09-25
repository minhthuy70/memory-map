const fs = require('fs');
const byFile = JSON.parse(fs.readFileSync('errors_parsed.json', 'utf8'));
for (const [file, errs] of Object.entries(byFile)) {
  console.log('=== ' + file + ' (' + errs.length + ') ===');
  errs.forEach(e => console.log('  ' + e.pos + ': [' + e.code + '] ' + e.msg));
}
