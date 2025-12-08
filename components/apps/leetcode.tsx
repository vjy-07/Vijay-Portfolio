"use client"

import { useEffect, useRef } from "react"

interface LeetcodeProps {
  isDarkMode?: boolean
}

export default function Leetcode({ isDarkMode = true }: LeetcodeProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (!hasOpenedRef.current) {
      hasOpenedRef.current = true

      // Open LeetCode profile in new tab
      window.open("https://leetcode.com/u/Vijay_012/", "_blank")
    }
  }, [])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <img
          src="/leetcode.png"
          alt="LeetCode Logo"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">Opening LeetCode...</h2>
        <p>Redirecting to your LeetCode profile</p>
      </div>
    </div>
  )
}
