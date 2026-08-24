const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const isManagerPlus = currentUser && ['Admin', 'League Manager', 'Team Manager'].includes(currentUser.role);",
  "const isAdmin = currentUser && currentUser.role === 'Admin';\n  const isLeagueManagerPlus = currentUser && ['Admin', 'League Manager'].includes(currentUser.role);\n  const isTeamManagerPlus = currentUser && ['Admin', 'League Manager', 'Team Manager'].includes(currentUser.role);\n  const isPlayerPlus = currentUser && ['Admin', 'League Manager', 'Team Manager', 'Player'].includes(currentUser.role);"
);

content = content.replace(
  "const isLeagueManagerPlus = currentUser && ['Admin', 'League Manager'].includes(currentUser.role);",
  ""
);

content = content.replace(
  /<button onClick=\{handleNewGame\} className="flex items-center gap-3 p-3 rounded hover:bg-white\/5 transition-colors">/g,
  '<button onClick={() => isPlayerPlus && handleNewGame()} disabled={!isPlayerPlus} className={`flex items-center gap-3 p-3 rounded transition-colors ${!isPlayerPlus ? \'opacity-50 cursor-not-allowed\' : \'hover:bg-white/5\'}`}>'
);

// We need to replace all isManagerPlus with isTeamManagerPlus
content = content.replace(/isManagerPlus/g, 'isTeamManagerPlus');

content = content.replace(
  /<option value="Fan">Fan<\/option>/g,
  '<option value="Guest">Guest</option>'
);


fs.writeFileSync('src/App.tsx', content);
