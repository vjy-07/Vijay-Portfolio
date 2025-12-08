"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Minus, ArrowRightIcon as ArrowsMaximize } from "lucide-react"
import type { AppWindow } from "@/types"

import Notes from "@/components/apps/notes"
import GitHub from "@/components/apps/github"
import Safari from "@/components/apps/safari"
import VSCode from "@/components/apps/vscode"
import FaceTime from "@/components/apps/facetime"
import Terminal from "@/components/apps/terminal"
import Mail from "@/components/apps/mail"
import Spotify from "@/components/apps/spotify"
import Snake from "@/components/apps/snake"
import Weather from "@/components/apps/weather"
import Leetcode from "@/components/apps/leetcode"
import Folder from "@/components/apps/folder"

// Allow different components to have different props
const componentMap: Record<string, React.ComponentType<any>> = {
  Notes,
  GitHub,
  Safari,
  VSCode,
  FaceTime,
  Terminal,
  Mail,
  Spotify,
  Snake,
  Weather,
  Leetcode,
  Folder,
}

interface WindowProps {
  window: AppWindow
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  isDarkMode: boolean
}

export default function Window({ window, isActive, onClose, onFocus, isDarkMode }: WindowProps) {
  const [position, setPosition] = useState(window.position)
  const [size, setSize] = useState(window.size)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size })

  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })

  const windowRef = useRef<HTMLDivElement>(null)
  const AppComponent = componentMap[window.component]

  /* -------------------------------------------------------------------
      WINDOW DRAG + RESIZE HANDLERS
  ------------------------------------------------------------------- */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      } else if (isResizing && resizeDirection) {
        e.preventDefault()

        const dx = e.clientX - resizeStartPos.x
        const dy = e.clientY - resizeStartPos.y

        let newWidth = resizeStartSize.width
        let newHeight = resizeStartSize.height
        let newX = position.x
        let newY = position.y

        const minWidth = 300
        const minHeight = 200

        if (resizeDirection.includes("e"))
          newWidth = Math.max(minWidth, resizeStartSize.width + dx)

        if (resizeDirection.includes("s"))
          newHeight = Math.max(minHeight, resizeStartSize.height + dy)

        if (resizeDirection.includes("w")) {
          const proposed = resizeStartSize.width - dx
          if (proposed >= minWidth) {
            newWidth = proposed
            newX = position.x + dx
          }
        }

        if (resizeDirection.includes("n")) {
          const proposed = resizeStartSize.height - dy
          if (proposed >= minHeight) {
            newHeight = proposed
            newY = position.y + dy
          }
        }

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, isResizing, resizeDirection, resizeStartPos, resizeStartSize, position])

  /* -------------------------------------------------------------------
      MOVE WINDOW WHEN TITLE BAR DRAGGED
  ------------------------------------------------------------------- */
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    if ((e.target as HTMLElement).closest(".window-controls")) return

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })

    onFocus() // <-- this brings window to top!
  }

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStartPos({ x: e.clientX, y: e.clientY })
    setResizeStartSize({ width: size.width, height: size.height })

    onFocus()
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    } else {
      setPreMaximizeState({ position, size })

      const usableHeight = window.innerHeight - 26
      setPosition({ x: 0, y: 26 })
      setSize({ width: window.innerWidth, height: usableHeight - 70 })
    }

    setIsMaximized(!isMaximized)
  }

  const handleMinimize = () => onClose()

  const titleBarClass = isDarkMode
    ? isActive ? "bg-gray-800" : "bg-gray-900"
    : isActive ? "bg-gray-200" : "bg-gray-100"

  const contentBgClass = isDarkMode ? "bg-gray-900" : "bg-white"
  const textClass = isDarkMode ? "text-white" : "text-gray-800"

  /* -------------------------------------------------------------------
      🔥 FIX: WINDOW ALWAYS STAYS ON TOP WHEN ACTIVE
  ------------------------------------------------------------------- */

  return (
    <div
      ref={windowRef}
      className="absolute rounded-lg overflow-hidden transition-shadow"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isActive ? 999 : 20, // <-- FULL FIX (always on top)
        boxShadow: isActive
          ? "0 0 24px rgba(0,0,0,0.45)"
          : "0 0 10px rgba(0,0,0,0.25)",
      }}
      onMouseDown={onFocus} // ensure always focused on click
    >
      {/* ---------------- Title Bar ---------------- */}
      <div
        className={`h-8 flex items-center px-3 ${titleBarClass}`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="window-controls flex items-center space-x-2 mr-4">
          <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" onClick={onClose}>
            <X className="w-2 h-2 text-red-900 opacity-0 hover:opacity-100" />
          </button>

          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" onClick={handleMinimize}>
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 hover:opacity-100" />
          </button>

          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" onClick={toggleMaximize}>
            <ArrowsMaximize className="w-2 h-2 text-green-900 opacity-0 hover:opacity-100" />
          </button>
        </div>

        <div className={`flex-1 text-center text-sm font-medium truncate ${textClass}`}>
          {window.title}
        </div>

        <div className="w-16" />
      </div>

      {/* ---------------- Content Area ---------------- */}
      <div className={`${contentBgClass} h-[calc(100%-2rem)] overflow-auto`}>
        {AppComponent ? (
          <AppComponent isDarkMode={isDarkMode} {...window.props} />
        ) : (
          <div className="p-4">Content not available</div>
        )}
      </div>

      {/* ---------------- Resize Handles ---------------- */}
      {!isMaximized && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")} />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "se")} />

          <div className="absolute top-0 left-4 right-4 h-2 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "n")} />
          <div className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "s")} />

          <div className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "w")} />
          <div className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "e")} />
        </>
      )}
    </div>
  )
}
