"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Volume2, VolumeX, Baby } from "lucide-react";
import { COUNTRY_WEIGHTS, getCountryFlag } from "../utils/countryWeights";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BabyMap2D() {
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [flashingCountry, setFlashingCountry] = useState<string | null>(null);
  const [totalBirths, setTotalBirths] = useState<number>(0);
  const [countryCounts, setCountryCounts] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 1. Fetch TopoJSON asynchronously to populate countries cleanly without render-time setState
  useEffect(() => {
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((data) => {
        // world-atlas topojson features extraction
        const geometries = data.objects?.countries?.geometries || [];
        const names: string[] = geometries
          .map((g: any) => g.properties?.name)
          .filter(Boolean);

        if (names.length > 0) {
          setCountriesList(names);
        }
      })
      .catch(() => {
        // Fallback default country names if network delay occurs
        setCountriesList(Object.keys(COUNTRY_WEIGHTS));
      });
  }, []);

  // 2. Play Web Audio Ping
  const playPing = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Ignore audio block restrictions
    }
  };

  // 3. Real-time Simulation Engine
  useEffect(() => {
    if (countriesList.length === 0) return;

    const weights = countriesList.map((name) => COUNTRY_WEIGHTS[name] || 1.5);
    const totalWeight = weights.reduce((acc, val) => acc + val, 0);

    const interval = setInterval(() => {
      let rand = Math.random() * totalWeight;
      let selectedCountry = countriesList[0];

      for (let i = 0; i < countriesList.length; i++) {
        if (rand < weights[i]) {
          selectedCountry = countriesList[i];
          break;
        }
        rand -= weights[i];
      }

      setFlashingCountry(selectedCountry);
      setTotalBirths((prev) => prev + 1);
      setCountryCounts((prev) => ({
        ...prev,
        [selectedCountry]: (prev[selectedCountry] || 0) + 1,
      }));

      playPing();

      setTimeout(() => {
        setFlashingCountry(null);
      }, 220);
    }, 380);

    return () => clearInterval(interval);
  }, [countriesList, soundEnabled]);

  // 4. Sorted Leaderboard (Memoized)
  const sortedLeaderboard = useMemo(() => {
    return Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);
  }, [countryCounts]);

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col items-center pb-16 font-sans select-none">
      {/* Header */}
      <header className="w-full text-center pt-8 pb-4 px-4 max-w-2xl relative">
        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="absolute right-4 top-8 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Baby Map
        </h1>
        <p className="text-xl sm:text-2xl font-bold mt-2 text-slate-800 leading-snug">
          <span className="text-amber-500 font-extrabold">Flashes</span> every time a baby is <br />
          born in that country
        </p>
      </header>

      {/* 2D World Map Container */}
      <main className="w-full bg-[#edf6fd] border-y border-slate-200/80 shadow-inner flex items-center justify-center py-2">
        <div className="w-full max-w-4xl px-2">
          <ComposableMap
            projectionConfig={{ scale: 142, center: [0, 12] }}
            className="w-full h-auto max-h-[380px]"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties.name;
                  const isFlashing = flashingCountry === name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: isFlashing ? "#eab308" : "#2b3035",
                          stroke: "#475569",
                          strokeWidth: 0.35,
                          outline: "none",
                          transition: "fill 0.15s ease",
                        },
                        hover: {
                          fill: isFlashing ? "#eab308" : "#3b4247",
                          outline: "none",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </main>

      {/* Total Counter & Dynamic List */}
      <section className="w-full max-w-md px-4 mt-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Total Babies Born: {totalBirths.toLocaleString()}
        </h2>

        <div className="w-full mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
          <div className="flex justify-between items-center bg-[#edf2f7] px-6 py-3.5 text-slate-700 font-bold text-sm sm:text-base border-b border-slate-200">
            <span>Country</span>
            <span>Babies Born</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {sortedLeaderboard.map(([name, count], index) => {
              const isEven = index % 2 === 1;
              const isCurrentFlash = flashingCountry === name;

              return (
                <div
                  key={name}
                  className={`flex justify-between items-center px-6 py-3.5 transition-colors duration-150 ${
                    isCurrentFlash
                      ? "bg-amber-100/90"
                      : isEven
                      ? "bg-[#f8fafc]"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{getCountryFlag(name)}</span>
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">
                      {name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-base sm:text-lg">
                    {count}
                  </span>
                </div>
              );
            })}

            {sortedLeaderboard.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                <Baby className="w-4 h-4 animate-bounce" />
                Listening to world births...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}