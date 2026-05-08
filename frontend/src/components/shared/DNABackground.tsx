"use client";

import { useEffect, useRef } from "react";

export function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // DNA Helix parameters
    const helixCount = 3;
    const nodeCount = 30;

    // Floating particles
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];

    const colors = [
      "rgba(16, 185, 129,",  // emerald
      "rgba(20, 184, 166,",  // teal
      "rgba(245, 158, 11,",  // amber
      "rgba(110, 231, 183,", // mint
    ];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawHelix = (
      offsetX: number,
      offsetY: number,
      amplitude: number,
      frequency: number,
      alpha: number
    ) => {
      for (let i = 0; i < nodeCount; i++) {
        const y = offsetY + (i / nodeCount) * canvas.height * 1.2;
        const phase = (i / nodeCount) * Math.PI * frequency + time * 0.8;

        const x1 = offsetX + Math.sin(phase) * amplitude;
        const x2 = offsetX + Math.sin(phase + Math.PI) * amplitude;

        const depth1 = (Math.cos(phase) + 1) / 2;
        const depth2 = (Math.cos(phase + Math.PI) + 1) / 2;

        // Draw connecting rungs
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          const gradient = ctx.createLinearGradient(x1, y, x2, y);
          gradient.addColorStop(0, `rgba(16, 185, 129, ${0.08 * alpha * depth1})`);
          gradient.addColorStop(0.5, `rgba(245, 158, 11, ${0.05 * alpha})`);
          gradient.addColorStop(1, `rgba(20, 184, 166, ${0.08 * alpha * depth2})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw strand nodes
        const nodeSize1 = 2 + depth1 * 2;
        const nodeSize2 = 2 + depth2 * 2;

        ctx.beginPath();
        ctx.arc(x1, y, nodeSize1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${0.15 * alpha * depth1 + 0.05})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, nodeSize2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${0.15 * alpha * depth2 + 0.05})`;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw multiple DNA helixes
      const positions = [
        { x: canvas.width * 0.15, y: -100, amp: 60, freq: 6, alpha: 0.7 },
        { x: canvas.width * 0.75, y: -200, amp: 80, freq: 5, alpha: 0.5 },
        { x: canvas.width * 0.5, y: -50, amp: 50, freq: 7, alpha: 0.3 },
      ];

      for (let h = 0; h < Math.min(helixCount, positions.length); h++) {
        const pos = positions[h];
        drawHelix(pos.x, pos.y, pos.amp, pos.freq, pos.alpha);
      }

      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
