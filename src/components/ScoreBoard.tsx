"use client";

import { getStats } from "@/lib/storage";
import { useEffect, useState } from "react";
import { UserStats } from "@/lib/types";

export default function ScoreBoard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalSentences: 0,
    totalTime: 0,
    streak: 0,
    lastPracticeDate: "",
  });

  useEffect(() => {
    setStats(getStats());
    setMounted(true);
  }, []);

  const items = [
    { label: "已学句子", value: mounted ? stats.totalSentences : 0, icon: "📝" },
    {
      label: "学习时长",
      value: mounted ? `${Math.floor(stats.totalTime / 60)}分钟` : "0分钟",
      icon: "⏱️",
    },
    { label: "连续打卡", value: mounted ? `${stats.streak}天` : "0天", icon: "🔥" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center rounded-lg border border-gray-100 bg-white p-3"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1 text-base font-semibold text-gray-800">
            {item.value}
          </span>
          <span className="text-[11px] text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
