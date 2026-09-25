const fs = require('fs');
const path = require('path');

const files = [
  'src/components/GlobalLeaderboard.tsx',
  'src/components/FriendsLeaderboard.tsx',
  'src/components/CategoryLeaderboard.tsx',
  'src/components/RegionalLeaderboard.tsx',
  'src/components/MonthlyLeaderboard.tsx',
];

files.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  if (relPath.includes('MonthlyLeaderboard.tsx')) {
    content = content.replace('month: string;', 'month: number;');
  }

  content = content.replace(/(\{\s*\r?\n\s*id:\s*['"](\d+)['"],\s*\r?\n)(?!\s*rank:)/g, (match, prefix, num) => {
    return prefix + '      rank: ' + parseInt(num, 10) + ',\n';
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated:', relPath);
});
