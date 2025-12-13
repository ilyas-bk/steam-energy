"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, User, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <svg viewBox="0 0 100 100" className="w-10 h-10">
            {/* Lightbulb base */}
            <rect x="42" y="70" width="16" height="8" fill="#10b981" rx="2"/>
            <rect x="40" y="78" width="20" height="3" fill="#10b981"/>
            <rect x="38" y="81" width="24" height="3" fill="#10b981"/>
            {/* Curved sides like hands */}
            <path d="M 30 60 Q 25 50 25 40 Q 25 20 35 15" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M 70 60 Q 75 50 75 40 Q 75 20 65 15" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {/* Water droplet */}
            <ellipse cx="50" cy="35" rx="15" ry="20" fill="#06b6d4"/>
            <ellipse cx="47" cy="30" rx="4" ry="6" fill="#38bdf8" opacity="0.8"/>
          </svg>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">ECOENERGY PIONEERS</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2 text-green-400">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Connecté</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <span className="text-sm text-slate-400">
          {currentTime.toLocaleDateString("fr-MA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">Opérateur</span>
        </div>
      </div>
    </header>
  )
}
