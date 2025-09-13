"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

// Responsive grid sizes
const MOBILE_ROWS = 12;
const MOBILE_COLS = 24;
const DESKTOP_ROWS = 20;
const DESKTOP_COLS = 40;

const BackgroundRippleEffect: React.FC = () => {
  const [grid, setGrid] = useState<Array<{ id: number; char: string; isRipple?: boolean }>>([]);
  const gridRef = useRef(grid);

  // Responsive dimensions
  const [rows, setRows] = useState(DESKTOP_ROWS);
  const [cols, setCols] = useState(DESKTOP_COLS);

  // Detect screen size and update grid dimensions
  const updateGridSize = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    setRows(isMobile ? MOBILE_ROWS : DESKTOP_ROWS);
    setCols(isMobile ? MOBILE_COLS : DESKTOP_COLS);
  }, []);

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, [updateGridSize]);

  const generateRandomChar = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  const generateBinaryChar = useCallback(() => {
    return Math.random() > 0.5 ? "0" : "1";
  }, []);

  useEffect(() => {
    const initialGrid = [];
    const totalCells = rows * cols;
    for (let i = 0; i < totalCells; i++) {
      initialGrid.push({ id: i, char: generateRandomChar() });
    }
    setGrid(initialGrid);
    gridRef.current = initialGrid;
  }, [generateRandomChar, rows, cols]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((cell) => ({
          ...cell,
          char: Math.random() > 0.9 ? generateRandomChar() : cell.char,
          isRipple: false,
        }))
      );
    }, 300);

    return () => clearInterval(interval);
  }, [generateRandomChar]);

  const handleCellClick = useCallback(
    (id: number) => {
      console.log("Cell clicked:", id);
      const centerRow = Math.floor(id / cols);
      const centerCol = id % cols;

      const maxDistance = Math.max(
        centerRow,
        rows - 1 - centerRow,
        centerCol,
        cols - 1 - centerCol
      );

      setGrid((prev) =>
        prev.map((cell) => ({
          ...cell,
          isRipple: false,
        }))
      );

      for (let distance = 0; distance <= maxDistance; distance++) {
        setTimeout(() => {
          setGrid((prev) => {
            return prev.map((cell, idx) => {
              const row = Math.floor(idx / cols);
              const col = idx % cols;
              const dRow = Math.abs(row - centerRow);
              const dCol = Math.abs(col - centerCol);
              const manhattanDistance = dRow + dCol;

              if (manhattanDistance === distance) {
                return {
                  ...cell,
                  char: generateBinaryChar(),
                  isRipple: true,
                };
              }
              return cell;
            });
          });

          setTimeout(() => {
            setGrid((prev) =>
              prev.map((cell, idx) => {
                const row = Math.floor(idx / cols);
                const col = idx % cols;
                const dRow = Math.abs(row - centerRow);
                const dCol = Math.abs(col - centerCol);
                const manhattanDistance = dRow + dCol;

                if (manhattanDistance === distance) {
                  return {
                    ...cell,
                    isRipple: false,
                  };
                }
                return cell;
              })
            );
          }, 300);
        }, distance * 70);
      }
    },
    [generateBinaryChar, rows, cols]
  );

  return (
    <div
      className="absolute inset-0 grid h-full w-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        userSelect: 'none', // Prevent selection on entire grid
        MozUserSelect: 'none',
        MsUserSelect: 'none',
        OUserSelect: 'none',
      }}
    >
      {grid.map((cell) => (
        <div
          key={cell.id}
          onClick={() => handleCellClick(cell.id)}
          className={`flex cursor-pointer items-center justify-center border border-neutral-900 bg-black font-mono transition-colors hover:bg-green-900/20 active:bg-green-800/40 ${
            cell.isRipple
              ? "text-green-300 animate-pulse font-bold drop-shadow-md"
              : "text-green-400"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            fontSize: `${rows === MOBILE_ROWS ? '0.75rem' : '0.8rem'}`,
            letterSpacing: '0.05em',
            userSelect: 'none', // Prevent selection on individual cells
            MozUserSelect: 'none',
            MsUserSelect: 'none',
            OUserSelect: 'none',
          }}
        >
          {cell.char}
        </div>
      ))}
    </div>
  );
};

export default function BackgroundRippleEffectDemo() {
  const words = [
    { text: "Where", className: "text-white" },
    { text: "code", className: "text-white" },
    { text: "meets", className: "text-white" },
    { text: "curiosity.", className: "text-blue-500" },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[200vh] w-full">
        {/* Background Grid */}
        <div className="fixed inset-0 z-0">
          <BackgroundRippleEffect />
        </div>

        {/* Subtle radial gradient overlay */}
        <div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />

        {/* Dark bottom gradient for depth */}
        <div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 1) 100%)",
          }}
        />

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-start pt-60 px-4 text-center pointer-events-none">
          <div className="pointer-events-auto">
            <TextGenerateEffect words="Welcome To" className="mb-6" duration={2} />
            <TextGenerateEffect words="ENIGMA" className="mb-6" duration={2.4} />

            <TypewriterEffectSmooth words={words} className="mb-6" />
          </div>

          <div className="mt-40 h-96"></div>

          <div className="w-full max-w-3xl mt-20 text-neutral-500 space-y-6 opacity-90">
            <p className="text-lg">
              Scroll down to descend into the digital abyss. The grid continues infinitely —
              but the light fades, as all things must.
            </p>
            <p>
              Click anywhere to send a pulse — a ripple of 0s and 1s — echoing into the void.
            </p>
            <div className="h-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
}