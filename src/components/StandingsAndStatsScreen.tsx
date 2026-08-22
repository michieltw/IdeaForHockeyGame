import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, Award, BarChart3 } from 'lucide-react';
import { GameState } from '../types';

interface StandingsAndStatsScreenProps {
  onBack: () => void;
}

interface TeamStanding {
  team: string;
  gp: number;
  w: number;
  l: number;
  t: number;
  gf: number;
  ga: number;
  pts: number;
  gd: number;
}

interface PlayerStat {
  player: string;
  team: string;
  goals: number;
  assists: number;
  points: number;
  pim: number;
}

export default function StandingsAndStatsScreen({ onBack }: StandingsAndStatsScreenProps) {
  const [activeTab, setActiveTab] = useState<'standings' | 'stats'>('standings');
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);

  useEffect(() => {
    try {
      const savedPlayed = localStorage.getItem('blackout_played_games');
      const playedGames: any[] = savedPlayed ? JSON.parse(savedPlayed) : [];

      // Calculate Standings
      const teamMap = new Map<string, TeamStanding>();

      const getOrCreateTeam = (teamName: string) => {
        if (!teamMap.has(teamName)) {
          teamMap.set(teamName, { team: teamName, gp: 0, w: 0, l: 0, t: 0, gf: 0, ga: 0, pts: 0, gd: 0 });
        }
        return teamMap.get(teamName)!;
      };

      playedGames.forEach((game) => {
        const homeName = game.homeTeam || 'Home';
        const awayName = game.awayTeam || 'Away';
        const homeScore = game.scoreHome || 0;
        const awayScore = game.scoreAway || 0;

        const homeTeam = getOrCreateTeam(homeName);
        const awayTeam = getOrCreateTeam(awayName);

        homeTeam.gp += 1;
        awayTeam.gp += 1;
        homeTeam.gf += homeScore;
        awayTeam.gf += awayScore;
        homeTeam.ga += awayScore;
        awayTeam.ga += homeScore;

        if (homeScore > awayScore) {
          homeTeam.w += 1;
          homeTeam.pts += 2;
          awayTeam.l += 1;
        } else if (awayScore > homeScore) {
          awayTeam.w += 1;
          awayTeam.pts += 2;
          homeTeam.l += 1;
        } else {
          homeTeam.t += 1;
          homeTeam.pts += 1;
          awayTeam.t += 1;
          awayTeam.pts += 1;
        }
      });

      const standingsArray = Array.from(teamMap.values()).map(t => ({
        ...t,
        gd: t.gf - t.ga
      })).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });

      setStandings(standingsArray);

      // Calculate Player Stats
      const playerMap = new Map<string, PlayerStat>();

      const getOrCreatePlayer = (playerName: string, teamName: string) => {
        const key = `${playerName}-${teamName}`;
        if (!playerMap.has(key)) {
          playerMap.set(key, { player: playerName, team: teamName, goals: 0, assists: 0, points: 0, pim: 0 });
        }
        return playerMap.get(key)!;
      };

      playedGames.forEach((game) => {
        if (game.events && Array.isArray(game.events)) {
          game.events.forEach((event: any) => {
            if (event.isUndone) return;

            if (event.type === 'goal' && event.scorer) {
              const scorer = getOrCreatePlayer(event.scorer, event.team);
              scorer.goals += 1;
              scorer.points += 1;

              if (event.assist1) {
                const a1 = getOrCreatePlayer(event.assist1, event.team);
                a1.assists += 1;
                a1.points += 1;
              }
              if (event.assist2) {
                const a2 = getOrCreatePlayer(event.assist2, event.team);
                a2.assists += 1;
                a2.points += 1;
              }
            } else if (event.type === 'penalty' && event.player) {
              const penalized = getOrCreatePlayer(event.player, event.team);
              penalized.pim += (event.penaltyMinutes || 2);
            }
          });
        }
      });

      const statsArray = Array.from(playerMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goals - a.goals;
      });

      setPlayerStats(statsArray);
    } catch (e) {
      console.error("Failed to parse played games for standings/stats", e);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface-container-low/50 backdrop-blur-md border-b border-[#2A2A2A] sticky top-0 z-50">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-[18px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-tertiary" />
          Standings & Stats
        </h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full flex flex-col gap-6 pt-6 pb-12">
        {/* Tabs */}
        <div className="flex p-1 bg-[#121212] rounded-lg border border-[#2A2A2A]">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex-1 py-2.5 rounded-md font-mono text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
              activeTab === 'standings'
                ? 'bg-tertiary text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Standings
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 rounded-md font-mono text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
              activeTab === 'stats'
                ? 'bg-tertiary text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Player Stats
          </button>
        </div>

        {/* Content */}
        <div className="bg-surface-container-low border border-[#2A2A2A] rounded-xl overflow-hidden shadow-xl">
          {activeTab === 'standings' && (
            <div className="overflow-x-auto">
              {standings.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-mono text-sm uppercase">No games played yet</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1a1a] border-b border-[#333] text-xs font-mono text-gray-400 uppercase tracking-wider">
                      <th className="p-3 pl-4">Team</th>
                      <th className="p-3 text-center">GP</th>
                      <th className="p-3 text-center">W</th>
                      <th className="p-3 text-center">L</th>
                      <th className="p-3 text-center">T</th>
                      <th className="p-3 text-center">GF</th>
                      <th className="p-3 text-center">GA</th>
                      <th className="p-3 text-center">GD</th>
                      <th className="p-3 pr-4 text-center text-tertiary">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {standings.map((s, idx) => (
                      <tr key={s.team} className="hover:bg-[#1a1a1a] transition-colors text-sm">
                        <td className="p-3 pl-4 font-bold text-white flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-4">{idx + 1}.</span>
                          {s.team}
                        </td>
                        <td className="p-3 text-center font-mono text-gray-300">{s.gp}</td>
                        <td className="p-3 text-center font-mono text-green-400">{s.w}</td>
                        <td className="p-3 text-center font-mono text-red-400">{s.l}</td>
                        <td className="p-3 text-center font-mono text-gray-400">{s.t}</td>
                        <td className="p-3 text-center font-mono text-gray-300">{s.gf}</td>
                        <td className="p-3 text-center font-mono text-gray-300">{s.ga}</td>
                        <td className={`p-3 text-center font-mono ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {s.gd > 0 ? `+${s.gd}` : s.gd}
                        </td>
                        <td className="p-3 pr-4 text-center font-black font-mono text-white text-base">{s.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="overflow-x-auto">
              {playerStats.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-mono text-sm uppercase">No player stats available</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1a1a] border-b border-[#333] text-xs font-mono text-gray-400 uppercase tracking-wider">
                      <th className="p-3 pl-4">Player</th>
                      <th className="p-3">Team</th>
                      <th className="p-3 text-center">G</th>
                      <th className="p-3 text-center">A</th>
                      <th className="p-3 text-center text-tertiary">PTS</th>
                      <th className="p-3 pr-4 text-center">PIM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {playerStats.map((p, idx) => (
                      <tr key={`${p.player}-${p.team}`} className="hover:bg-[#1a1a1a] transition-colors text-sm">
                        <td className="p-3 pl-4 font-bold text-white flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-4">{idx + 1}.</span>
                          {p.player}
                        </td>
                        <td className="p-3 text-gray-400 text-xs uppercase tracking-wider">{p.team}</td>
                        <td className="p-3 text-center font-mono text-gray-300">{p.goals}</td>
                        <td className="p-3 text-center font-mono text-gray-300">{p.assists}</td>
                        <td className="p-3 text-center font-black font-mono text-white text-base">{p.points}</td>
                        <td className="p-3 pr-4 text-center font-mono text-red-400">{p.pim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
