
import React, { useState, useMemo, useEffect } from 'react';
import RideCard from './components/RideCard';
import RideDetail from './components/RideDetail';
import RideFilters from './components/RideFilters';
import Onboarding from './components/Onboarding';
import CreateRideModal from './components/CreateRideModal';
import AIRouteAssistant from './components/AIRouteAssistant';
import Logo from './components/Logo';
import { MOCK_RIDES } from './constants';
import { Ride, GeoFilter, RidingPace, Comment, User } from './types';
import { fetchSimulatedCommunityRides } from './services/gemini';

type Tab = 'active' | 'my-rides' | 'community';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('crew_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem('crew_rides_db');
    return saved ? JSON.parse(saved) : MOCK_RIDES;
  });

  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Logic per gestire i giri condivisi via URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedRideData = params.get('shareRide');
    
    if (sharedRideData) {
      try {
        const decodedRide: Ride = JSON.parse(atob(sharedRideData));
        setRides(prev => {
          if (prev.some(r => r.id === decodedRide.id)) return prev;
          return [decodedRide, ...prev];
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}
    }
    setIsInitializing(false);
  }, []);

  // Simulazione del "Global Sync": Se l'utente non ha giri recenti, ne 'scopriamo' di nuovi via AI
  useEffect(() => {
    const syncCommunity = async () => {
      if (user && rides.length <= MOCK_RIDES.length + 1) { // Se ci sono pochi giri (solo i default e forse 1 creato)
        setIsLoadingCommunity(true);
        const discovered = await fetchSimulatedCommunityRides(user.region || 'Lombardia');
        
        if (discovered.length > 0) {
          const newRides: Ride[] = discovered.map((d, i) => ({
            id: `discovered-${Date.now()}-${i}`,
            title: d.title || 'Giro Community',
            country: 'Italia',
            region: user.region || 'Lombardia',
            province: d.province || 'Sondrio',
            location: d.location || 'Passo Montano',
            departurePoint: 'Piazza centrale',
            departureTime: new Date(Date.now() + 86400000 * (i + 1)).toISOString(),
            description: d.description || 'Giro scoperto nella community.',
            pace: (d.pace as RidingPace) || RidingPace.ALLEGRO,
            organizer: { id: `ai-${i}`, name: ['Miky', 'Gino', 'BikerX', 'Elena'][i % 4], avatar: `https://picsum.photos/id/${70+i}/100/100` },
            participants: [],
            comments: [],
            imageUrl: `https://picsum.photos/seed/ride-${i}/800/400`,
            mapCoords: { lat: 45, lng: 9 }
          }));
          
          setRides(prev => {
            const unique = newRides.filter(nr => !prev.some(pr => pr.title === nr.title));
            return [...prev, ...unique];
          });
        }
        setIsLoadingCommunity(false);
      }
    };

    if (!isInitializing && user) {
      syncCommunity();
    }
  }, [user, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem('crew_rides_db', JSON.stringify(rides));
    }
  }, [rides, isInitializing]);

  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [geoFilter, setGeoFilter] = useState<GeoFilter>({
    region: 'Tutte',
    province: 'Tutte',
    location: 'Tutte'
  });
  const [paceFilter, setPaceFilter] = useState<RidingPace | 'Tutti'>('Tutti');

  const filteredRides = useMemo(() => {
    let list = rides;
    if (activeTab === 'my-rides' && user) {
      list = rides.filter(r => r.organizer.id === user.id || r.participants.some(p => p.id === user.id));
    }
    return list.filter(ride => {
      const matchRegion = geoFilter.region === 'Tutte' || ride.region === geoFilter.region;
      const matchProvince = geoFilter.province === 'Tutte' || ride.province === geoFilter.province;
      const matchLocation = geoFilter.location === 'Tutte' || ride.location === geoFilter.location;
      const matchPace = paceFilter === 'Tutti' || ride.pace === paceFilter;
      return matchRegion && matchProvince && matchLocation && matchPace;
    });
  }, [rides, geoFilter, paceFilter, activeTab, user]);

  const allCommunityMembers = useMemo(() => {
    const membersMap = new Map<string, User>();
    rides.forEach(r => {
      membersMap.set(r.organizer.id, r.organizer);
      r.participants.forEach(p => membersMap.set(p.id, p));
    });
    if (user) membersMap.set(user.id, user);
    return Array.from(membersMap.values());
  }, [rides, user]);

  const selectedRide = useMemo(() => rides.find(r => r.id === selectedRideId) || null, [rides, selectedRideId]);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('crew_user_profile', JSON.stringify(newUser));
  };

  const handleAddComment = (rideId: string, text: string) => {
    if (!user) return;
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          text,
          timestamp: new Date().toISOString()
        };
        return { ...ride, comments: [...ride.comments, newComment] };
      }
      return ride;
    }));
  };

  const handleJoinRide = (rideId: string) => {
    if (!user) return;
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const isAlreadyParticipant = ride.participants.some(p => p.id === user.id);
        if (isAlreadyParticipant) return ride;
        return { ...ride, participants: [...ride.participants, user] };
      }
      return ride;
    }));
  };

  const handleSaveRide = (newRide: Ride) => {
    setRides(prev => [newRide, ...prev]);
    setIsCreateModalOpen(false);
    setSelectedRideId(newRide.id);
  };

  const handleLogout = () => {
    if (confirm("Vuoi cambiare profilo? I tuoi giri salvati resteranno su questo dispositivo.")) {
      localStorage.removeItem('crew_user_profile');
      window.location.reload();
    }
  };

  if (isInitializing) return null;

  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 md:pb-24 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('active')}>
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tighter brand-font leading-none uppercase">CREW</h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest hidden sm:block">GLOBAL BIKER NETWORK</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <button onClick={() => setActiveTab('active')} className={`${activeTab === 'active' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>Giri Attivi</button>
            <button onClick={() => setActiveTab('my-rides')} className={`${activeTab === 'my-rides' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>I Miei Giri</button>
            <button onClick={() => setActiveTab('community')} className={`${activeTab === 'community' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>Community</button>
          </nav>

          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar} 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-xl cursor-pointer hover:border-orange-500 transition-all active:scale-90" 
              alt="Avatar" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {activeTab === 'community' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6 italic brand-font">La <span className="text-orange-500">Crew</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allCommunityMembers.map(member => (
                <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center space-x-4">
                    <img src={member.avatar} className="w-12 h-12 rounded-xl border-2 border-slate-800" />
                    <div>
                      <h3 className="font-bold text-white">{member.name}</h3>
                      <p className="text-[10px] text-slate-500 uppercase">{member.region}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 space-y-6">
              <div className="hidden lg:block">
                <RideFilters 
                  filter={geoFilter}
                  onFilterChange={(update) => setGeoFilter(prev => ({ ...prev, ...update }))}
                  selectedPace={paceFilter}
                  onPaceChange={setPaceFilter}
                />
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                <span>PROOPONI GIRO</span>
              </button>
            </aside>

            <section className="lg:col-span-9">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white italic brand-font">
                  {activeTab === 'active' ? 'Giri Globali' : 'I Tuoi Giri'}
                  {isLoadingCommunity && <span className="ml-4 text-xs text-orange-500 animate-pulse lowercase font-normal italic">Sincronizzazione...</span>}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRides.map(ride => (
                  <RideCard key={ride.id} ride={ride} onClick={(id) => setSelectedRideId(id)} />
                ))}
              </div>
              
              {filteredRides.length === 0 && (
                <div className="py-20 text-center opacity-30">
                  <Logo className="w-20 h-20 mx-auto mb-4 grayscale" />
                  <p className="text-xl font-bold">Nessun giro in questa zona.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 flex justify-between items-center">
        <button onClick={() => setActiveTab('active')} className={`flex flex-col items-center ${activeTab === 'active' ? 'text-orange-500' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.944l6-1.5a2 2 0 01.894 0l6 1.5a2 2 0 011.553 1.944v8.764a2 2 0 01-1.553 1.944L11 20z" /></svg>
          <span className="text-[10px] font-bold mt-1">GIRI</span>
        </button>
        <button onClick={() => setIsAIModalOpen(true)} className="flex flex-col items-center -mt-10">
          <div className="w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center border-4 border-slate-950">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-[10px] font-bold mt-2 text-orange-500 uppercase tracking-tighter">AI Assist</span>
        </button>
        <button onClick={() => setActiveTab('community')} className={`flex flex-col items-center ${activeTab === 'community' ? 'text-orange-500' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[10px] font-bold mt-1 uppercase">CREW</span>
        </button>
      </div>

      <button 
        onClick={() => setIsAIModalOpen(true)}
        className="hidden lg:flex fixed bottom-10 right-10 w-20 h-20 bg-orange-500 rounded-full shadow-2xl items-center justify-center hover:scale-110 transition-all z-40"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </button>

      {selectedRide && <RideDetail ride={selectedRide} onClose={() => setSelectedRideId(null)} onAddComment={handleAddComment} onJoin={handleJoinRide} />}
      {isCreateModalOpen && <CreateRideModal currentUser={user} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveRide} />}
      {isAIModalOpen && <AIRouteAssistant user={user} onClose={() => setIsAIModalOpen(false)} />}
    </div>
  );
};

export default App;
