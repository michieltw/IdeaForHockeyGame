import { GameState, GameEvent, GameConfig, ActivePenalty } from '../types';
import ScoreHeader from './Scorekeeper/ScoreHeader';
import MediaControls from './Scorekeeper/MediaControls';
import RinkMap from './Scorekeeper/RinkMap';
import ActionLog from './Scorekeeper/ActionLog';
import GoalModal from './Scorekeeper/GoalModal';
import PenaltyModal from './Scorekeeper/PenaltyModal';
import GameSummaryModal from './Scorekeeper/GameSummaryModal';
import PeriodEndModal from './Scorekeeper/PeriodEndModal';
import { SettingsContract } from '../settingsContract';
import { useScorekeeperState } from '../hooks/useScorekeeperState';

export default function ScorekeeperScreen({ contract, onBack }: { contract: SettingsContract; onBack: () => void }) {
  // VOLLEDIG SCHONE START: Geen aannames, geen hardcoded text, geen verzonnen getallen.
  const [config, setConfig] = useState<GameConfig>({
    homeTeam: contract.defaultHomeTeam,
    awayTeam: contract.defaultAwayTeam,
    homeColor: contract.defaultHomeColor,
    awayColor: contract.defaultAwayColor,
    homeLogo: contract.defaultHomeLogo,
    awayLogo: contract.defaultAwayLogo,
    homeRoster: contract.defaultHomeRoster,
    awayRoster: contract.defaultAwayRoster,
    settings: {
      periodLength: contract.defaultPeriodLength * 60,
      trackIcing: contract.defaultTrackIcing,
      trackOffside: contract.defaultTrackOffside,
      trackSOG: contract.defaultTrackSOG,
      officialGame: contract.defaultOfficialGame,
      gameType: 'League',
      attendance: contract.defaultAttendance,
      ticketsSold: contract.defaultTicketsSold,
      liveGame: true,
      teamSelection: 'Custom',
      allowFillInPlayers: false,
      gameClock: contract.defaultGameClock,
      clockPauseBehavior: contract.defaultClockPauseBehavior,
      autoStopAtPeriodEnd: contract.defaultAutoStopAtPeriodEnd,
      periodFormat: contract.defaultPeriodFormat,
      shootout: contract.defaultShootout,
      soRules: contract.defaultSoRules,
      trackSOGLocation: contract.defaultTrackSOGLocation,
      trackFOW: contract.defaultTrackFOW,
      faceoffLocation: contract.defaultFaceoffLocation,
      goalscorer: contract.defaultGoalscorer,
      assists: contract.defaultAssists,
      trackPenalties: contract.defaultTrackPenalties,
      penaltyClock: contract.defaultPenaltyClock,
      durationTypes: contract.defaultDurationTypes,
      officialsMode: contract.defaultOfficialsMode,
      linesmenMode: contract.defaultLinesmenMode,
      venueMode: contract.defaultVenueMode,
      capacity: contract.defaultCapacity,
      avgPrice: contract.defaultAvgPrice,
      haptics: false,
      stayAwake: false,
      autosave: false,
      localStorageEnabled: false,
      autogenerateCSV: false
    }
  });

  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    period: contract.defaultInitialPeriod,
    timeRemaining: contract.defaultPeriodLength * 60,
    stoppageTime: 0,
    sogHome: contract.defaultInitialSogHome,
    sogAway: contract.defaultInitialSogAway,
    scoreHome: contract.defaultInitialScoreHome,
    scoreAway: contract.defaultInitialScoreAway,
    events: []
  });

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('blackout_hockey_current_config');
      let loadedConfig: GameConfig | null = null;

      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as GameConfig;

        // Geen hardcoded 'Home' of 'Away' fallbacks meer
        if (!parsed.homeTeam || !parsed.homeTeam.trim()) {
          parsed.homeTeam = contract.defaultHomeTeam;
        }
        if (!parsed.awayTeam || !parsed.awayTeam.trim()) {
          parsed.awayTeam = contract.defaultAwayTeam;
        }
        setConfig(parsed);
        loadedConfig = parsed;
      }

      const savedGame = localStorage.getItem('blackout_hockey_saved_game');
      if (savedGame) {
        setGameState(JSON.parse(savedGame));
      } else if (loadedConfig) {
        setGameState(prev => ({
          ...prev,
          // Geen hardcoded (20 * 60) meer, pakt domweg wat er in config zit of start op 0
          timeRemaining: loadedConfig?.settings?.periodLength !== undefined ? loadedConfig.settings.periodLength : contract.defaultPeriodLength * 60,
          scoreHome: loadedConfig?.initialScoreHome !== undefined ? loadedConfig.initialScoreHome : contract.defaultInitialScoreHome,
          scoreAway: loadedConfig?.initialScoreAway !== undefined ? loadedConfig.initialScoreAway : contract.defaultInitialScoreAway,
          sogHome: loadedConfig?.initialSogHome !== undefined ? loadedConfig.initialSogHome : contract.defaultInitialSogHome,
          sogAway: loadedConfig?.initialSogAway !== undefined ? loadedConfig.initialSogAway : contract.defaultInitialSogAway,
          period: loadedConfig?.initialPeriod !== undefined ? loadedConfig.initialPeriod : contract.defaultInitialPeriod,
        }));
      }
    } catch(e) {}
  }, [contract]);

  const [isFaceoffMode, setIsFaceoffMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'shot' | 'goal' | 'penalty'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPeriodEndModal, setShowPeriodEndModal] = useState(false);
  const prevTimeRef = useRef(gameState.timeRemaining);
  const [rinkRotation, setRinkRotation] = useState(0);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [isGameSummaryOpen, setIsGameSummaryOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 2500);
  };

  useEffect(() => {
    let animationFrameId: number;
    let lastTick = performance.now();
    const isContinuousPenalty = config.settings?.penaltyClock === 'Continuous';

    const tick = (now: number) => {
      // Calculate delta time in seconds, we wait for at least 1 second (1000ms) to pass before updating
      const deltaMs = now - lastTick;

      if (deltaMs >= 1000) {
        // Find how many full seconds have passed
        const deltaSeconds = Math.floor(deltaMs / 1000);
        lastTick += deltaSeconds * 1000;

        setGameState(prev => {
          if (prev.isRunning) {
            const newTime = Math.max(0, prev.timeRemaining - deltaSeconds);
            let updatedPenalties = prev.activePenalties || [];
            if (updatedPenalties.length > 0) {
              updatedPenalties = updatedPenalties
                .map(p => ({ ...p, secondsRemaining: p.secondsRemaining - deltaSeconds }))
                .filter(p => p.secondsRemaining > 0);
            }

            let newIsRunning: boolean = prev.isRunning;
            if (newTime === 0 && config.settings?.autoStopAtPeriodEnd === 'Yes') {
              newIsRunning = false;
            }
            if (newTime === 0 && prev.timeRemaining > 0) {
              setTimeout(() => {
                setShowPeriodEndModal(true);
              }, 2000);
            }

            return {
              ...prev,
              isRunning: newIsRunning,
              timeRemaining: newTime,
              activePenalties: updatedPenalties
            };
          } else {
            let updatedPenalties = prev.activePenalties || [];
            if (isContinuousPenalty && updatedPenalties.length > 0) {
              updatedPenalties = updatedPenalties
                .map(p => ({ ...p, secondsRemaining: p.secondsRemaining - deltaSeconds }))
                .filter(p => p.secondsRemaining > 0);
            }

            return {
              ...prev,
              stoppageTime: prev.stoppageTime + deltaSeconds,
              activePenalties: updatedPenalties
            };
          }
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.isRunning, config.settings?.penaltyClock, config.settings?.autoStopAtPeriodEnd]);

  const handleTogglePlayPause = () => {
    if (gameState.isRunning) {
      setGameState(prev => ({ ...prev, isRunning: false }));
    } else {
      if (config.settings.trackFOW) {
        setIsFaceoffMode(true);
      } else {
        setGameState(prev => ({ ...prev, isRunning: true, stoppageTime: 0 }));
      }
    }
  };

  const handleStoppageCancel = () => {
    const isContinuousPenalty = config.settings?.penaltyClock === 'Continuous';
    setGameState(prev => {
      let updatedPenalties = prev.activePenalties || [];
      if (!isContinuousPenalty && updatedPenalties.length > 0) {
        updatedPenalties = updatedPenalties
          .map(p => ({ ...p, secondsRemaining: p.secondsRemaining - prev.stoppageTime }))
          .filter(p => p.secondsRemaining > 0);
      }
      return {
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - prev.stoppageTime),
        activePenalties: updatedPenalties,
        isRunning: true,
        stoppageTime: 0
      };
    });
    setIsFaceoffMode(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timeString = `${formatTime(gameState.timeRemaining)} P${gameState.period}`;

  const getPeriodString = () => {
    return gameState.period === 4 ? 'OT' : gameState.period >= 5 ? 'SO' : `P${gameState.period}`;
  };

  const getClockString = () => formatTime(gameState.timeRemaining);

  const getSituationString = (eventTeam: string) => {
    const homePenalties = (gameState.activePenalties || []).filter(p => p.team === config.homeTeam).length;
    const awayPenalties = (gameState.activePenalties || []).filter(p => p.team === config.awayTeam).length;
    const homeSkaters = Math.max(3, 5 - homePenalties);
    const awaySkaters = Math.max(3, 5 - awayPenalties);

export default function ScorekeeperScreen({ contract, onBack }: { contract: SettingsContract; onBack: () => void }) {
  const {
    config,
    gameState,
    setGameState,
    isFaceoffMode,
    setIsFaceoffMode,
    filter,
    setFilter,
    toastMessage,
    showPeriodEndModal,
    setShowPeriodEndModal,
    rinkRotation,
    setRinkRotation,
    isGoalModalOpen,
    setIsGoalModalOpen,
    isPenaltyModalOpen,
    setIsPenaltyModalOpen,
    isGameSummaryOpen,
    setIsGameSummaryOpen,
    handleTogglePlayPause,
    handleStoppageCancel,
    formatTime,
    handleAddShot,
    handleFaceoff,
    handleIcing,
    handleOffside,
    handleGoalSubmit,
    handlePenaltySubmit,
    handleFinishGame,
    handleSaveGame,
    handleUndo,
    showToast,
    timeString,
    getPeriodString,
    getClockString,
    getSituationString
  } = useScorekeeperState({ contract, onBack });

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto scrollbar-none bg-[#1a1a1a] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-xs shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {toastMessage}
        </div>
      )}

      <ScoreHeader
        gameState={gameState}
        formatTime={formatTime}
        onBack={onBack}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeColor={config.homeColor}
        awayColor={config.awayColor}
        homeLogo={config.homeLogo}
        awayLogo={config.awayLogo}
        trackPenalties={config.settings?.trackPenalties}
        onStoppageCancel={handleStoppageCancel}
        onAdjustTime={(seconds: number) => {
          setGameState(prev => ({
            ...prev,
            timeRemaining: Math.max(0, prev.timeRemaining + seconds)
          }));
        }}
        labels={contract.scoreHeaderLabels}
      />
      <MediaControls isRunning={gameState.isRunning} onToggle={handleTogglePlayPause} filter={filter} setFilter={setFilter} />
      <RinkMap
          rotation={rinkRotation}
          onRotate={(deg) => setRinkRotation(prev => (prev + deg) % 360)}
          isRunning={gameState.isRunning}
        stoppageTime={gameState.stoppageTime}
        isFaceoffMode={isFaceoffMode}
        setIsFaceoffMode={setIsFaceoffMode}
        onStoppageCancel={handleStoppageCancel}
        formatTime={formatTime}
        onAddShot={handleAddShot}
        onFaceoff={handleFaceoff}
        onIcing={handleIcing}
        onOffside={handleOffside}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenPenaltyModal={() => {
          if (config.settings?.trackPenalties === false) {
            showToast('Straffen bijhouden is uitgeschakeld in instellingen');
          } else {
            setIsPenaltyModalOpen(true);
          }
        }}
        onSaveGame={handleSaveGame}
        onEndGame={() => setIsGameSummaryOpen(true)}
        events={gameState.events}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeColor={config.homeColor}
        awayColor={config.awayColor}
        labels={contract.rinkMapLabels}
      />
      <ActionLog
        events={gameState.events}
        filter={filter}
        onUndo={handleUndo}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeColor={config.homeColor}
        awayColor={config.awayColor}
        labels={contract.actionLogLabels}
      />

      {/* Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeRoster={config.homeRoster}
        awayRoster={config.awayRoster}
        labels={contract.goalModalLabels}
      />

      {/* Penalty Modal */}
      <PenaltyModal
        isOpen={isPenaltyModalOpen}
        onClose={() => setIsPenaltyModalOpen(false)}
        onSubmit={handlePenaltySubmit}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeRoster={config.homeRoster}
        awayRoster={config.awayRoster}
        penaltyOptions={contract.penaltyReasonOptions}
        durationOptions={contract.penaltyDurationOptions}
        labels={contract.penaltyModalLabels}
      />

      {showPeriodEndModal && (
        <PeriodEndModal
          gameState={gameState}
          homeTeam={config.homeTeam}
          awayTeam={config.awayTeam}
          homeColor={config.homeColor}
          awayColor={config.awayColor}
          homeLogo={config.homeLogo}
          awayLogo={config.awayLogo}
          onResumeGame={(switchEnds) => {
            if (switchEnds) {
               setRinkRotation(prev => (prev + 180) % 360);
            }
            setGameState(prev => {
              const nextPeriod = prev.period + 1;
              let nextTime = config.settings?.periodLength || 20 * 60;
              if (nextPeriod === 4) nextTime = 5 * 60; // OT is usually 5 mins
              if (nextPeriod >= 5) nextTime = 0; // Shootout has no time
              return {
               ...prev,
               period: nextPeriod,
               timeRemaining: nextTime,
               stoppageTime: 0
              };
            });
            setShowPeriodEndModal(false);
            setIsFaceoffMode(true);
          }}
        />
      )}

      {/* Game Summary / End Game Modal */}
      <GameSummaryModal
        isOpen={isGameSummaryOpen}
        onClose={() => setIsGameSummaryOpen(false)}
        gameState={gameState}
        onUpdateEvents={(newEvents) => {
          setGameState(prev => {
            const validIds = new Set(newEvents.map(e => e.id));
            return {
              ...prev,
              events: newEvents,
              activePenalties: (prev.activePenalties || []).filter(p => !p.eventId || validIds.has(p.eventId))
            };
          });
        }}
        onFinishGame={handleFinishGame}
        homeTeam={config.homeTeam}
        awayTeam={config.awayTeam}
        homeColor={config.homeColor}
        awayColor={config.awayColor}
        homeLogo={config.homeLogo}
        awayLogo={config.awayLogo}
        location={config.location}
        competition={config.competition}
        matchType={config.matchType}
        officials={config.officials}
        linesmen={config.linesmen}
        date={config.date}
        time={config.time}
        settings={config.settings}
        labels={contract.gameSummaryLabels}
      />
    </div>
  );
}