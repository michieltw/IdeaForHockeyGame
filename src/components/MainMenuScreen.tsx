import { getGasUrl } from '../utils/gasUrl';
import { useState, useRef, useEffect } from 'react';
import { Play, Download, Upload, LogOut, User as UserIcon, Database as DatabaseIcon, CheckCircle, XCircle, Trophy, Globe, Users, Shield, Wrench, RefreshCcw, Calendar } from 'lucide-react';
import { defaultSettingsContract } from '../settingsContract';
import { User } from '../types';

interface MainMenuScreenProps {
  currentUser?: User | null;
  onNewGame: () => void;
  onStartScheduledGame: (game: any) => void;
  onLogout: () => void;
  onDatabase: () => void;
  onStats: () => void;
  onEcosystem?: () => void;
  onMyProfile?: () => void;
  onPeopleDirectory?: () => void;
  onTeamProfile?: () => void;
  onRosterBuilder?: () => void;
  onFreeAgency?: () => void;
  onCalendar: () => void;
  onLineupBuilder: () => void;
  onDraftMode: () => void;
}

export default function MainMenuScreen({ currentUser, onNewGame, onStartScheduledGame, onLogout, onDatabase, onStats, onEcosystem, onMyProfile, onPeopleDirectory, onTeamProfile, onRosterBuilder, onFreeAgency, onCalendar, onLineupBuilder, onDraftMode }: MainMenuScreenProps) {
  const [scheduledGames, setScheduledGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchScheduledGames = async () => {
      const gasUrl = getGasUrl();
      if (gasUrl) {
        try {
          const res = await fetch(gasUrl, { method: 'POST', body: JSON.stringify({ action: 'getScheduledGames' }) });
          const data = await res.json();
          if (Array.isArray(data) && data.length > 1) {
            const mapped = data.slice(1).map((row, i) => ({
              id: row[0] || Date.now().toString() + i,
              homeTeam: row[1] || '',
              awayTeam: row[2] || '',
              date: row[3] || '',
              time: row[4] || '',
              location: row[5] || '',
              competition: row[6] || '',
              matchType: row[7] || ''
            })).filter(g => g.homeTeam && g.awayTeam);
            if (mapped.length > 0) {
              setScheduledGames(mapped);
              return; // Successfully loaded from GAS
            }
          }
        } catch (e) {}
      }

      // Fallback to local storage
      const saved = localStorage.getItem('blackout_scheduled_games');
      if (saved) {
        try {
          setScheduledGames(JSON.parse(saved));
        } catch (e) {}
      }
    };
    fetchScheduledGames();
  }, []);

  const [videoPlaying, setVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dbStatus, setDbStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (videoRef.current) {
      Promise.resolve(videoRef.current.play()).catch(() => {
        // Autoplay might fail, fallback to skip
        setVideoPlaying(false);
      });
    }

    // Check DB status on mount
    const checkDb = async () => {
      const url = getGasUrl();
      if (!url || !url.includes('script.google.com')) {
        setDbStatus('error');
        return;
      }
      try {
        setDbStatus('success');
      } catch (e) {
        setDbStatus('error');
      }
    };
    checkDb();
  }, []);

  const handleVideoEnd = () => {
    setVideoPlaying(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportGames = async () => {
    const gasUrl = getGasUrl();
    if (gasUrl) {
      try {
        const res = await fetch(gasUrl, { method: 'POST', body: JSON.stringify({ action: 'getGames' }) });
        const data = await res.json();
        if (data && data.length > 0) {
          // If we had a specific format we'd download it here
        }
      } catch (e) {}
    }
    const savedPlayed = localStorage.getItem('blackout_played_games');
    const playedGames = savedPlayed ? JSON.parse(savedPlayed) : [];

    if (playedGames.length === 0) {
      alert("Er zijn geen gespeelde wedstrijden om te exporteren.");
      return;
    }

    const labels = defaultSettingsContract.gameSummaryLabels;
    let csvContent = `Game ID,${labels.csvHeaderDate},${labels.csvHeaderHome},${labels.csvHeaderAway},${labels.csvHeaderHomeScore},${labels.csvHeaderAwayScore},${labels.csvHeaderHomeSOG || 'Home SOG'},${labels.csvHeaderAwaySOG || 'Away SOG'},${labels.csvLocationLabel || 'Location'},${labels.csvCompetitionLabel || 'Competition'},${labels.csvMatchTypeLabel || 'Match Type'},Period,Clock Time,Situation,Player,Assist 1,Assist 2,Penalty Reason,Penalty Minutes,${labels.csvEventsHeaderTimestamp},${labels.csvEventsHeaderType},${labels.csvEventsHeaderTeam},${labels.csvEventsHeaderDesc},${labels.csvEventsHeaderX},${labels.csvEventsHeaderY}\n`;
    playedGames.forEach((game: any) => {
      const gameId = game.id || '';
      if (game.events && game.events.length > 0) {
        let runScoreHome = game.scoreHome || 0;
        let runScoreAway = game.scoreAway || 0;
        let runSogHome = game.sogHome || 0;
        let runSogAway = game.sogAway || 0;

        const lines = [];
        for (let i = 0; i < game.events.length; i++) {
          const e = game.events[i];
          if (!e.isUndone) {
            const cleanText = e.text ? e.text.replace(/"/g, '""') : '';
            const xVal = e.x !== undefined ? Math.round(e.x) : '';
            const yVal = e.y !== undefined ? Math.round(e.y) : '';
            const period = e.period || '';
            const clockTime = e.clockTime || '';
            const situation = e.situation || '';
            const player = e.player || '';
            const assist1 = e.assist1 || '';
            const assist2 = e.assist2 || '';
            const penaltyReason = e.penaltyReason || '';
            const penaltyMinutes = e.penaltyMinutes || '';

            lines.push(`"${gameId}","${game.date}","${game.homeTeam}","${game.awayTeam}",${runScoreHome},${runScoreAway},${runSogHome},${runSogAway},"${game.location || ''}","${game.competition || ''}","${game.matchType || ''}","${period}","${clockTime}","${situation}","${player}","${assist1}","${assist2}","${penaltyReason}","${penaltyMinutes}","${e.time || ''}","${e.type || ''}","${e.team || ''}","${cleanText}","${xVal}","${yVal}"\n`);

            if (e.type === 'goal') {
              if (e.team === game.homeTeam) runScoreHome--;
              if (e.team === game.awayTeam) runScoreAway--;
            } else if (e.type === 'shot') {
              if (e.team === game.homeTeam) runSogHome--;
              if (e.team === game.awayTeam) runSogAway--;
            }
          }
        }

        for (let i = lines.length - 1; i >= 0; i--) {
          csvContent += lines[i];
        }
      } else {
        csvContent += `"${gameId}","${game.date}","${game.homeTeam}","${game.awayTeam}",${game.scoreHome || 0},${game.scoreAway || 0},${game.sogHome || 0},${game.sogAway || 0},"${game.location || ''}","${game.competition || ''}","${game.matchType || ''}",,,,,,,,,,,,,\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const now = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `gespeelde_wedstrijden_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportGames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const newGames: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = line.split(',').map(c => {
            let val = c.replace(/^"|"$/g, '').trim();
            val = val.replace(/[<>]/g, ''); // Basic XSS prevention
            if (/^[=+\-@\t\r]/.test(val)) { // Prevent CSV injection
              val = "'" + val;
            }
            return val.substring(0, 100); // Enforce length limit
          });

          if (cols.length >= 3 && cols[1] && cols[2]) {
            newGames.push({
              id: cols[0] || Date.now().toString() + i,
              homeTeam: cols[1],
              awayTeam: cols[2],
              date: cols[3] || new Date().toISOString().split('T')[0],
              time: cols[4] || '20:00',
              location: cols[5] || 'Home Rink',
              competition: cols[6] || 'Geïmporteerd',
              matchType: cols[7] || 'Reguliere Competitie',
              homeRoster: [],
              awayRoster: []
            });
          }
        }

        if (newGames.length > 0) {
          const saved = localStorage.getItem('blackout_scheduled_games');
          const existingGames = saved ? JSON.parse(saved) : [];
          localStorage.setItem('blackout_scheduled_games', JSON.stringify([...newGames, ...existingGames]));
          alert(`${newGames.length} wedstrijden succesvol geïmporteerd!`);
        } else {
          alert('Geen geldige wedstrijden gevonden in de CSV. Let op het formaat.');
        }
      } catch (err) {
        console.error(err);
        alert('Fout bij het importeren van de CSV.');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen h-screen bg-background relative overflow-hidden">
      {/* Background Outline Player */}
      <div
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20"
      >
        <img
          src="https://cdn.shopify.com/s/files/1/1038/7203/7203/files/blackoutoutlineplayer.png?v=1786630623"
          alt="Background Player Outline"
          className="w-full h-full object-cover md:object-contain"
        />
      </div>

      {/* Video Transition Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 flex items-center justify-center ${
          videoPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {videoPlaying && (
          <video
            ref={videoRef}
            src="https://cdn.shopify.com/videos/c/o/v/3e51447def85482cbd9434b59757f97e.mp4"
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            playsInline
            muted
          />
        )}
        {videoPlaying && (
          <button
            className="absolute bottom-10 right-10 text-white/60 hover:text-white font-mono text-[12px] font-bold tracking-widest z-50 uppercase bg-black/40 px-3 py-1.5 rounded border border-white/20"
            onClick={handleVideoEnd}
          >
            SKIP
          </button>
        )}
      </div>

      {/* Top Right User Icon */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onMyProfile}
          className="w-10 h-10 rounded-full bg-surface-container-low border border-[#2A2A2A] hover:border-tertiary/60 hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-all shadow-md active:scale-95 group relative"
          title="My Profile"
        >
          <UserIcon className="w-5 h-5 text-tertiary" />
          {currentUser && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full flex items-center justify-center">
              <span className="text-[8px] font-bold text-black">{currentUser.role[0]}</span>
            </div>
          )}
        </button>
        <button
          onClick={onLogout}
          className="w-10 h-10 mt-2 rounded-full bg-surface-container-low border border-[#2A2A2A] hover:border-error/60 hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-error transition-all shadow-md active:scale-95 group relative"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main Menu Content */}
      <div className="flex-1 w-full flex flex-col justify-between py-6 px-4 md:px-0 max-w-lg mx-auto z-10">

        {/* Banner image with rounded edge fades */}
        <div className="relative w-full max-w-md mx-auto h-44 md:h-56 my-auto overflow-hidden flex items-center justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/1038/7203/7203/files/scorekeeper.png?v=1786003535"
            alt="Scorekeeper"
            className="w-full h-full object-contain"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 45%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 45%, transparent 100%)'
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(18,20,20,0) 30%, rgba(18,20,20,0.5) 70%, #121414 98%)'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 my-auto">
          <button
            onClick={onNewGame}
            className="w-full bg-tertiary text-black font-display text-[20px] md:text-[22px] font-bold py-4 rounded-lg raised-element bg-button-gradient hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(233,196,0,0.2)]"
          >
            <Play fill="currentColor" className="w-6 h-6" />
            NEW GAME
          </button>

          {scheduledGames.length > 0 && (
            <div className="bg-[#050505] border border-[#2A2A2A] rounded-lg p-2 max-h-40 overflow-y-auto flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase px-2 font-bold tracking-widest sticky top-0 bg-[#050505] z-10 py-1">Scheduled Games</span>
              {scheduledGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => onStartScheduledGame(game)}
                  className="w-full text-left bg-surface-container-low hover:bg-white/5 border border-outline-variant/30 rounded p-3 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-tertiary transition-colors">{game.homeTeam} vs {game.awayTeam}</span>
                    <span className="text-[10px] font-mono text-gray-400">{game.date} • {game.time} • {game.location}</span>
                  </div>
                  <Play className="w-4 h-4 text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={onDatabase}
              className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[12px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow relative"
            >
              <DatabaseIcon className="w-5 h-5" />
              DATABASE
              {dbStatus === 'success' && (
                <CheckCircle className="w-3 h-3 text-green-500 absolute top-2 right-2" />
              )}
              {dbStatus === 'error' && (
                <XCircle className="w-3 h-3 text-error absolute top-2 right-2" />
              )}
            </button>
            <button
              onClick={onStats}
              className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[12px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Trophy className="w-5 h-5 text-tertiary" />
              STATS
            </button>
            <button
              onClick={onEcosystem}
              className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[12px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Globe className="w-5 h-5 text-tertiary" />
              ECOSYSTEM
            </button>
          </div>

          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={onPeopleDirectory}
              className="w-full bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[12px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Users className="w-5 h-5 text-tertiary" />
              PEOPLE DIRECTORY
            </button>
          </div>

          {/* Phase 3, 4, 6 Features */}
          {(currentUser && (currentUser.role === 'Admin' || currentUser.role === 'League Manager' || currentUser.role === 'Team Manager')) && (
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={onTeamProfile}
                className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
              >
                <Shield className="w-4 h-4 text-tertiary" />
                Teams
              </button>
              <button
                onClick={onRosterBuilder}
                className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
              >
                <Wrench className="w-4 h-4 text-tertiary" />
                Rosters
              </button>
              {(currentUser && (currentUser.role === 'Admin' || currentUser.role === 'League Manager')) && (
                <button
                  onClick={onFreeAgency}
                  className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
                >
                  <RefreshCcw className="w-4 h-4 text-tertiary" />
                  Free Agency
                </button>
              )}
            </div>
          )}

          {(currentUser && (currentUser.role === 'Admin' || currentUser.role === 'League Manager' || currentUser.role === 'Team Manager')) && (
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={onCalendar}
                className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
              >
                <Calendar className="w-4 h-4 text-tertiary" />
                Calendar
              </button>
              <button
                onClick={onLineupBuilder}
                className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
              >
                <Users className="w-4 h-4 text-tertiary" />
                Lineups
              </button>
              {(currentUser && (currentUser.role === 'Admin' || currentUser.role === 'League Manager')) && (
                <button
                  onClick={onDraftMode}
                  className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1 uppercase shadow-md inner-glow"
                >
                  <Trophy className="w-4 h-4 text-tertiary" />
                  Draft
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-1">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImportGames}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Download className="w-4 h-4" />
              Import Games
            </button>
            <button
              onClick={handleExportGames}
              className="w-full bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[11px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Upload className="w-4 h-4" />
              Export Games
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
