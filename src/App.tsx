import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainMenuScreen from './components/MainMenuScreen';
import SettingsScreen from './components/SettingsScreen';
import ScorekeeperScreen from './components/ScorekeeperScreen';
import DatabaseScreen from './components/DatabaseScreen';
import StatsScreen from './components/StatsScreen';
import EcosystemScreen from './components/Ecosystem/EcosystemScreen';
import MyProfileScreen from './components/MyProfileScreen';
import PeopleDirectoryScreen from './components/PeopleDirectoryScreen';
import TeamProfileScreen from './components/TeamProfileScreen';
import RosterBuilderScreen from './components/RosterBuilderScreen';
import FreeAgencyScreen from './components/FreeAgencyScreen';
import { Screen, Player, User } from './types';
import { defaultSettingsContract } from './settingsContract';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      {currentScreen === 'splash' && <LoginScreen onLogin={(user) => {
        setCurrentUser(user);
        setCurrentScreen('main-menu');
      }} />}

      {currentScreen === 'main-menu' && (
        <MainMenuScreen
          currentUser={currentUser}
          onNewGame={handleNewGame}
          onStartScheduledGame={handleStartScheduledGame}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentScreen('splash');
          }}
          onDatabase={() => setCurrentScreen('database')}
          onStats={() => setCurrentScreen('stats')}
          onEcosystem={() => setCurrentScreen('ecosystem')}
          onMyProfile={() => setCurrentScreen('my-profile')}
          onPeopleDirectory={() => setCurrentScreen('people-directory')}
          onTeamProfile={() => setCurrentScreen('team-profile')}
          onRosterBuilder={() => setCurrentScreen('roster-builder')}
          onFreeAgency={() => setCurrentScreen('free-agency')}
        />
      )}

      {currentScreen === 'team-profile' && (
        <TeamProfileScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'roster-builder' && (
        <RosterBuilderScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'free-agency' && (
        <FreeAgencyScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'my-profile' && (
        <MyProfileScreen currentUser={currentUser} onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'people-directory' && (
        <PeopleDirectoryScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'ecosystem' && (
        <EcosystemScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'database' && (
        <DatabaseScreen onBack={() => setCurrentScreen('main-menu')} />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen onBack={() => setCurrentScreen('main-menu')} />
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
