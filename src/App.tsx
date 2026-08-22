import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainMenuScreen from './components/MainMenuScreen';
import SettingsScreen from './components/SettingsScreen';
import ScorekeeperScreen from './components/ScorekeeperScreen';
import DatabaseScreen from './components/DatabaseScreen';
import StandingsAndStatsScreen from './components/StandingsAndStatsScreen';
import { Screen, Player } from './types';
import { defaultSettingsContract } from './settingsContract';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [scheduledGameData, setScheduledGameData] = useState<{
    homeTeam: string;
    awayTeam: string;
    homeRoster?: Player[];
    awayRoster?: Player[];
    date?: string;
    time?: string;
    location?: string;
    competition?: string;
    matchType?: string;
  } | null>(null);

  const handleStartScheduledGame = (gameData: any) => {
    setScheduledGameData(gameData);
    setCurrentScreen('settings');
  };

  const handleNewGame = () => {
    setScheduledGameData(null);
    setCurrentScreen('settings');
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-background font-body overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary">
      {currentScreen === 'splash' && <LoginScreen onLogin={() => setCurrentScreen('main-menu')} />}

      {currentScreen === 'main-menu' && (
        <MainMenuScreen
          onNewGame={handleNewGame}
          onLogout={() => setCurrentScreen('splash')}
          onDatabase={() => setCurrentScreen('database')}
          onStandings={() => setCurrentScreen('standings')}
        />
      )}

      {currentScreen === 'standings' && (
        <StandingsAndStatsScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'database' && (
        <DatabaseScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          scheduledGameData={scheduledGameData}
          contract={defaultSettingsContract}
          onStart={() => setCurrentScreen('scorekeeper')}
          onBack={() => setCurrentScreen('main-menu')}
        />
      )}

      {currentScreen === 'scorekeeper' && <ScorekeeperScreen contract={defaultSettingsContract} onBack={() => setCurrentScreen('settings')} />}
    </div>
  );
}
