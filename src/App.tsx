import { useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, Home, Play, Database, Trophy, Globe, Users, Shield, Wrench, RefreshCcw, Calendar, LayoutTemplate } from 'lucide-react';
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
import CalendarScreen from './components/CalendarScreen';
import LineupBuilderScreen from './components/LineupBuilderScreen';
import DraftModeScreen from './components/DraftModeScreen';
import { Screen, Player, User } from './types';
import { defaultSettingsContract } from './settingsContract';

export default function App() {
  const [viewedPerson, setViewedPerson] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scheduledGameData, setScheduledGameData] = useState<{
    id?: string;
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
    setIsSidebarOpen(false);
  };

  const handleNewGame = () => {
    setScheduledGameData(null);
    setCurrentScreen('settings');
    setIsSidebarOpen(false);
  };

  const navigateTo = (screen: Screen) => {
    if (screen === 'my-profile') setViewedPerson(null);
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('splash');
    setIsSidebarOpen(false);
  };

  const isManagerPlus = currentUser && ['Admin', 'League Manager', 'Team Manager'].includes(currentUser.role);
  const isLeagueManagerPlus = currentUser && ['Admin', 'League Manager'].includes(currentUser.role);

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050505] text-on-surface-variant p-4 w-64 border-r border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-8">
        <span className="font-display font-bold text-lg text-white">MENU</span>
        <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto flex flex-col gap-2 font-mono text-[12px] font-bold tracking-widest uppercase">
        <button onClick={() => navigateTo('main-menu')} className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors ${currentScreen === 'main-menu' ? 'bg-white/10 text-white' : ''}`}>
          <Home className="w-5 h-5 text-tertiary" /> Dashboard
        </button>
        <button onClick={handleNewGame} className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors">
          <Play className="w-5 h-5 text-tertiary" /> New Game
        </button>

        <div className="my-2 border-t border-[#2A2A2A]"></div>

        <button onClick={() => navigateTo('database')} className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors ${currentScreen === 'database' ? 'bg-white/10 text-white' : ''}`}>
          <Database className="w-5 h-5 text-tertiary" /> Database
        </button>
        <button onClick={() => navigateTo('stats')} className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors ${currentScreen === 'stats' ? 'bg-white/10 text-white' : ''}`}>
          <Trophy className="w-5 h-5 text-tertiary" /> Stats
        </button>
        <button onClick={() => navigateTo('ecosystem')} className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors ${currentScreen === 'ecosystem' ? 'bg-white/10 text-white' : ''}`}>
          <Globe className="w-5 h-5 text-tertiary" /> Ecosystem
        </button>
        <button onClick={() => navigateTo('people-directory')} className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors ${currentScreen === 'people-directory' ? 'bg-white/10 text-white' : ''}`}>
          <Users className="w-5 h-5 text-tertiary" /> People Directory
        </button>

        <div className="my-2 border-t border-[#2A2A2A]"></div>

        <button
          onClick={() => isManagerPlus && navigateTo('team-profile')}
          disabled={!isManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'team-profile' ? 'bg-white/10 text-white' : ''}`}
        >
          <Shield className="w-5 h-5 text-tertiary" /> Teams
        </button>
        <button
          onClick={() => isManagerPlus && navigateTo('roster-builder')}
          disabled={!isManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'roster-builder' ? 'bg-white/10 text-white' : ''}`}
        >
          <Wrench className="w-5 h-5 text-tertiary" /> Rosters
        </button>
        <button
          onClick={() => isManagerPlus && navigateTo('calendar')}
          disabled={!isManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'calendar' ? 'bg-white/10 text-white' : ''}`}
        >
          <Calendar className="w-5 h-5 text-tertiary" /> Calendar
        </button>
        <button
          onClick={() => isManagerPlus && navigateTo('lineup-builder')}
          disabled={!isManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'lineup-builder' ? 'bg-white/10 text-white' : ''}`}
        >
          <LayoutTemplate className="w-5 h-5 text-tertiary" /> Lineups
        </button>

        <div className="my-2 border-t border-[#2A2A2A]"></div>

        <button
          onClick={() => isLeagueManagerPlus && navigateTo('free-agency')}
          disabled={!isLeagueManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isLeagueManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'free-agency' ? 'bg-white/10 text-white' : ''}`}
        >
          <RefreshCcw className="w-5 h-5 text-tertiary" /> Free Agency
        </button>
        <button
          onClick={() => isLeagueManagerPlus && navigateTo('draft-mode')}
          disabled={!isLeagueManagerPlus}
          className={`flex items-center gap-3 p-3 rounded transition-colors ${!isLeagueManagerPlus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${currentScreen === 'draft-mode' ? 'bg-white/10 text-white' : ''}`}
        >
          <Trophy className="w-5 h-5 text-tertiary" /> Draft
        </button>

      </nav>

      <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-left rounded hover:bg-error/10 hover:text-error transition-colors font-mono text-[12px] font-bold tracking-widest uppercase">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-on-background font-body overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary flex relative">
      {currentScreen === 'splash' && <LoginScreen onLogin={(user) => {
        setCurrentUser(user);
        setCurrentScreen('main-menu');
      }} />}

      {currentScreen !== 'splash' && (
        <>
          {/* Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar Navigation */}
          <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {renderSidebarContent()}
          </div>

          <div className="flex-1 flex flex-col min-h-screen relative w-full transition-all duration-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 z-30 relative pointer-events-none">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded bg-[#050505] border border-[#2A2A2A] hover:border-tertiary/60 flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-all shadow-md pointer-events-auto active:scale-95"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex gap-3 pointer-events-auto">
                <button
                  onClick={() => navigateTo('my-profile')}
                  className="w-10 h-10 rounded-full bg-[#050505] border border-[#2A2A2A] hover:border-tertiary/60 flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-all shadow-md active:scale-95 group relative"
                  title="My Profile"
                >
                  <UserIcon className="w-5 h-5 text-tertiary" />
                  {currentUser && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-black">{currentUser.role[0]}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col relative z-10 -mt-16">
              {currentScreen === 'main-menu' && (
                <MainMenuScreen
                  currentUser={currentUser}
                  onStartScheduledGame={handleStartScheduledGame}
                />
              )}

              {currentScreen === 'calendar' && (
                <CalendarScreen onBack={() => setCurrentScreen('main-menu')} />
              )}

              {currentScreen === 'lineup-builder' && (
                <LineupBuilderScreen onBack={() => setCurrentScreen('main-menu')} />
              )}

              {currentScreen === 'draft-mode' && (
                <DraftModeScreen onBack={() => setCurrentScreen('main-menu')} />
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
                <MyProfileScreen currentUser={currentUser} viewedPerson={viewedPerson} onBack={() => { setViewedPerson(null); setCurrentScreen('main-menu'); }} />
              )}

              {currentScreen === 'people-directory' && (
                <PeopleDirectoryScreen onBack={() => setCurrentScreen('main-menu')} onViewPerson={(person) => { setViewedPerson(person); setCurrentScreen('my-profile'); }} />
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
          </div>
        </>
      )}
    </div>
  );
}
