"use client";

import dynamic from "next/dynamic";

const Terminal = dynamic(
  () => import("@/components/terminal/Terminal"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black">
      <Terminal />
    </main>
  );
}