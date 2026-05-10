import BoutonRetour from '@/components/Bouton_retour';
import { useRespiration } from '@/controllers/useRespiration';
import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RespirationPage() {
  const {
    exerciceIndex, setExerciceIndex,
    actif, pause, setPause,
    phase, compteur, cyclesRestants,
    exercices, nbCycles, setNbCycles,
    demarrer, arreter, colors,
    estCustom, dureeCustom, setDureeCustom,
    estConnecte, chargement,
  } = useRespiration();

  const [menuOuvert, setMenuOuvert] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let toValue = 1;
    if (actif) {
      if (phase === 'inspiration' || phase === 'apnee') toValue = 1.25;
      else if (phase === 'expiration') toValue = 0.85;
    }
    Animated.timing(scaleAnim, { toValue, duration: 1000, useNativeDriver: true }).start();
  }, [phase, actif]);

  const phaseLabel = () => {
    if (!actif) return 'Prêt ?';
    switch (phase) {
      case 'inspiration': return 'Inspirez';
      case 'apnee':       return 'Retenez';
      case 'expiration':  return 'Expirez';
      default:            return 'Prêt ?';
    }
  };

  const circleColors = actif ? colors : { bg: '#dbeafe', text: '#3b82f6', circle: '#bfdbfe' };

  if (chargement) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const exerciceCourant = exercices[exerciceIndex] ?? exercices[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 }}>
        <BoutonRetour />
        <Text style={{ fontSize: 15, fontWeight: '700' }}>Respiration</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ width: '100%', zIndex: 20 }}>
          {!actif && (
            <View style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => setMenuOuvert(!menuOuvert)}
                style={{
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#f9fafb', padding: 12, borderRadius: 8,
                  borderWidth: 1, borderColor: menuOuvert ? '#3b82f6' : '#e5e7eb',
                }}
              >
                <Text style={{ fontSize: 14, color: '#374151' }}>{exerciceCourant.label}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{menuOuvert ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {menuOuvert && (
                <View style={{
                  position: 'absolute', top: 50, left: 0, right: 0, zIndex: 50,
                  backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb',
                  borderRadius: 8, elevation: 5
                }}>
                  {exercices.map((ex, i) => {
                    const estLeDernier = i === exercices.length - 1;
                    const isLocked = estLeDernier && !estConnecte;

                    return (
                      <TouchableOpacity
                        key={i}
                        disabled={isLocked}
                        onPress={() => { setExerciceIndex(i); setMenuOuvert(false); }}
                        style={{
                          padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
                          backgroundColor: isLocked ? '#f3f4f6' : (exerciceIndex === i ? '#f0fdf4' : 'white'),
                          opacity: isLocked ? 0.5 : 1
                        }}
                      >
                        <Text style={{ color: isLocked ? '#9ca3af' : (exerciceIndex === i ? '#16a34a' : '#4b5563') }}>
                          {ex.label} {isLocked ? '🔒' : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {!menuOuvert && (
                <View style={{ gap: 8 }}>
                   <View style={{ backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: '#4b5563' }}>Cycles</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => setNbCycles(Math.max(1, nbCycles - 1))} style={{ padding: 5 }}><Text style={{ fontWeight: 'bold' }}>−</Text></TouchableOpacity>
                        <Text style={{ fontWeight: '700' }}>{nbCycles}</Text>
                        <TouchableOpacity onPress={() => setNbCycles(Math.min(30, nbCycles + 1))} style={{ padding: 5 }}><Text style={{ fontWeight: 'bold' }}>+</Text></TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {estCustom && estConnecte && (
                    <View style={{ backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, gap: 10 }}>
                      {[
                        { label: 'Inspiration', key: 'inspiration', color: '#3b82f6' },
                        { label: 'Apnée', key: 'apnee', color: '#f97316' },
                        { label: 'Expiration', key: 'expiration', color: '#22c55e' },
                      ].map((item) => (
                        <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ width: 80, fontSize: 12 }}>{item.label}</Text>
                          <Slider
                            style={{ flex: 1 }}
                            minimumValue={item.key === 'apnee' ? 0 : 1}
                            maximumValue={20}
                            step={1}
                            value={dureeCustom[item.key as keyof typeof dureeCustom]}
                            onValueChange={(v) => setDureeCustom({ ...dureeCustom, [item.key]: v })}
                          />
                          <Text style={{ width: 30, textAlign: 'right' }}>{dureeCustom[item.key as keyof typeof dureeCustom]}s</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        <View style={{ alignItems: 'center' }}>
          <Animated.View style={{
            width: 150, height: 150, borderRadius: 75,
            backgroundColor: circleColors.bg,
            borderWidth: 3, borderColor: circleColors.circle,
            alignItems: 'center', justifyContent: 'center',
            transform: [{ scale: scaleAnim }]
          }}>
            <Text style={{ color: circleColors.text, fontWeight: '700' }}>{phaseLabel()}</Text>
            {actif && <Text style={{ fontSize: 40, fontWeight: '900', color: circleColors.text }}>{compteur}</Text>}
          </Animated.View>
          
          {actif && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: '#9ca3af', fontWeight: 'bold' }}>{nbCycles - cyclesRestants} / {nbCycles} Cycles</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100, justifyContent: 'center' }}>
          {!actif ? (
            <TouchableOpacity onPress={demarrer} style={{ backgroundColor: '#22c55e', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Démarrer</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <TouchableOpacity onPress={() => setPause(!pause)} style={{ backgroundColor: '#3b82f6', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{pause ? 'Reprendre' : 'Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={arreter} style={{ backgroundColor: '#ef4444', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Arrêter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}