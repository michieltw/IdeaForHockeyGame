const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<button onClick=\{\(\) => navigateTo\('ecosystem'\)\} className=\{`flex items-center gap-3 p-3 rounded hover:bg-white\/5 transition-colors \$\{currentScreen === 'ecosystem' \? 'bg-white\/10 text-white' : ''\}`\}>/,
  '<button onClick={() => isLeagueManagerPlus && navigateTo(\'ecosystem\')} disabled={!isLeagueManagerPlus} className={`flex items-center gap-3 p-3 rounded transition-colors ${!isLeagueManagerPlus ? \'opacity-50 cursor-not-allowed\' : \'hover:bg-white/5\'} ${currentScreen === \'ecosystem\' ? \'bg-white/10 text-white\' : \'\'}`}>'
);

fs.writeFileSync('src/App.tsx', content);
