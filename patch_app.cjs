const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let search = `import DatabaseScreen from './components/DatabaseScreen';`;
let replacement = `import DatabaseScreen from './components/DatabaseScreen';
import StatsScreen from './components/StatsScreen';`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
} else {
    console.log('Could not find first search string in App.tsx');
}

search = `<MainMenuScreen
          onNewGame={handleNewGame}
          onLogout={() => setCurrentScreen('splash')}
          onDatabase={() => setCurrentScreen('database')}
        />`;
replacement = `<MainMenuScreen
          onNewGame={handleNewGame}
          onLogout={() => setCurrentScreen('splash')}
          onDatabase={() => setCurrentScreen('database')}
          onStats={() => setCurrentScreen('stats')}
        />`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
} else {
    console.log('Could not find second search string in App.tsx');
}

search = `{currentScreen === 'database' && (
        <DatabaseScreen onBack={() => setCurrentScreen('main-menu')} />
      )}`;
replacement = `{currentScreen === 'database' && (
        <DatabaseScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen onBack={() => setCurrentScreen('main-menu')} />
      )}`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log('App.tsx Patched correctly');
} else {
    console.log('Could not find third search string in App.tsx');
}
