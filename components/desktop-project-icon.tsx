"use client";

import { useState, useRef, useEffect } from "react";

interface DesktopProjectIconProps {
  project: { icon: string; name: string };
  position: { x: number; y: number };
  onDragEnd: (position: { x: number; y: number }) => void;
  onOpen: () => void;
}

export default function DesktopProjectIcon({
  project,
  position,
  onDragEnd,
  onOpen,
}: DesktopProjectIconProps) {
  const iconRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mouseDownRef = useRef<{ x: number; y: number } | null>(null);

  // Global mouse move / up so dragging remains smooth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownRef.current) return;

      const dx = e.clientX - mouseDownRef.current.x;
      const dy = e.clientY - mouseDownRef.current.y;

      // Start dragging only when moved a bit (so double-click still works)
      if (!dragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        setDragging(true);
      }

      if (!dragging) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 140;

      onDragEnd({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      mouseDownRef.current = null;
      if (dragging) setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const rect = iconRef.current?.getBoundingClientRect();
    if (!rect) return;

    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    mouseDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    mouseDownRef.current = null;
    setDragging(false);
    onOpen();
  };

  return (
    <div
      ref={iconRef}
      className={`absolute flex flex-col items-center select-none ${
        dragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: 20,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={project.icon}
        alt={project.name}
        className="w-16 h-16 drop-shadow-md"
        draggable={false}
      />
      <span className="text-white text-xs mt-1 text-center w-24 leading-tight drop-shadow">
        {project.name}
      </span>
    </div>
  );
}
