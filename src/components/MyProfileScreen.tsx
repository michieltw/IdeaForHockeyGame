import { useState } from 'react';
import { ArrowLeft, User as UserIcon, Briefcase, Ruler, Shield, Plus, Edit2, Calendar, Star, Medal } from 'lucide-react';
import { User, Achievement, Award } from '../types';

interface MyProfileScreenProps {
  currentUser: User | null;
  onBack: () => void;
}

export default function MyProfileScreen({ currentUser, onBack }: MyProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'jobs' | 'equipment' | 'events' | 'achievements'>('details');
  const [rsvps, setRsvps] = useState<Record<string, string>>({
    'evt-1': 'Maybe',
    'evt-2': 'Attending'
  });

  const dummyBadges: Achievement[] = [
    { id: 'b1', name: '100 Career Goals' },
    { id: 'b2', name: 'Hat Trick Hero' }
  ];

  const dummyAwards: Award[] = [
    { id: 'a1', name: 'MVP 2023' },
    { id: 'a2', name: 'Best Forward' }
  ];

  const dummyEvents = [
    { id: 'evt-1', title: 'Practice - Blackout HC', date: '2024-11-15 20:00' },
    { id: 'evt-2', title: 'Game vs Spartans', date: '2024-11-18 19:30' }
  ];

  const handleRsvpChange = (eventId: string, status: string) => {
    setRsvps(prev => ({ ...prev, [eventId]: status }));
  };

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
          <UserIcon className="w-5 h-5 text-tertiary" />
          My Profile
        </h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 w-full max-w-3xl mx-auto flex flex-col gap-6">
        {/* Profile Overview Card */}
        <div className="bg-surface-container-low border border-[#2A2A2A] rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-tertiary flex items-center justify-center text-tertiary shadow-lg">
                <UserIcon className="w-12 h-12" />
            </div>

            <div className="flex flex-col items-center md:items-start flex-1 z-10">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">Player One</h2>
                    <span className="bg-tertiary text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                        {currentUser?.role || 'User'}
                    </span>
                </div>
                <p className="text-on-surface-variant font-mono text-sm mb-4">{currentUser?.email || 'No email provided'}</p>

                <button className="bg-surface-container-highest border border-[#2A2A2A] hover:border-tertiary/50 hover:bg-white/5 transition-all text-white px-4 py-2 rounded text-xs font-mono font-bold tracking-widest flex items-center gap-2 uppercase">
                    <Edit2 className="w-3 h-3" /> Edit Profile
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2A2A2A]">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 font-mono text-[11px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            Details
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-3 font-mono text-[11px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'jobs' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 py-3 font-mono text-[11px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'equipment' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Equipment
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 font-mono text-[11px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'events' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            RSVPs
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 font-mono text-[11px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'achievements' ? 'border-tertiary text-tertiary' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <Medal className="w-4 h-4" />
            Awards
          </button>
        </div>

        {/* Tab Content Placeholder */}
        <div className="bg-[#050505] border border-[#2A2A2A] rounded-lg p-6">
            {activeTab === 'details' && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold mb-2">Personal & Physical Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-on-surface-variant">
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Birthdate</span>
                            <span className="text-white">1990-01-01</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Phone</span>
                            <span className="text-white">+1 555-0198</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Height</span>
                            <span className="text-white">6'1"</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Weight</span>
                            <span className="text-white">190 lbs</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Handedness</span>
                            <span className="text-white">Right</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-500 mb-1">Status</span>
                            <span className="text-tertiary">Active</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'jobs' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold">Assigned Jobs & Roles</h3>
                        <button className="text-tertiary flex items-center gap-1 text-xs font-mono uppercase tracking-widest hover:brightness-110">
                            <Plus className="w-3 h-3" /> Add Job
                        </button>
                    </div>
                    <div className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <span className="text-white font-bold">Head Coach</span>
                            <span className="text-xs bg-[#2A2A2A] text-gray-300 px-2 py-1 rounded">Blackout HC</span>
                        </div>
                        <span className="text-sm text-on-surface-variant">Role: Coach</span>
                    </div>
                </div>
            )}

            {activeTab === 'equipment' && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold mb-2">Preferred Equipment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Stick Brand</span>
                            <span className="text-white font-bold">Bauer</span>
                        </div>
                        <div className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Skate Brand</span>
                            <span className="text-white font-bold">CCM</span>
                        </div>
                        <div className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Helmet Brand</span>
                            <span className="text-white font-bold">Warrior</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold mb-2">Upcoming Events & RSVPs</h3>
                    <div className="flex flex-col gap-4">
                        {dummyEvents.map(event => (
                            <div key={event.id} className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h4 className="text-white font-bold">{event.title}</h4>
                                    <p className="text-sm text-on-surface-variant font-mono">{event.date}</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {['Attending', 'Not Attending', 'Maybe'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleRsvpChange(event.id, status)}
                                            className={`flex-1 md:flex-none px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest rounded border transition-colors ${
                                                rsvps[event.id] === status
                                                    ? 'bg-tertiary text-black border-tertiary'
                                                    : 'bg-transparent text-on-surface-variant border-[#2A2A2A] hover:border-tertiary/50 hover:text-white'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'achievements' && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Medal className="w-5 h-5 text-tertiary" />
                        <h3 className="text-white font-bold">Awards & Trophies</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {dummyAwards.map(award => (
                              <div key={award.id} className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col items-center justify-center gap-2">
                                  <Medal className="w-8 h-8 text-yellow-400" />
                                  <span className="text-white font-bold text-center text-sm">{award.name}</span>
                              </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-tertiary" />
                        <h3 className="text-white font-bold">Badges & Milestones</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {dummyBadges.map(badge => (
                              <div key={badge.id} className="bg-surface-container-low border border-[#2A2A2A] rounded p-4 flex flex-col items-center justify-center gap-2">
                                  <Shield className="w-8 h-8 text-tertiary" />
                                  <span className="text-white font-bold text-center text-sm">{badge.name}</span>
                              </div>
                          ))}
                      </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
