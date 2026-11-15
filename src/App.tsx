import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CURATED_SCENARIOS } from './data/scenarios';
import {
  ContextCategory,
  GameRoomState,
  PairMatchRecord,
  PlayerRole,
  RoomPhase,
  Scenario,
  VerificationFeedback,
} from './types/game';
import { TopBar, AppRoute } from './components/TopBar';
import { LandingView } from './components/LandingView';
import { Player1View } from './components/Player1View';
import { Player2View } from './components/Player2View';
import { TutorialView } from './components/TutorialView';
import { FreeLabView } from './components/FreeLabView';
import { RoundSummaryView } from './components/RoundSummaryView';
import { AchievementsView } from './components/AchievementsView';

const ROUND_SECONDS = 300; // 5 minuti

const STORAGE_BADGES_KEY = 'pitagora_unlocked_badges_v1';
const STORAGE_HISTORY_KEY = 'pitagora_match_history_v1';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [scenarios, setScenarios] = useState<Scenario[]>(CURATED_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(CURATED_SCENARIOS[0].id);

  // AI Scenario generation state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Gamification persistence
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BADGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [matchHistory, setMatchHistory] = useState<PairMatchRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Live synced room state (optional 2-device mode)
  const [liveRoomState, setLiveRoomState] = useState<GameRoomState | null>(null);
  const [mySeat, setMySeat] = useState<'seatA' | 'seatB'>('seatA');
  const [roomError, setRoomError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Local standalone match state (instant play from Home dual entry portals)
  const [localMatchActive, setLocalMatchActive] = useState(false);
  const [localRole, setLocalRole] = useState<PlayerRole>('player1');
  const [localScenarioId, setLocalScenarioId] = useState<string>(CURATED_SCENARIOS[0].id);
  const [localRound, setLocalRound] = useState<1 | 2>(1);
  const [localPhase, setLocalPhase] = useState<RoomPhase>('playing');
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(ROUND_SECONDS);
  const [localLives, setLocalLives] = useState<number>(3);
  const [localScore, setLocalScore] = useState<number>(0);
  const [localStreak, setLocalStreak] = useState<number>(0);
  const [localDefusedIds, setLocalDefusedIds] = useState<string[]>([]);
  const [localHintedIds, setLocalHintedIds] = useState<string[]>([]);
  const [localAttempts, setLocalAttempts] = useState<Record<string, number>>({});
  const [localFeedback, setLocalFeedback] = useState<VerificationFeedback | null>(null);
  const recordedSummaryRef = useRef<string | null>(null);

  const persistBadgesAndMatch = useCallback(
    (newBadges: string[], scenario: Scenario, round: 1 | 2, score: number, defused: number, lives: number) => {
      const mergedBadges = Array.from(new Set([...unlockedBadges, ...newBadges]));
      setUnlockedBadges(mergedBadges);
      try {
        localStorage.setItem(STORAGE_BADGES_KEY, JSON.stringify(mergedBadges));
      } catch {}

      const summaryKey = `${scenario.id}-${round}-${score}-${defused}`;
      if (recordedSummaryRef.current === summaryKey) return;
      recordedSummaryRef.current = summaryKey;

      const record: PairMatchRecord = {
        id: `${Date.now()}`,
        dateLabel: new Date().toLocaleDateString('it-IT', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        pairName: 'Coppia di Classe',
        scenarioTitle: scenario.title,
        score,
        defusedCount: defused,
        livesLeft: lives,
        round,
      };
      const updated = [record, ...matchHistory].slice(0, 12);
      setMatchHistory(updated);
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch {}
    },
    [unlockedBadges, matchHistory]
  );

  // Local 1-second timer when in standalone match mode
  useEffect(() => {
    if (liveRoomState || !localMatchActive || localPhase !== 'playing' || route !== 'game') {
      return;
    }
    const timer = window.setInterval(() => {
      setLocalTimeLeft((prev) => {
        if (prev <= 1) {
          setLocalPhase('round_summary');
          setLocalFeedback({
            type: 'hint',
            moduleId: '',
            title: 'Tempo di 05:00 scaduto!',
            message: 'È arrivato il momento di scambiare i ruoli per il Round 2.',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [liveRoomState, localMatchActive, localPhase, route]);

  // Persist results when entering round_summary
  useEffect(() => {
    if (liveRoomState && liveRoomState.phase === 'round_summary') {
      persistBadgesAndMatch(
        liveRoomState.unlockedBadges,
        liveRoomState.scenario,
        liveRoomState.round,
        liveRoomState.score,
        liveRoomState.defusedModuleIds.length,
        liveRoomState.lives
      );
    } else if (!liveRoomState && localMatchActive && localPhase === 'round_summary') {
      const scen = scenarios.find((s) => s.id === localScenarioId) || scenarios[0];
      const earned: string[] = [];
      if (localDefusedIds.length === 4) {
        if (localLives === 3) earned.push('precision_defuser');
        if (scen.context === 'enunciato') earned.push('pythagoras_master');
        if (scen.context === 'mappa') earned.push('urban_navigator');
        if (localTimeLeft > 120) earned.push('speed_thinker');
      }
      if (localRound >= 2) earned.push('team_swap');
      persistBadgesAndMatch(
        earned,
        scen,
        localRound,
        localScore,
        localDefusedIds.length,
        localLives
      );
    }
  }, [
    liveRoomState,
    localMatchActive,
    localPhase,
    localScenarioId,
    localDefusedIds.length,
    localLives,
    localTimeLeft,
    localRound,
    localScore,
    scenarios,
    persistBadgesAndMatch,
  ]);

  // WebSocket connector for live 2-device room
  const connectToRoomWs = useCallback((roomCode: string, seat: 'seatA' | 'seatB') => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', roomCode, seat }));
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'room_state') {
          setLiveRoomState(msg.state);
          setRoomError(null);
        } else if (msg.type === 'error') {
          setRoomError(msg.message || 'Errore nella stanza.');
        }
      } catch {}
    };

    ws.onerror = () => {
      setRoomError('Connessione live interrotta. Puoi continuare anche in modalità diretta.');
    };
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleGenerateAiScenario = async (context: ContextCategory) => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Impossibile generare uno scenario IA.');
      }
      const newScenario = data.scenario as Scenario;
      setScenarios((prev) => [newScenario, ...prev]);
      setSelectedScenarioId(newScenario.id);
    } catch (err: any) {
      setAiError(err?.message || 'Errore durante la generazione IA.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateRoom = async () => {
    setRoomError(null);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: selectedScenarioId }),
      });
      const data = await res.json();
      if (!res.ok || !data.state) {
        throw new Error(data?.error || 'Impossibile creare la stanza.');
      }
      setLiveRoomState(data.state);
      setMySeat('seatA');
      connectToRoomWs(data.state.roomCode, 'seatA');
    } catch (err: any) {
      setRoomError(err?.message || 'Errore creazione stanza.');
    }
  };

  const handleJoinRoom = async (code: string, role: PlayerRole) => {
    setRoomError(null);
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok || !data.state) {
        throw new Error(data?.error || 'Stanza non trovata.');
      }
      const state = data.state as GameRoomState;
      const seat: 'seatA' | 'seatB' =
        state.roleAssignments.seatA === role ? 'seatA' : 'seatB';
      setLiveRoomState(state);
      setMySeat(seat);
      connectToRoomWs(state.roomCode, seat);
      setRoute('game');
    } catch (err: any) {
      setRoomError(err?.message || 'Codice stanza non valido.');
    }
  };

  const handleEnterRole = (role: PlayerRole) => {
    recordedSummaryRef.current = null;
    if (liveRoomState) {
      const seat: 'seatA' | 'seatB' =
        liveRoomState.roleAssignments.seatA === role ? 'seatA' : 'seatB';
      setMySeat(seat);
      connectToRoomWs(liveRoomState.roomCode, seat);
      setRoute('game');
      return;
    }

    // Start instant standalone match
    setLocalMatchActive(true);
    setLocalRole(role);
    setLocalScenarioId(selectedScenarioId);
    setLocalRound(1);
    setLocalPhase('playing');
    setLocalTimeLeft(ROUND_SECONDS);
    setLocalLives(3);
    setLocalScore(0);
    setLocalStreak(0);
    setLocalDefusedIds([]);
    setLocalHintedIds([]);
    setLocalAttempts({});
    setLocalFeedback(null);
    setRoute('game');
  };

  const handleVerifyModule = (moduleId: string, errorClaimId: string, correctionId: string) => {
    if (liveRoomState && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'verify_module',
          roomCode: liveRoomState.roomCode,
          moduleId,
          errorClaimId,
          correctionId,
        })
      );
      return;
    }

    // Standalone local verification
    const scen = scenarios.find((s) => s.id === localScenarioId) || scenarios[0];
    const mod = scen.modules.find((m) => m.id === moduleId);
    if (!mod || localDefusedIds.includes(moduleId)) return;

    const prevAttempts = localAttempts[moduleId] || 0;
    setLocalAttempts((prev) => ({ ...prev, [moduleId]: prevAttempts + 1 }));

    const claimOk = errorClaimId === mod.correctErrorClaimId;
    const fixOk = correctionId === mod.correctCorrectionId;

    if (claimOk && fixOk) {
      const nextDefused = [...localDefusedIds, moduleId];
      setLocalDefusedIds(nextDefused);
      setLocalStreak((s) => s + 1);
      const firstTryBonus = prevAttempts === 0 ? 100 : 0;
      const hintPenalty = localHintedIds.includes(moduleId) ? 50 : 0;
      const delta = Math.max(150, 250 + firstTryBonus - hintPenalty);
      const timeBonus =
        nextDefused.length === scen.modules.length ? Math.round(localTimeLeft * 1.5) : 0;
      setLocalScore((s) => s + delta + timeBonus);
      setLocalFeedback({
        type: 'success',
        moduleId,
        title: `Modulo ${mod.index} disinnescato!`,
        message: mod.explanationOnDefuse,
        pointsDelta: delta + timeBonus,
      });

      if (nextDefused.length === scen.modules.length) {
        setLocalPhase('round_summary');
      }
    } else {
      setLocalStreak(0);
      const nextLives = Math.max(0, localLives - 1);
      setLocalLives(nextLives);
      let detail = mod.encouragementOnMiss;
      if (claimOk && !fixOk) {
        detail = `Hai trovato l’errore giusto! Ora verifica il calcolo della correzione: ${mod.positiveHint}`;
      } else if (!claimOk && fixOk) {
        detail = `La correzione scelta è valida, ma controlla quale frase del Giocatore 1 conteneva lo sbaglio. ${mod.positiveHint}`;
      }
      setLocalFeedback({
        type: 'miss',
        moduleId,
        title: 'Riprova con un indizio positivo',
        message: detail,
        pointsDelta: 0,
      });
      if (nextLives === 0) {
        setLocalPhase('round_summary');
      }
    }
  };

  const handleUseHint = (moduleId: string) => {
    if (liveRoomState && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'use_hint',
          roomCode: liveRoomState.roomCode,
          moduleId,
        })
      );
      return;
    }

    const scen = scenarios.find((s) => s.id === localScenarioId) || scenarios[0];
    const mod = scen.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    if (!localHintedIds.includes(moduleId)) {
      setLocalHintedIds((prev) => [...prev, moduleId]);
    }
    setLocalFeedback({
      type: 'hint',
      moduleId,
      title: `Aiuto Positivo · Modulo ${mod.index}`,
      message: mod.positiveHint,
    });
  };

  const handleSwapRoles = () => {
    recordedSummaryRef.current = null;
    if (liveRoomState && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const idx = scenarios.findIndex((s) => s.id === liveRoomState.scenarioId);
      const nextScenario = scenarios[(idx + 1) % scenarios.length];
      wsRef.current.send(
        JSON.stringify({
          type: 'swap_roles',
          roomCode: liveRoomState.roomCode,
          nextScenarioId: nextScenario.id,
        })
      );
      return;
    }

    const idx = scenarios.findIndex((s) => s.id === localScenarioId);
    const nextScenario = scenarios[(idx + 1) % scenarios.length];
    setLocalRole((r) => (r === 'player1' ? 'player2' : 'player1'));
    setLocalRound(2);
    setLocalScenarioId(nextScenario.id);
    setSelectedScenarioId(nextScenario.id);
    setLocalPhase('playing');
    setLocalTimeLeft(ROUND_SECONDS);
    setLocalLives(3);
    setLocalStreak(0);
    setLocalDefusedIds([]);
    setLocalHintedIds([]);
    setLocalAttempts({});
    setLocalFeedback(null);
  };

  // Active game projection (either synced room or local match)
  const activeScenario = liveRoomState
    ? liveRoomState.scenario
    : scenarios.find((s) => s.id === localScenarioId) || scenarios[0];
  const activeRole: PlayerRole = liveRoomState
    ? liveRoomState.roleAssignments[mySeat]
    : localRole;
  const activePhase = liveRoomState ? liveRoomState.phase : localPhase;
  const activeRound = liveRoomState ? liveRoomState.round : localRound;
  const activeTimeLeft = liveRoomState ? liveRoomState.timeLeft : localTimeLeft;
  const activeLives = liveRoomState ? liveRoomState.lives : localLives;
  const activeScore = liveRoomState ? liveRoomState.score : localScore;
  const activeDefused = liveRoomState ? liveRoomState.defusedModuleIds : localDefusedIds;
  const activeHinted = liveRoomState ? liveRoomState.hintedModuleIds : localHintedIds;
  const activeFeedback = liveRoomState ? liveRoomState.lastFeedback : localFeedback;

  const bestScore = Math.max(
    activeScore,
    ...matchHistory.map((m) => m.score),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <TopBar
        activeRoute={route}
        onNavigate={setRoute}
        hasActiveMatch={Boolean(liveRoomState || localMatchActive)}
        onPrimaryAction={() => {
          if ((liveRoomState || localMatchActive) && route !== 'game') {
            setRoute('game');
          } else {
            setLiveRoomState(null);
            setLocalMatchActive(false);
            setRoute('home');
          }
        }}
      />

      <div className="flex-1">
        {route === 'home' && (
          <LandingView
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
            onGenerateAiScenario={handleGenerateAiScenario}
            isGeneratingAi={isGeneratingAi}
            aiError={aiError}
            activeRoomCode={liveRoomState?.roomCode || null}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            roomError={roomError}
            onEnterRole={handleEnterRole}
            onOpenTutorial={() => setRoute('tutorial')}
          />
        )}

        {route === 'tutorial' && (
          <TutorialView onFinishToHome={() => setRoute('home')} />
        )}

        {route === 'lab' && <FreeLabView />}

        {route === 'achievements' && (
          <AchievementsView
            unlockedBadgeIds={unlockedBadges}
            matchHistory={matchHistory}
            bestScore={bestScore}
          />
        )}

        {route === 'game' && (
          <>
            {activePhase === 'round_summary' ? (
              <RoundSummaryView
                scenario={activeScenario}
                round={activeRound}
                score={activeScore}
                lives={activeLives}
                maxLives={3}
                timeLeft={activeTimeLeft}
                defusedModuleIds={activeDefused}
                unlockedBadges={unlockedBadges}
                onSwapRolesAndPlayNext={handleSwapRoles}
                onReturnHome={() => setRoute('home')}
              />
            ) : activeRole === 'player1' ? (
              <Player1View
                scenario={activeScenario}
                round={activeRound}
                timeLeft={activeTimeLeft}
                lives={activeLives}
                maxLives={3}
                score={activeScore}
                defusedModuleIds={activeDefused}
                roomCode={liveRoomState?.roomCode || null}
                isLiveSync={Boolean(liveRoomState)}
                onSwapRoles={handleSwapRoles}
                onQuickSwitchRole={!liveRoomState ? (r) => setLocalRole(r) : undefined}
              />
            ) : (
              <Player2View
                scenario={activeScenario}
                round={activeRound}
                timeLeft={activeTimeLeft}
                lives={activeLives}
                maxLives={3}
                score={activeScore}
                defusedModuleIds={activeDefused}
                hintedModuleIds={activeHinted}
                lastFeedback={activeFeedback}
                roomCode={liveRoomState?.roomCode || null}
                isLiveSync={Boolean(liveRoomState)}
                onVerifyModule={handleVerifyModule}
                onUseHint={handleUseHint}
                onSwapRoles={handleSwapRoles}
                onQuickSwitchRole={!liveRoomState ? (r) => setLocalRole(r) : undefined}
              />
            )}
          </>
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Disinnesca l’Errore: Missione Pitagora · Laboratorio Cooperativo di Geometria</span>
          <span>Teorema di Pitagora · Enunciato, Mappe Reali e Verifica Critica</span>
        </div>
      </footer>
    </div>
  );
}
