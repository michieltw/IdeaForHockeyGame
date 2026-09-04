import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, Filter } from 'lucide-react';
import { getGasUrl } from '../utils/gasUrl';
import { fetchGasData } from '../utils/fetchGas';

interface PlayersScreenProps {
  onBack: () => void;
}

interface PlayerView {
  id: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  primary_position?: string;
  handedness?: string;
}

export default function PlayersScreen({ onBack }: PlayersScreenProps) {
  const [players, setPlayers] = useState<PlayerView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = getGasUrl();
      if (!url) {
        throw new Error("No database URL set. Please connect in Database settings.");
      }

      const [playersRes, personsRes] = await Promise.all([
        fetchGasData(url, { action: 'getEcosystemData', sheetName: 'players' }),
        fetchGasData(url, { action: 'getEcosystemData', sheetName: 'persons' })
      ]);

      const playersResult = await playersRes.json();
      const personsResult = await personsRes.json();

      if (playersResult.status === 'Success' && personsResult.status === 'Success') {
        const personsData = personsResult.data || [];
        const playersData = playersResult.data || [];

        const merged: PlayerView[] = playersData.map((player: any) => {
          const person = personsData.find((p: any) => p.id === player.person_id) || {};
          return {
            id: player.id,
            first_name: person.first_name || 'Unknown',
            last_name: person.last_name || 'Person',
            photo_url: person.photo_url,
            primary_position: player.primary_position,
            handedness: player.handedness
          };
        });
        setPlayers(merged);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) return false;
    if (filterPosition !== 'All' && p.primary_position !== filterPosition) return false;
    return true;
  });

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
          <Users className="w-5 h-5 text-tertiary" />
          Players
        </h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl mx-auto flex flex-col gap-6">

        {/* Filters */}
        <div className="bg-surface-container-low border border-[#2A2A2A] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#050505] border border-[#2A2A2A] rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-tertiary"
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="bg-[#050505] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-tertiary"
                >
                    <option value="All">All Positions</option>
                    <option value="Center">Center</option>
                    <option value="Left Wing">Left Wing</option>
                    <option value="Right Wing">Right Wing</option>
                    <option value="Defense">Defense</option>
                    <option value="Goalie">Goalie</option>
                </select>
            </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 font-mono text-sm">Loading players...</div>
        ) : error ? (
          <div className="text-center py-10 text-error font-mono text-sm border border-dashed border-error/50 rounded-lg p-4 bg-error/10">
            {error}
          </div>
        ) : (
          /* Directory List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlayers.map(player => (
                  <div key={player.id} className="bg-[#050505] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-4 hover:border-tertiary/50 transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high border border-[#2A2A2A] flex items-center justify-center text-on-surface-variant group-hover:text-tertiary transition-colors overflow-hidden">
                          {player.photo_url ? (
                              <img src={player.photo_url} alt={`${player.first_name} ${player.last_name}`} className="w-full h-full object-cover" />
                          ) : (
                              <Users className="w-6 h-6" />
                          )}
                      </div>
                      <div className="flex-1">
                          <h3 className="text-white font-bold group-hover:text-tertiary transition-colors">{player.first_name} {player.last_name}</h3>
                          <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-xs text-on-surface-variant font-mono">Position: {player.primary_position || 'N/A'}</span>
                              <span className="text-xs text-on-surface-variant font-mono">Shoots: {player.handedness || 'N/A'}</span>
                          </div>
                      </div>
                  </div>
              ))}

              {filteredPlayers.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500 font-mono text-sm border border-dashed border-[#2A2A2A] rounded-lg">
                      No players found matching filters.
                  </div>
              )}
          </div>
        )}

      </div>
    </div>
  );
}
