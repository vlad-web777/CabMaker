import React, { useEffect, useMemo, useRef, useState } from "react";

type Ball = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
};

type Brick = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  surpriseMultiplier?: 2 | 4 | 10 | 20;
};

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 14;
const PADDLE_Y = GAME_HEIGHT - 35;
const PADDLE_SPEED = 9;

const BALL_SIZE = 12;
const BALL_START_SPEED_X = 4;
const BALL_START_SPEED_Y = -4;
const MAX_BALL_SPEED = 10;

const BRICK_PADDING = 2;
const BRICK_OFFSET_TOP = 40;
const BRICK_AREA_HEIGHT = 210;

const MIN_BRICKS = 20;
const MAX_BRICKS = 10000;

const LETTER_PATTERNS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function makeBall(
  x = GAME_WIDTH / 2 - BALL_SIZE / 2,
  y = PADDLE_Y - BALL_SIZE - 2,
  dx = BALL_START_SPEED_X,
  dy = BALL_START_SPEED_Y
): Ball {
  return {
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    dx,
    dy,
    active: true,
  };
}

function addSurprises(bricks: Brick[]): Brick[] {
  if (bricks.length < 10) return bricks;

  const surpriseOptions: (2 | 4 | 10 | 20)[] = [2, 4, 10, 20];
  const surpriseCount = Math.min(
    Math.max(1, Math.floor(bricks.length / 80)),
    12,
    bricks.length
  );

  const indexes = new Set<number>();
  while (indexes.size < surpriseCount) {
    indexes.add(Math.floor(Math.random() * bricks.length));
  }

  return bricks.map((brick, index) => {
    if (!indexes.has(index)) return brick;
    return {
      ...brick,
      surpriseMultiplier:
        surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)],
    };
  });
}

function buildNormalBricks(totalBricks: number): Brick[] {
  const safeCount = clamp(Math.floor(totalBricks || 80), MIN_BRICKS, MAX_BRICKS);
  const aspectRatio = GAME_WIDTH / BRICK_AREA_HEIGHT;

  let cols = Math.ceil(Math.sqrt(safeCount * aspectRatio));
  cols = Math.max(5, cols);
  const rows = Math.ceil(safeCount / cols);

  const brickWidth = (GAME_WIDTH - (cols - 1) * BRICK_PADDING) / cols;
  const brickHeight =
    (BRICK_AREA_HEIGHT - (rows - 1) * BRICK_PADDING) / rows;

  const bricks: Brick[] = [];

  for (let i = 0; i < safeCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    bricks.push({
      id: `normal-${row}-${col}-${i}`,
      x: col * (brickWidth + BRICK_PADDING),
      y: BRICK_OFFSET_TOP + row * (brickHeight + BRICK_PADDING),
      width: brickWidth,
      height: brickHeight,
      visible: true,
    });
  }

  return addSurprises(bricks);
}

function buildWordBricks(word: string): Brick[] {
  const cleaned = word.toUpperCase().replace(/[^A-Z0-9 ]/g, "").trim();
  if (!cleaned) return buildNormalBricks(80);

  const rows = 7;
  const grid: string[] = Array.from({ length: rows }, () => "");

  for (const char of cleaned) {
    if (char === " ") {
      for (let r = 0; r < rows; r++) grid[r] += "000";
      continue;
    }

    const pattern = LETTER_PATTERNS[char];
    if (!pattern) continue;

    for (let r = 0; r < rows; r++) {
      grid[r] += pattern[r] + "0";
    }
  }

  const totalCols = grid[0]?.length ?? 0;
  if (!totalCols) return buildNormalBricks(80);

  const brickWidth =
    (GAME_WIDTH - Math.max(0, totalCols - 1) * BRICK_PADDING) / totalCols;
  const brickHeight =
    (BRICK_AREA_HEIGHT - Math.max(0, rows - 1) * BRICK_PADDING) / rows;

  const bricks: Brick[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === "1") {
        bricks.push({
          id: `word-${row}-${col}`,
          x: col * (brickWidth + BRICK_PADDING),
          y: BRICK_OFFSET_TOP + row * (brickHeight + BRICK_PADDING),
          width: brickWidth,
          height: brickHeight,
          visible: true,
        });
      }
    }
  }

  return addSurprises(bricks);
}

function buildInitialBricks(totalBricks: number, word: string): Brick[] {
  return word.trim() ? buildWordBricks(word) : buildNormalBricks(totalBricks);
}

export default function BrickBreakerPage() {
  const [brickCountInput, setBrickCountInput] = useState("80");
  const [wordInput, setWordInput] = useState("");

  const [paddleX, setPaddleX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
  const [balls, setBalls] = useState<Ball[]>([makeBall()]);
  const [bricks, setBricks] = useState<Brick[]>(buildInitialBricks(80, ""));

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);

  const animationRef = useRef<number | null>(null);
  const bricksRef = useRef(bricks);
  const paddleXRef = useRef(paddleX);

  useEffect(() => {
    bricksRef.current = bricks;
  }, [bricks]);

  useEffect(() => {
    paddleXRef.current = paddleX;
  }, [paddleX]);

  const visibleBricksCount = useMemo(
    () => bricks.filter((brick) => brick.visible).length,
    [bricks]
  );

  const activeBallsCount = useMemo(
    () => balls.filter((ball) => ball.active).length,
    [balls]
  );

  const rebuildBoard = (brickCount: number, word: string) => {
    const safeCount = clamp(Math.floor(brickCount || 80), MIN_BRICKS, MAX_BRICKS);

    setBrickCountInput(String(safeCount));
    setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
    setBalls([makeBall()]);
    setBricks(buildInitialBricks(safeCount, word));
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
  };

  const resetGame = () => {
    const parsed = Number(brickCountInput);
    const safeCount = clamp(
      Number.isFinite(parsed) ? parsed : 80,
      MIN_BRICKS,
      MAX_BRICKS
    );
    rebuildBoard(safeCount, wordInput);
  };

  const addMoreBricks = () => {
    if (wordInput.trim()) {
      const nextWord = `${wordInput} ${wordInput}`.trim().slice(0, 18);
      setWordInput(nextWord);
      rebuildBoard(Number(brickCountInput) || 80, nextWord);
      return;
    }

    const current = clamp(Number(brickCountInput) || 80, MIN_BRICKS, MAX_BRICKS);
    const nextCount = clamp(current * 2, MIN_BRICKS, MAX_BRICKS);
    rebuildBoard(nextCount, "");
  };

  const applyLayout = () => {
    const parsed = Number(brickCountInput);
    const safeCount = clamp(
      Number.isFinite(parsed) ? parsed : 80,
      MIN_BRICKS,
      MAX_BRICKS
    );
    rebuildBoard(safeCount, wordInput);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLeftPressed(true);
      if (e.key === "ArrowRight") setRightPressed(true);

      if (e.code === "Space") {
        e.preventDefault();

        if (gameOver || gameWon) {
          resetGame();
          return;
        }

        setGameStarted(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLeftPressed(false);
      if (e.key === "ArrowRight") setRightPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, gameWon, brickCountInput, wordInput]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const tick = () => {
      setPaddleX((prev) => {
        let next = prev;
        if (leftPressed) next -= PADDLE_SPEED;
        if (rightPressed) next += PADDLE_SPEED;
        return clamp(next, 0, GAME_WIDTH - PADDLE_WIDTH);
      });

      const pendingSpawns: Ball[] = [];
      const hitBrickIds = new Set<string>();

      setBalls((prevBalls) => {
        const currentBricks = bricksRef.current;
        const currentPaddleX = paddleXRef.current;

        const nextBalls = prevBalls.map((ball) => {
          if (!ball.active) return ball;

          let nextX = ball.x + ball.dx;
          let nextY = ball.y + ball.dy;
          let nextDx = ball.dx;
          let nextDy = ball.dy;
          let active = ball.active;

          if (nextX <= 0 && nextDx < 0) {
            nextX = 0;
            nextDx = -nextDx;
          }

          if (nextX + BALL_SIZE >= GAME_WIDTH && nextDx > 0) {
            nextX = GAME_WIDTH - BALL_SIZE;
            nextDx = -nextDx;
          }

          if (nextY <= 0 && nextDy < 0) {
            nextY = 0;
            nextDy = -nextDy;
          }

          const paddleTop = PADDLE_Y;
          const paddleBottom = PADDLE_Y + PADDLE_HEIGHT;
          const paddleLeft = currentPaddleX;
          const paddleRight = currentPaddleX + PADDLE_WIDTH;

          const ballLeft = nextX;
          const ballRight = nextX + BALL_SIZE;
          const ballTop = nextY;
          const ballBottom = nextY + BALL_SIZE;

          const hitPaddle =
            ballBottom >= paddleTop &&
            ballTop <= paddleBottom &&
            ballRight >= paddleLeft &&
            ballLeft <= paddleRight &&
            nextDy > 0;

          if (hitPaddle) {
            const paddleCenter = currentPaddleX + PADDLE_WIDTH / 2;
            const ballCenter = nextX + BALL_SIZE / 2;
            const offset = (ballCenter - paddleCenter) / (PADDLE_WIDTH / 2);

            nextY = paddleTop - BALL_SIZE - 1;
            nextDy = -Math.abs(nextDy);
            nextDx = clamp(offset * 6, -MAX_BALL_SPEED, MAX_BALL_SPEED);
          }

          if (nextY + BALL_SIZE >= GAME_HEIGHT) {
            active = false;
          }

          if (active) {
            for (const brick of currentBricks) {
              if (!brick.visible || hitBrickIds.has(brick.id)) continue;

              const brickLeft = brick.x;
              const brickRight = brick.x + brick.width;
              const brickTop = brick.y;
              const brickBottom = brick.y + brick.height;

              const overlaps =
                nextX + BALL_SIZE >= brickLeft &&
                nextX <= brickRight &&
                nextY + BALL_SIZE >= brickTop &&
                nextY <= brickBottom;

              if (!overlaps) continue;

              const overlapLeft = nextX + BALL_SIZE - brickLeft;
              const overlapRight = brickRight - nextX;
              const overlapTop = nextY + BALL_SIZE - brickTop;
              const overlapBottom = brickBottom - nextY;

              const minXOverlap = Math.min(overlapLeft, overlapRight);
              const minYOverlap = Math.min(overlapTop, overlapBottom);

              if (minXOverlap < minYOverlap) {
                nextDx = -nextDx;

                if (overlapLeft < overlapRight) {
                  nextX = brickLeft - BALL_SIZE - 0.1;
                } else {
                  nextX = brickRight + 0.1;
                }
              } else {
                nextDy = -nextDy;

                if (overlapTop < overlapBottom) {
                  nextY = brickTop - BALL_SIZE - 0.1;
                } else {
                  nextY = brickBottom + 0.1;
                }
              }

              hitBrickIds.add(brick.id);

              if (brick.surpriseMultiplier) {
                const extraBalls = brick.surpriseMultiplier - 1;

                for (let i = 0; i < extraBalls; i++) {
                  let spawnDx =
                    (nextDx + randomBetween(-2.5, 2.5)) *
                    randomBetween(0.9, 1.2);
                  let spawnDy =
                    (-Math.abs(nextDy) + randomBetween(-1.2, 1.2)) *
                    randomBetween(0.9, 1.2);

                  spawnDx = clamp(spawnDx, -MAX_BALL_SPEED, MAX_BALL_SPEED);

                  if (Math.abs(spawnDy) < 2) {
                    spawnDy = spawnDy < 0 ? -2 : 2;
                  }
                  spawnDy = clamp(spawnDy, -MAX_BALL_SPEED, MAX_BALL_SPEED);

                  pendingSpawns.push(makeBall(nextX, nextY, spawnDx, spawnDy));
                }
              }

              break;
            }
          }

          return {
            ...ball,
            x: nextX,
            y: nextY,
            dx: nextDx,
            dy: nextDy,
            active,
          };
        });

        return pendingSpawns.length > 0 ? [...nextBalls, ...pendingSpawns] : nextBalls;
      });

      if (hitBrickIds.size > 0) {
        setBricks((prevBricks) =>
          prevBricks.map((brick) =>
            hitBrickIds.has(brick.id) ? { ...brick, visible: false } : brick
          )
        );
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, gameWon, leftPressed, rightPressed]);

  useEffect(() => {
    if (visibleBricksCount === 0 && bricks.length > 0) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [visibleBricksCount, bricks.length]);

  useEffect(() => {
    if (!gameStarted && !gameOver && !gameWon) {
      setBalls([
        makeBall(
          paddleX + PADDLE_WIDTH / 2 - BALL_SIZE / 2,
          PADDLE_Y - BALL_SIZE - 2,
          BALL_START_SPEED_X,
          BALL_START_SPEED_Y
        ),
      ]);
    }
  }, [paddleX, gameStarted, gameOver, gameWon]);

  useEffect(() => {
    if (gameStarted && activeBallsCount === 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [activeBallsCount, gameStarted]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Brick Breaker</h1>
          <p className="mt-2 text-sm text-gray-600">
            Press <span className="font-semibold">Space</span> to start. Use{" "}
            <span className="font-semibold">Left</span> and{" "}
            <span className="font-semibold">Right</span> arrows to move.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[160px_1fr_auto_auto]">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Brick count
              </label>
              <input
                type="number"
                min={MIN_BRICKS}
                max={MAX_BRICKS}
                value={brickCountInput}
                onChange={(e) => setBrickCountInput(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Word layout
              </label>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value.toUpperCase())}
                placeholder="Type a word like WIN"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={applyLayout}
              className="self-end rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Apply Layout
            </button>

            <button
              onClick={addMoreBricks}
              className="self-end rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Add More Bricks
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={resetGame}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Reset Game
            </button>

            <div className="rounded-lg border px-4 py-2 text-sm text-gray-700">
              Bricks left: {visibleBricksCount}
            </div>

            <div className="rounded-lg border px-4 py-2 text-sm text-gray-700">
              Balls: {activeBallsCount}
            </div>

            <div className="rounded-lg border px-4 py-2 text-sm text-gray-700">
              Layout: {wordInput.trim() ? `Word "${wordInput}"` : `${brickCountInput} bricks`}
            </div>

            <div className="rounded-lg border px-4 py-2 text-sm text-gray-700">
              Surprise bricks: x2 / x4 / x10 / x20
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto overflow-hidden rounded-2xl border-4 border-gray-800 bg-black shadow-2xl"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {bricks.map(
            (brick) =>
              brick.visible && (
                <div
                  key={brick.id}
                  className={`absolute ${
                    brick.surpriseMultiplier ? "bg-yellow-400" : "bg-green-500"
                  }`}
                  style={{
                    left: brick.x,
                    top: brick.y,
                    width: brick.width,
                    height: brick.height,
                    borderRadius: Math.min(6, brick.height / 4),
                  }}
                />
              )
          )}

          {balls.map(
            (ball) =>
              ball.active && (
                <div
                  key={ball.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: ball.x,
                    top: ball.y,
                    width: BALL_SIZE,
                    height: BALL_SIZE,
                  }}
                />
              )
          )}

          <div
            className="absolute bg-green-400"
            style={{
              left: paddleX,
              top: PADDLE_Y,
              width: PADDLE_WIDTH,
              height: PADDLE_HEIGHT,
              borderRadius: 9999,
            }}
          />

          {!gameStarted && !gameOver && !gameWon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-xl">
                <div className="text-lg font-semibold text-gray-900">
                  Press Space to Start
                </div>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
                <div className="text-2xl font-bold text-red-600">Game Over</div>
                <p className="mt-2 text-sm text-gray-600">
                  Press Reset Game or Space to try again
                </p>
              </div>
            </div>
          )}

          {gameWon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
                <div className="text-2xl font-bold text-green-600">You Win!</div>
                <p className="mt-2 text-sm text-gray-600">
                  All bricks are cleared
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}