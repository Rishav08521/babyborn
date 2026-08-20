"use client";

import dynamic from "next/dynamic";

const BabyMap2D = dynamic(() => import("../components/BabyMap2D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white text-slate-800">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      <p className="mt-4 font-semibold text-slate-600">Loading 2D World Map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">
      <BabyMap2D />
    </main>
  );
}