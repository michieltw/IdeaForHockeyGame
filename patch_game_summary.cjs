const fs = require('fs');
let code = fs.readFileSync('src/components/Scorekeeper/GameSummaryModal.tsx', 'utf8');

const search = `        const gameId = \`\${now}_\${cleanHome}_\${cleanAway}_\${Date.now()}\`;
        const logs = activeEvents.map(e => ({
          GameID: gameId,
          Date: date || now,
          HomeTeam: homeTeam,
          AwayTeam: awayTeam,
          Timestamp: e.time,
          EventType: e.type,
          Team: e.team,
          Description: e.text,
          X: e.x !== undefined ? Math.round(e.x) : '',
          Y: e.y !== undefined ? Math.round(e.y) : ''
        }));

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ logs })
        });`;

const replacement = `        const gameId = \`\${now}_\${cleanHome}_\${cleanAway}_\${Date.now()}\`;
        const logs = activeEvents.map(e => ({
          GameID: gameId,
          Date: date || now,
          HomeTeam: homeTeam,
          AwayTeam: awayTeam,
          Timestamp: e.time,
          EventType: e.type,
          Team: e.team,
          Description: e.text,
          X: e.x !== undefined ? Math.round(e.x) : '',
          Y: e.y !== undefined ? Math.round(e.y) : '',
          Player: e.player || '',
          Assist1: e.assist1 || '',
          Assist2: e.assist2 || '',
          PenaltyReason: e.penaltyReason || '',
          PenaltyMinutes: e.penaltyMinutes || ''
        }));

        const game = {
          GameID: gameId,
          Date: date || now,
          HomeTeam: homeTeam,
          AwayTeam: awayTeam,
          HomeScore: gameState.scoreHome,
          AwayScore: gameState.scoreAway,
          HomeSOG: gameState.sogHome,
          AwaySOG: gameState.sogAway,
          Location: location || ''
        };

        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ action: 'saveGame', logs, game })
        });`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
    fs.writeFileSync('src/components/Scorekeeper/GameSummaryModal.tsx', code);
    console.log('Patched correctly');
} else {
    console.log('Could not find search string');
}
