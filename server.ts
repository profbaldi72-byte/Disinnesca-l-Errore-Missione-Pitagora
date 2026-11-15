import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { CURATED_SCENARIOS } from './src/data/scenarios.ts';
import {
  ContextCategory,
  GameRoomState,
  Scenario,
  ScenarioModule,
  VerificationFeedback,
} from './src/types/game.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const ROUND_DURATION_SECONDS = 300; // 5 minuti

const rooms = new Map<string, GameRoomState>();
const roomClients = new Map<string, Set<{ ws: WebSocket; seat: 'seatA' | 'seatB' | 'observer' }>>();
const aiScenarioCache = new Map<string, Scenario>();

function getScenarioById(id: string): Scenario {
  return (
    aiScenarioCache.get(id) ||
    CURATED_SCENARIOS.find((s) => s.id === id) ||
    CURATED_SCENARIOS[0]
  );
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function broadcastRoom(roomCode: string) {
  const state = rooms.get(roomCode);
  const clients = roomClients.get(roomCode);
  if (!state || !clients) return;
  const payload = JSON.stringify({ type: 'room_state', state });
  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

function updatePresence(roomCode: string) {
  const state = rooms.get(roomCode);
  const clients = roomClients.get(roomCode);
  if (!state || !clients) return;
  let seatAConnected = false;
  let seatBConnected = false;
  for (const c of clients) {
    if (c.ws.readyState === WebSocket.OPEN) {
      if (c.seat === 'seatA') seatAConnected = true;
      if (c.seat === 'seatB') seatBConnected = true;
    }
  }
  const p1 =
    (state.roleAssignments.seatA === 'player1' && seatAConnected) ||
    (state.roleAssignments.seatB === 'player1' && seatBConnected);
  const p2 =
    (state.roleAssignments.seatA === 'player2' && seatAConnected) ||
    (state.roleAssignments.seatB === 'player2' && seatBConnected);
  state.connectedSeats = {
    player1Connected: p1,
    player2Connected: p2,
  };
}

function checkBadges(state: GameRoomState): string[] {
  const unlocked = new Set(state.unlockedBadges);
  if (state.defusedModuleIds.length === 4) {
    if (state.lives === state.maxLives) {
      unlocked.add('precision_defuser');
    }
    if (state.scenario.context === 'enunciato') {
      unlocked.add('pythagoras_master');
    }
    if (state.scenario.context === 'mappa') {
      unlocked.add('urban_navigator');
    }
    if (state.timeLeft > 120) {
      unlocked.add('speed_thinker');
    }
  }
  if (state.round >= 2) {
    unlocked.add('team_swap');
  }
  return Array.from(unlocked);
}

function createRoomState(scenario: Scenario): GameRoomState {
  const roomCode = generateRoomCode();
  const state: GameRoomState = {
    roomCode,
    scenarioId: scenario.id,
    scenario,
    round: 1,
    phase: 'playing',
    timeLeft: ROUND_DURATION_SECONDS,
    durationSeconds: ROUND_DURATION_SECONDS,
    lives: 3,
    maxLives: 3,
    score: 0,
    streak: 0,
    defusedModuleIds: [],
    hintedModuleIds: [],
    attemptsByModule: {},
    roleAssignments: {
      seatA: 'player1',
      seatB: 'player2',
    },
    connectedSeats: {
      player1Connected: false,
      player2Connected: false,
    },
    lastFeedback: null,
    unlockedBadges: [],
  };
  rooms.set(roomCode, state);
  roomClients.set(roomCode, new Set());
  return state;
}

// Tick active rooms once per second
setInterval(() => {
  for (const [code, state] of rooms.entries()) {
    if (state.phase === 'playing') {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
        if (state.timeLeft === 0) {
          state.phase = 'round_summary';
          state.lastFeedback = {
            type: 'hint',
            moduleId: '',
            title: 'Tempo scaduto — Cambio di ruolo!',
            message:
              'I 5 minuti del round sono terminati. Confrontate i risultati e scambiatevi i ruoli per il Round 2!',
          };
        }
        broadcastRoom(code);
      }
    }
  }
}, 1000);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    let joinedRoomCode: string | null = null;
    let clientRecord: { ws: WebSocket; seat: 'seatA' | 'seatB' | 'observer' } | null = null;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'join') {
          const code = String(msg.roomCode || '').trim().toUpperCase();
          const state = rooms.get(code);
          if (!state) {
            ws.send(JSON.stringify({ type: 'error', message: 'Codice stanza non trovato.' }));
            return;
          }
          joinedRoomCode = code;
          const seat = msg.seat === 'seatA' || msg.seat === 'seatB' ? msg.seat : 'observer';
          clientRecord = { ws, seat };
          const set = roomClients.get(code) ?? new Set();
          set.add(clientRecord);
          roomClients.set(code, set);
          updatePresence(code);
          broadcastRoom(code);
          return;
        }

        if (!joinedRoomCode) return;
        const state = rooms.get(joinedRoomCode);
        if (!state) return;

        if (msg.type === 'verify_module') {
          if (state.phase !== 'playing') return;
          const moduleId = String(msg.moduleId || '');
          const errorClaimId = String(msg.errorClaimId || '');
          const correctionId = String(msg.correctionId || '');
          const mod = state.scenario.modules.find((m) => m.id === moduleId);
          if (!mod || state.defusedModuleIds.includes(moduleId)) return;

          const prevAttempts = state.attemptsByModule[moduleId] || 0;
          state.attemptsByModule[moduleId] = prevAttempts + 1;

          const claimCorrect = errorClaimId === mod.correctErrorClaimId;
          const fixCorrect = correctionId === mod.correctCorrectionId;

          if (claimCorrect && fixCorrect) {
            state.defusedModuleIds = [...state.defusedModuleIds, moduleId];
            state.streak += 1;
            const firstTryBonus = prevAttempts === 0 ? 100 : 0;
            const hintPenalty = state.hintedModuleIds.includes(moduleId) ? 50 : 0;
            const pointsDelta = Math.max(150, 250 + firstTryBonus - hintPenalty);
            state.score += pointsDelta;

            const feedback: VerificationFeedback = {
              type: 'success',
              moduleId,
              title: `Modulo ${mod.index} disinnescato!`,
              message: mod.explanationOnDefuse,
              pointsDelta,
            };
            state.lastFeedback = feedback;
            state.unlockedBadges = checkBadges(state);

            if (state.defusedModuleIds.length === state.scenario.modules.length) {
              const timeBonus = Math.round(state.timeLeft * 1.5);
              state.score += timeBonus;
              state.phase = 'round_summary';
              state.unlockedBadges = checkBadges(state);
            }
          } else {
            state.streak = 0;
            state.lives = Math.max(0, state.lives - 1);
            let detail = mod.encouragementOnMiss;
            if (claimCorrect && !fixCorrect) {
              detail = `Hai individuato l’errore giusto! Ora controlla bene il calcolo della correzione: ${mod.positiveHint}`;
            } else if (!claimCorrect && fixCorrect) {
              detail = `La correzione scelta è sensata, ma ricontrolla quale frase del Giocatore 1 contiene l’errore esatto. ${mod.positiveHint}`;
            }
            state.lastFeedback = {
              type: 'miss',
              moduleId,
              title: 'Riprova con un indizio positivo',
              message: detail,
              pointsDelta: 0,
            };
            if (state.lives === 0) {
              state.phase = 'round_summary';
            }
          }
          broadcastRoom(joinedRoomCode);
        } else if (msg.type === 'use_hint') {
          const moduleId = String(msg.moduleId || '');
          const mod = state.scenario.modules.find((m) => m.id === moduleId);
          if (!mod) return;
          if (!state.hintedModuleIds.includes(moduleId)) {
            state.hintedModuleIds = [...state.hintedModuleIds, moduleId];
          }
          state.lastFeedback = {
            type: 'hint',
            moduleId,
            title: `Aiuto Positivo · Modulo ${mod.index}`,
            message: mod.positiveHint,
          };
          broadcastRoom(joinedRoomCode);
        } else if (msg.type === 'swap_roles') {
          const nextId = String(msg.nextScenarioId || '');
          const currentIndex = CURATED_SCENARIOS.findIndex((s) => s.id === state.scenarioId);
          const fallbackNext = CURATED_SCENARIOS[(currentIndex + 1) % CURATED_SCENARIOS.length];
          const nextScenario = nextId ? getScenarioById(nextId) : fallbackNext;

          state.round = state.round === 1 ? 2 : 2;
          state.roleAssignments = {
            seatA: state.roleAssignments.seatA === 'player1' ? 'player2' : 'player1',
            seatB: state.roleAssignments.seatB === 'player1' ? 'player2' : 'player1',
          };
          state.scenarioId = nextScenario.id;
          state.scenario = nextScenario;
          state.phase = 'playing';
          state.timeLeft = ROUND_DURATION_SECONDS;
          state.lives = state.maxLives;
          state.streak = 0;
          state.defusedModuleIds = [];
          state.hintedModuleIds = [];
          state.attemptsByModule = {};
          state.lastFeedback = null;
          state.unlockedBadges = checkBadges(state);
          updatePresence(joinedRoomCode);
          broadcastRoom(joinedRoomCode);
        } else if (msg.type === 'finish_round') {
          state.phase = 'round_summary';
          state.unlockedBadges = checkBadges(state);
          broadcastRoom(joinedRoomCode);
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    });

    ws.on('close', () => {
      if (joinedRoomCode && clientRecord) {
        const set = roomClients.get(joinedRoomCode);
        if (set) {
          set.delete(clientRecord);
          updatePresence(joinedRoomCode);
          broadcastRoom(joinedRoomCode);
        }
      }
    });
  });

  // REST API: Create or fetch room
  app.post('/api/rooms', (req, res) => {
    const scenarioId = String(req.body?.scenarioId || CURATED_SCENARIOS[0].id);
    const scenario = getScenarioById(scenarioId);
    const state = createRoomState(scenario);
    res.json({ state });
  });

  app.get('/api/rooms/:code', (req, res) => {
    const code = String(req.params.code || '').trim().toUpperCase();
    const state = rooms.get(code);
    if (!state) {
      res.status(404).json({ error: 'Stanza non trovata. Controlla il codice a 4 caratteri.' });
      return;
    }
    res.json({ state });
  });

  // REST API: Generate new AI scenario with 4 hidden errors using @google/genai
  app.post('/api/scenarios/generate', async (req, res) => {
    const context = (req.body?.context || 'mappa') as ContextCategory;
    const validContexts: ContextCategory[] = ['enunciato', 'mappa', 'architettura', 'sport'];
    const targetContext: ContextCategory = validContexts.includes(context) ? context : 'mappa';

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error:
          'Chiave API Gemini non configurata sul server. Puoi comunque giocare con tutti gli scenari curati!',
      });
      return;
    }

    const contextLabels: Record<ContextCategory, string> = {
      enunciato: 'enunciato teorico, cateti, ipotenusa e formule inverse del Teorema di Pitagora',
      mappa: 'distanze su mappa cittadina, percorsi ortogonali e scorciatoie in linea d’aria',
      architettura: 'scale appoggiate al muro, rampe accessibili, tetti simmetrici e angoli retti',
      sport: 'campi sportivi, schermi TV/tablet e oggetti quotidiani con diagonali',
    };

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Sei un docente esperto di matematica per studenti italiani di 12 anni (classe 2ª media).
Genera uno scenario didattico per il gioco cooperativo "Disinnesca l'Errore" sul Teorema di Pitagora, ambientato nel contesto: ${contextLabels[targetContext]}.

REGOLE RIGOROSE:
1. Scrivi tutto in italiano naturale, chiaro e coinvolgente per ragazzi di 12 anni.
2. Lo scenario deve contenere ESATTAMENTE 4 moduli indipendenti.
3. Ogni modulo contiene un breve paragrafo scritto da un'IA sbadatella ("aiParagraph") con ESATTAMENTE UN errore matematico o concettuale nascosto sul Teorema di Pitagora (usa terne pitagoriche pulite come 3-4-5, 6-8-10, 5-12-13, 8-15-17, 10-24-26 o multipli semplici).
4. Verifica che tutti i calcoli nelle correzioni siano matematicamente impeccabili al 100%.
5. Per ogni modulo fornisci:
   - "suspiciousSnippets": 2 o 3 brevi frasi esatte presenti dentro "aiParagraph" (copiate parola per parola).
   - "errorClaimOptions": 4 opzioni brevi (id "ec-1", "ec-2", "ec-3", "ec-4") di cui una sola descrive l'errore reale ("correctErrorClaimId").
   - "correctionOptions": 3 opzioni brevi (id "co-1", "co-2", "co-3") di cui una sola contiene la correzione esatta ("correctCorrectionId").
   - "manualRefId": scegli tra "sec-enunciato", "sec-formula", "sec-inverse", "sec-terne", "sec-mappe", "sec-reali".
   - "positiveHint": un suggerimento positivo e costruttivo per guidare lo studente senza svelare subito la risposta.
   - "encouragementOnMiss": un messaggio di rinforzo positivo se lo studente sbaglia tentativo.
   - "explanationOnDefuse": la spiegazione chiara e celebrativa quando disinnesca il modulo.
   - "presetLabValues": due cateti interi positivi tra 3 e 24 ("a", "b") adatti al modulo e la loro unità ("cm", "m", "dm").`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              briefingForPlayer1: { type: Type.STRING },
              briefingForPlayer2: { type: Type.STRING },
              sampleA: { type: Type.INTEGER },
              sampleB: { type: Type.INTEGER },
              unit: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    aiParagraph: { type: Type.STRING },
                    suspiciousSnippets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    errorClaimOptions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                        },
                        required: ['id', 'text'],
                      },
                    },
                    correctErrorClaimId: { type: Type.STRING },
                    correctionOptions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                        },
                        required: ['id', 'text'],
                      },
                    },
                    correctCorrectionId: { type: Type.STRING },
                    manualRefId: { type: Type.STRING },
                    positiveHint: { type: Type.STRING },
                    encouragementOnMiss: { type: Type.STRING },
                    explanationOnDefuse: { type: Type.STRING },
                    presetA: { type: Type.INTEGER },
                    presetB: { type: Type.INTEGER },
                    presetUnit: { type: Type.STRING },
                    labelA: { type: Type.STRING },
                    labelB: { type: Type.STRING },
                    labelC: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'aiParagraph',
                    'suspiciousSnippets',
                    'errorClaimOptions',
                    'correctErrorClaimId',
                    'correctionOptions',
                    'correctCorrectionId',
                    'manualRefId',
                    'positiveHint',
                    'encouragementOnMiss',
                    'explanationOnDefuse',
                    'presetA',
                    'presetB',
                    'presetUnit',
                    'labelA',
                    'labelB',
                    'labelC',
                  ],
                },
              },
            },
            required: [
              'title',
              'subtitle',
              'briefingForPlayer1',
              'briefingForPlayer2',
              'sampleA',
              'sampleB',
              'unit',
              'modules',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Risposta vuota dal modello IA');
      }
      const parsed = JSON.parse(rawText);
      const id = `ai-${targetContext}-${Date.now()}`;

      const diagramTypeMap: Record<ContextCategory, Scenario['diagramConfig']['type']> = {
        enunciato: 'triangle',
        mappa: 'city_map',
        architettura: 'ladder_ramp',
        sport: 'sports_screen',
      };

      const modules: ScenarioModule[] = (parsed.modules || []).slice(0, 4).map((m: any, idx: number) => ({
        id: `${id}-mod-${idx + 1}`,
        index: idx + 1,
        title: m.title || `Modulo ${idx + 1}`,
        aiParagraph: m.aiParagraph || '',
        suspiciousSnippets: Array.isArray(m.suspiciousSnippets) ? m.suspiciousSnippets : [],
        errorClaimOptions: Array.isArray(m.errorClaimOptions) ? m.errorClaimOptions : [],
        correctErrorClaimId: m.correctErrorClaimId || m.errorClaimOptions?.[0]?.id || 'ec-1',
        correctionOptions: Array.isArray(m.correctionOptions) ? m.correctionOptions : [],
        correctCorrectionId: m.correctCorrectionId || m.correctionOptions?.[0]?.id || 'co-1',
        manualRefId: m.manualRefId || 'sec-enunciato',
        positiveHint: m.positiveHint || 'Controlla la formula a² + b² = c² sul manuale!',
        encouragementOnMiss:
          m.encouragementOnMiss || 'Ottimo tentativo! Controlla bene quale lato è l’ipotenusa.',
        explanationOnDefuse: m.explanationOnDefuse || 'Modulo disinnescato correttamente!',
        presetLabValues: {
          a: Math.max(2, Math.min(24, Number(m.presetA) || 3)),
          b: Math.max(2, Math.min(24, Number(m.presetB) || 4)),
          unit: m.presetUnit || 'm',
          labelA: m.labelA || 'Cateto a',
          labelB: m.labelB || 'Cateto b',
          labelC: m.labelC || 'Ipotenusa c',
          mode: 'hypotenuse',
        },
      }));

      if (modules.length < 4) {
        throw new Error('Lo scenario generato non contiene tutti e 4 i moduli.');
      }

      const scenario: Scenario = {
        id,
        title: parsed.title || 'Missione IA su Pitagora',
        subtitle: parsed.subtitle || 'Scenario inedito generato per la sfida in coppia',
        context: targetContext,
        difficulty: 'Intermedio',
        isAiGenerated: true,
        briefingForPlayer1: parsed.briefingForPlayer1,
        briefingForPlayer2: parsed.briefingForPlayer2,
        diagramConfig: {
          type: diagramTypeMap[targetContext],
          caption: 'Schema visivo dello scenario generato dall’IA',
          sampleA: Math.max(3, Number(parsed.sampleA) || 6),
          sampleB: Math.max(4, Number(parsed.sampleB) || 8),
          unit: parsed.unit || 'm',
        },
        modules,
      };

      aiScenarioCache.set(scenario.id, scenario);
      res.json({ scenario });
    } catch (err: any) {
      console.error('Gemini scenario generation error:', err);
      res.status(500).json({
        error:
          err?.message ||
          'Impossibile generare uno scenario IA in questo momento. Puoi usare subito gli scenari curati.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Missione Pitagora server running on http://localhost:${PORT}`);
  });
}

startServer();
