'use client';

import BoutonRetour from '@/components/Bouton_retour';
import { useRespiration } from '@/controllers/useRespiration';
import React, { useEffect, useState } from 'react';

export default function RespirationPage() {
  const {
    exerciceIndex,
    setExerciceIndex,
    actif,
    pause,
    setPause,
    phase,
    compteur,
    cyclesRestants,
    exercices,
    nbCycles,
    setNbCycles,
    demarrer,
    arreter,
    colors,
    estCustom,
    dureeCustom,
    setDureeCustom,
    estConnecte,
    indexCustomReel,
  } = useRespiration();

  const [menuOuvert, setMenuOuvert] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getScale = () => {
    if (!actif) return 'scale(1)';
    if (phase === 'expiration') return 'scale(0.85)';
    if (phase === 'inspiration' || phase === 'apnee') return 'scale(1.25)';
    return 'scale(1)';
  };

  const getPhaseLabel = () => {
    if (!actif) return 'Prêt ?';
    if (phase === 'inspiration') return 'Inspirez';
    if (phase === 'apnee') return 'Retenez';
    return 'Expirez';
  };

  const selectionnerExercice = (index: number) => {
    setExerciceIndex(index);
    setMenuOuvert(false);
  };

  const modifierDureeCustom = (
    champ: 'inspiration' | 'apnee' | 'expiration',
    valeur: string
  ) => {
    setDureeCustom({
      ...dureeCustom,
      [champ]: Number(valeur),
    });
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-white flex flex-col items-center p-4 overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between mb-2">
        <BoutonRetour />
        <h1 className="text-base font-bold">Respiration</h1>
        <div className="w-10" />
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col justify-around">
        {!actif && phase !== 'repos' && (
          <div className="relative z-20 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Mode
            </label>

            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className={`w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg border transition-all ${
                menuOuvert ? 'border-blue-500 rounded-b-none' : 'border-gray-200'
              }`}
            >
              <span className="text-sm text-gray-700">
                {exercices[exerciceIndex].label}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  menuOuvert ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOuvert && (
              <div className="absolute w-full bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-xl max-h-40 overflow-y-auto">
                {exercices.map((ex, i) => {
                  const isLocked = i === indexCustomReel && !estConnecte;

                  return (
                    <button
                      key={i}
                      disabled={isLocked}
                      onClick={() => selectionnerExercice(i)}
                      className={`w-full flex justify-between items-center p-3 border-t border-gray-50 ${
                        exerciceIndex === i
                          ? 'bg-green-50 text-green-600 font-bold'
                          : 'text-sm text-gray-600'
                      } ${
                        isLocked
                          ? 'opacity-50 cursor-not-allowed bg-gray-100'
                          : ''
                      }`}
                    >
                      <span>
                        {ex.label} {isLocked && '🔒'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {!menuOuvert && (
              <>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">
                      Cycles
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setNbCycles(Math.max(1, nbCycles - 1))}
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded font-bold"
                      >
                        −
                      </button>
                      <span className="font-bold text-sm w-4 text-center">
                        {nbCycles}
                      </span>
                      <button
                        onClick={() => setNbCycles(Math.min(30, nbCycles + 1))}
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {estCustom && estConnecte ? (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Personnaliser
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-blue-500 font-semibold w-20">
                        Inspiration
                      </span>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={dureeCustom.inspiration}
                        onChange={(e) =>
                          modifierDureeCustom('inspiration', e.target.value)
                        }
                        className="flex-1 accent-blue-500"
                      />
                      <span className="text-xs font-bold text-gray-600 w-6 text-right">
                        {dureeCustom.inspiration}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-orange-500 font-semibold w-20">
                        Apnée
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={dureeCustom.apnee}
                        onChange={(e) =>
                          modifierDureeCustom('apnee', e.target.value)
                        }
                        className="flex-1 accent-orange-500"
                      />
                      <span className="text-xs font-bold text-gray-600 w-6 text-right">
                        {dureeCustom.apnee}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-green-500 font-semibold w-20">
                        Expiration
                      </span>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={dureeCustom.expiration}
                        onChange={(e) =>
                          modifierDureeCustom('expiration', e.target.value)
                        }
                        className="flex-1 accent-green-500"
                      />
                      <span className="text-xs font-bold text-gray-600 w-6 text-right">
                        {dureeCustom.expiration}s
                      </span>
                    </div>
                  </div>
                ) : estCustom && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                    <p className="text-[11px] text-blue-600 font-bold">
                      Connectez-vous pour modifier les durées
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-48 h-48">
            <div
              className="absolute w-32 h-32 rounded-full opacity-20 transition-transform duration-[1000ms] ease-in-out"
              style={{
                backgroundColor: colors.circle,
                transform: getScale(),
                filter: 'blur(6px)',
              }}
            />
            <div
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 shadow-lg transition-all duration-[1000ms] ease-in-out"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.circle,
                transform: getScale(),
              }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-tighter mb-0.5"
                style={{ color: colors.text }}
              >
                {getPhaseLabel()}
              </span>

              {actif && (
                <span
                  className="text-4xl font-black"
                  style={{ color: colors.text }}
                >
                  {compteur}
                </span>
              )}
            </div>
          </div>

          {actif && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-black text-gray-800">
                {nbCycles - cyclesRestants} / {nbCycles}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Cycles
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center h-24">
          {!actif ? (
            <button
              onClick={demarrer}
              className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
            >
              {phase === 'repos' ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <button
                onClick={() => setPause(!pause)}
                className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm"
              >
                {pause ? (
                  <svg
                    className="w-6 h-6 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              <button
                onClick={arreter}
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic'
