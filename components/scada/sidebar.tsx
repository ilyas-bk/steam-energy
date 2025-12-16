"use client"

import {
  LayoutDashboard,
  Zap,
  Droplets,
  Factory,
  Brain,
  Bell,
  FileText,
  GitBranch,
  SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TabType } from "../scada-dashboard"

const menuItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "diagram", label: "Schéma Procédé", icon: GitBranch },
  { id: "energy", label: "Énergie", icon: Zap },
  { id: "water", label: "Eau", icon: Droplets },
  { id: "production", label: "Production", icon: Factory },
  { id: "analytics", label: "Analytiques IA", icon: Brain },
  { id: "simulation", label: "Simulation", icon: SlidersHorizontal },
  { id: "alerts", label: "Alertes", icon: Bell },
  { id: "reports", label: "Rapports", icon: FileText },
]

interface SidebarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">SCADA-IA</h1>
            <p className="text-xs text-slate-400">Monitoring Industriel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              data-tab={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                activeTab === item.id
                  ? "bg-cyan-600/20 text-cyan-400 border border-cyan-600/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Système Actif</span>
          </div>
          <p className="text-xs text-slate-500">Dernière sync: il y a 2s</p>
        </div>
      </div>
    </aside>
  )
}
