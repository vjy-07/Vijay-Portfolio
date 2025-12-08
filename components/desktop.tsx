"use client";

import { useState, useEffect, useRef } from "react";

import Dock from "@/components/dock";
import Menubar from "@/components/menubar";
import Wallpaper from "@/components/wallpaper";
import Window from "@/components/window";
import Launchpad from "@/components/launchpad";
import ControlCenter from "@/components/control-center";
import Spotlight from "@/components/spotlight";
import DesktopProjectIcon from "@/components/desktop-project-icon";

import type { AppWindow } from "@/types";

interface DesktopProps {
  onLogout: () => void;
  onSleep: () => void;
  onShutdown: () => void;
  onRestart: () => void;
  initialDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialBrightness: number;
  onBrightnessChange: (value: number) => void;
}

interface Project {
  name: string;
  icon: string;
  github: string;
  live?: string;
}

/* --------------------------------------
   📁 All Projects (Unique names)
-------------------------------------- */
const projectList: Project[] = [
  {
    name: "Plant Disease Detection",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/PlantDiseaseDetection",
  },
  {
    name: "Recipe Revive",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/RecipeRevive",
    live: "https://reicperevive-frontend.onrender.com/",
  },
  {
    name: "RealTime Tracking",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/RealTime-Tracking",
    live: "https://realtime-tracking-0up0.onrender.com/"
  },
  {
    name: "Resume Match AI",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/ResumeMatchAI",
    live: "https://resumematchai-9qpb.onrender.com/"
  },
  {
    name: "HealthCare Backend",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/HealthCare-Backend",
  },
  {
    name: "Safe Space Ai",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Safe-Space-Ai",
  },
  {
    name: "Analog Clock",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Analog-Clock",
    live: "https://vjy-07.github.io/Analog-Clock/"
  },
  {
    name: "Calculator",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Calculator",
    live: "https://vjy-07.github.io/Calculator/"
  },
  {
    name: "Google login demo",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Google-login-demo",
    live: "https://google-login-demo.onrender.com/login"
  },
  {
    name: "Razorpay Demo",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Razorpay-Demo",
    live: "https://razorpay-demo-frontend-5p6n.onrender.com/"
  },
  {
    name: "Sidcup Golf UI Clone",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Sidcup-Golf-UI-Clone",
    live: "https://vjy-07.github.io/Sidcup-Golf-UI-Clone/"
  },
  {
    name: "Whatsapp Chat Analyzer",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Whatsapp-Chat-Analyzer",
    live: "https://whatsapp-chat-analyzer-0.streamlit.app/"
  },
  {
    name: "CGPA CALCULATOR",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/CGPA_CALCULATOR",
    live: "vjy-07.github.io/CGPA_CALCULATOR/"
  },
  {
    name: "Email SMS Spam Classifier",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Email-SMS-Spam-Classifier",
  },
  {
    name: "Movie Recommender System",
    icon: "/folder.png",
    github: "https://github.com/vjy-07/Movie-Recommender-System",
  },
];

/* --------------------------------------
   🔢 Auto-arrange icons in columns
-------------------------------------- */
type Position = { x: number; y: number };

function computeInitialPositions(): Record<string, Position> {
  const top = 80;
  const left = 40;
  const verticalGap = 110;
  const horizontalGap = 140;

  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;
  const usableHeight = screenH - 100; // avoid dock/menubar overlap

  const itemsPerColumn = Math.max(1, Math.floor(usableHeight / verticalGap));

  const positions: Record<string, Position> = {};

  projectList.forEach((project, index) => {
    const col = Math.floor(index / itemsPerColumn);
    const row = index % itemsPerColumn;

    positions[project.name] = {
      x: left + col * horizontalGap,
      y: top + row * verticalGap,
    };
  });

  return positions;
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness);

  const [projectPositions, setProjectPositions] = useState<Record<string, Position>>(
    computeInitialPositions,
  );

  const desktopRef = useRef<HTMLDivElement | null>(null);

  // 🕒 Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Sync props
  useEffect(() => setIsDarkMode(initialDarkMode), [initialDarkMode]);
  useEffect(() => setScreenBrightness(initialBrightness), [initialBrightness]);

  const handleDesktopClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === desktopRef.current) {
      setActiveWindowId(null);
      if (showControlCenter) setShowControlCenter(false);
      if (showSpotlight) setShowSpotlight(false);
    }
  };

  const openApp = (app: AppWindow) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === app.id)) return prev;
      return [...prev, app];
    });
    setActiveWindowId(app.id);
    if (showLaunchpad) setShowLaunchpad(false);
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((current) => (current === id ? null : current));
  };

  const toggleDarkModeLocal = () => {
    setIsDarkMode((prev) => !prev);
    onToggleDarkMode();
  };

  const updateBrightness = (value: number) => {
    setScreenBrightness(value);
    onBrightnessChange(value);
  };

  return (
    <div className="relative">
      {/* 🔆 Brightness overlay – under everything, no pointer blocking */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-0 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />

      {/* Desktop Layer */}
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        {/* 📁 Project Folders — draggable + double-clickable */}
        {projectList.map((project) => {
          const pos = projectPositions[project.name];
          if (!pos) return null;

          return (
            <DesktopProjectIcon
              key={project.name}
              project={project}
              position={pos}
              onDragEnd={(newPos) =>
                setProjectPositions((prev) => ({
                  ...prev,
                  [project.name]: newPos,
                }))
              }
              onOpen={() =>
                openApp({
                  id: `${project.name}-folder`,
                  title: project.name,
                  component: "Folder",
                  position: { x: 260, y: 140 },
                  size: { width: 620, height: 450 },
                  props: {
                    title: project.name,
                    github: project.github,
                    live: project.live,
                  },
                })
              }
            />
          );
        })}

        {/* Menubar */}
        <Menubar
          time={time}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={() => setShowSpotlight((prev) => !prev)}
          onControlCenterClick={() => setShowControlCenter((prev) => !prev)}
          isDarkMode={isDarkMode}
          activeWindow={openWindows.find((w) => w.id === activeWindowId) || null}
        />

        {/* Windows */}
        <div className="absolute inset-0 pt-6 pb-16">
          {openWindows.map((w) => (
            <Window
              key={w.id}
              window={w}
              isActive={activeWindowId === w.id}
              onClose={() => closeWindow(w.id)}
              onFocus={() => setActiveWindowId(w.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Launchpad */}
        {showLaunchpad && (
          <Launchpad onAppClick={openApp} onClose={() => setShowLaunchpad(false)} />
        )}

        {/* Control Center */}
        {showControlCenter && (
          <ControlCenter
            onClose={() => setShowControlCenter(false)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkModeLocal}
            brightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        )}

        {/* Spotlight */}
        {showSpotlight && (
          <Spotlight onClose={() => setShowSpotlight(false)} onAppClick={openApp} />
        )}

        {/* Dock */}
        <Dock
          onAppClick={openApp}
          onLaunchpadClick={() => setShowLaunchpad(true)}
          activeAppIds={openWindows.map((w) => w.id)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
