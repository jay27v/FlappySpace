import React, { useEffect, useRef, useState } from "react";

const FlappyHexagon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [floatingHexagons, setFloatingHexagons] = useState<
    {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotationSpeed: number;
      rotation: number;
    }[]
  >([]);

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    let hexagonY = canvas.height / 2;
    let velocity = 0;
    const gravity = 0.2; // Reduced from 0.5
    const jump = -6; // Reduced from -10
    const obstacles: {
      x: number;
      gap: number;
      color: string;
      colorChangeCounter: number;
    }[] = [];
    let hexagonColor = getRandomColor();
    let obstacleColor = getRandomColor();
    let colorChangeCounter = 0;

    // Add background stars
    const stars: { x: number; y: number; speed: number }[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
      });
    }

    function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    }

    const gameLoop = () => {
      // Clear canvas and draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update starship position
      velocity += gravity;
      hexagonY += velocity;

      // Wrap starship vertically (both top and bottom)
      if (hexagonY > canvas.height + 20) {
        hexagonY = -20;
      } else if (hexagonY < -20) {
        hexagonY = canvas.height + 20;
      }

      // Draw and update background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.fillRect(star.x, star.y, 2, 2);
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      // Draw starship
      ctx.fillStyle = hexagonColor;
      ctx.beginPath();
      ctx.moveTo(100, hexagonY);
      ctx.lineTo(70, hexagonY + 15);
      ctx.lineTo(70, hexagonY - 15);
      ctx.closePath();
      ctx.fill();

      // Draw cockpit
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(90, hexagonY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw obstacles
      obstacles.forEach((obstacle, index) => {
        obstacle.x -= 2;
        if (obstacle.x < -20) obstacles.splice(index, 1);

        // Change obstacle color every 60 frames (about 1 second at 60 FPS)
        obstacle.colorChangeCounter++;
        if (obstacle.colorChangeCounter % 60 === 0) {
          obstacle.color = getRandomColor();
        }

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, 0, 20, obstacle.gap);
        ctx.fillRect(obstacle.x, obstacle.gap + 150, 20, canvas.height);
      });

      colorChangeCounter++;

      // Add new obstacles
      if (
        obstacles.length === 0 ||
        obstacles[obstacles.length - 1].x < canvas.width - 300
      ) {
        obstacles.push({
          x: canvas.width,
          gap: Math.random() * (canvas.height - 200) + 50, // Adjusted for bigger gaps
          color: getRandomColor(),
          colorChangeCounter: 0,
        });
      }

      // Check collision
      if (
        obstacles.some(
          (o) =>
            o.x < 100 &&
            o.x > 70 &&
            (hexagonY - 15 < o.gap || hexagonY + 15 > o.gap + 150)
        )
      ) {
        hexagonY = canvas.height / 2;
        velocity = 0;
        obstacles.length = 0;
        hexagonColor = getRandomColor();
        obstacleColor = getRandomColor();
      }

      requestAnimationFrame(gameLoop);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent scrolling
        velocity = jump;
        hexagonColor = getRandomColor();
        // Removed: obstacleColor = getRandomColor();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameStarted, canvasSize]);

  useEffect(() => {
    if (gameStarted) return;

    // Create floating hexagons
    const newHexagons = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvasSize.width,
      y: Math.random() * canvasSize.height,
      size: Math.random() * 30 + 10,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      rotation: Math.random() * Math.PI * 2,
    }));
    setFloatingHexagons(newHexagons);

    const animateStartScreen = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating hexagons
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      floatingHexagons.forEach((hexagon) => {
        ctx.save();
        ctx.translate(hexagon.x, hexagon.y);
        ctx.rotate(hexagon.rotation);
        drawHexagon(ctx, 0, 0, hexagon.size);
        ctx.restore();

        // Update position
        hexagon.x += hexagon.speedX;
        hexagon.y += hexagon.speedY;
        hexagon.rotation += hexagon.rotationSpeed;

        // Bounce off edges
        if (hexagon.x < 0 || hexagon.x > canvas.width) hexagon.speedX *= -1;
        if (hexagon.y < 0 || hexagon.y > canvas.height) hexagon.speedY *= -1;
      });

      if (!gameStarted) {
        requestAnimationFrame(animateStartScreen);
      }
    };

    animateStartScreen();
  }, [gameStarted, canvasSize]);

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const xPos = x + size * Math.cos(angle);
      const yPos = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
      />
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-purple-900 text-white text-xl font-bold rounded-full hover:bg-purple-800 transition-colors animate-pulse"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
};

export default FlappyHexagon;
