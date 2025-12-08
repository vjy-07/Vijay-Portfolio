"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  isDarkMode?: boolean
}

export default function Terminal({ isDarkMode = true }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // macOS terminal look
  const bgColor = "bg-black"
  const textColor = "text-gray-200"
  const promptColor = "text-white"

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus()

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)
      setHistory([
        "Last login: " + new Date().toLocaleString(),
        "Welcome to macOS Terminal",
        "Type 'help' to see available commands",
        "",
      ])
    }

    return () => terminal?.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (terminalRef.current)
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input)
      setCommandHistory((prev) => [...prev, input])
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    }
  }

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return
    const newIndex = historyIndex + direction

    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput("")
    } else if (newIndex >= 0) {
      setHistoryIndex(newIndex)
      setInput(commandHistory[commandHistory.length - 1 - newIndex])
    }
  }

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    const args = command.split(" ")
    const mainCommand = args[0]

    setHistory((prev) => [...prev, `Vijay@Portfolio ~ $ ${cmd}`, ""])

    switch (mainCommand) {
      // ========== HELP ==========
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help      - Show all commands",
          "  about     - About Vijay",
          "  skills    - Technical skills",
          "  contact   - Social links",
          "  ls        - List directories",
          "  whoami    - Current user",
          "  date      - Current date/time",
          "  echo      - Repeat text",
          "  clear     - Clear terminal",
          "",
        ])
        break

      // ========== CLEAR ==========
      case "clear":
        setHistory([""])
        break

      // ========== ECHO ==========
      case "echo":
        setHistory((prev) => [...prev, args.slice(1).join(" "), ""])
        break

      // ========== DATE ==========
      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""])
        break

      // ========== LS ==========
      case "ls":
        setHistory((prev) => [
          ...prev,
          "Documents",
          "Projects",
          "Downloads",
          "Desktop",
          "Pictures",
          "",
        ])
        break

      // ========== WHOAMI ==========
      case "whoami":
        setHistory((prev) => [...prev, "Vijay", ""])
        break

      // ========== ABOUT ==========
      case "about":
        setHistory((prev) => [
          ...prev,
          "────────────────────────────────────────────",
          "  Vijay Grandhi",
          "  Computer Science (AI) | Developer",
          "────────────────────────────────────────────",
          "",
          "Passionate about building clean, modern, and",
          "user-focused web applications. Experienced in",
          "JavaScript, MERN stack, Python, and C++.",
          "",
          "Enjoy working on practical AI projects,",
          "and real-world problem solving.",
          "",
        ])
        break

      // ========== SKILLS ==========
      case "skills":
        setHistory((prev) => [
          ...prev,
          "────────── Skills ──────────",
          "",
          "Programming:",
          "  JavaScript | Python | C++",
          "",
          "Frontend:",
          "  React.js | HTML | CSS",
          "",
          "Backend:",
          "  Node.js | Express.js",
          "  MySQL | MongoDB",
          "",
          "Tools:",
          "  Git | GitHub | Postman | VS Code",
          "",
        ])
        break

      // ========== CONTACT ==========
      case "contact":
        setHistory((prev) => [
          ...prev,
          "────────── Contact ──────────",
          "",
          "Email:    gvijaycrl@gmail.com",
          "GitHub:   github.com/vjy-07",
          "LinkedIn: linkedin.com/in/vijay-grandhi-a193a425a",
          "LeetCode: leetcode.com/u/Vijay_012",
          "",
        ])
        break

      // ========== UNKNOWN COMMAND ==========
      default:
        setHistory((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          'Type "help" to see available commands',
          "",
        ])
    }
  }

  return (
    <div
      ref={terminalRef}
      className={`h-full ${bgColor} ${textColor} p-4 font-mono text-sm overflow-auto`}
    >
      {history.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      <div className="flex">
        <span className={`mr-2 ${promptColor}`}>Vijay@Portfolio ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none caret-white ${textColor}`}
          autoFocus
        />
      </div>
    </div>
  )
}
