import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TeamMember } from "@/stores/mockData";

interface MultiplayerCursorsProps {
  members: TeamMember[];
}

interface CursorPos {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

// Simulate other users' cursors moving around the viewport
export function MultiplayerCursors({ members }: MultiplayerCursorsProps) {
  const [cursors, setCursors] = useState<CursorPos[]>([]);

  useEffect(() => {
    const onlineOthers = members.filter((m) => m.isOnline).slice(0, 2);
    if (onlineOthers.length === 0) return;

    // Initialize with random positions
    setCursors(
      onlineOthers.map((m) => ({
        id: m.id,
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 300,
        name: m.name.split(" ")[0],
        color: m.color,
      }))
    );

    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((c) => ({
          ...c,
          x: Math.max(50, Math.min(900, c.x + (Math.random() - 0.5) * 80)),
          y: Math.max(100, Math.min(500, c.y + (Math.random() - 0.5) * 60)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [members]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            animate={{ x: cursor.x, y: cursor.y }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute"
          >
            {/* Cursor arrow */}
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M1 1L7 18L9.5 10.5L16 9L1 1Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            {/* Name label */}
            <span
              className="ml-3 mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
