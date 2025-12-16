"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, Info, Zap, Activity, Gauge, Thermometer, AlertCircle, Power } from "lucide-react"

interface UnitControl {
  id: string
  name: string
  type: string
  status: "running" | "paused" | "stopped"
  power: number
  charge: number
  consommation: number
  temperature: number
  pression: number
}

export function ProductionPanel() {
  const [autoMode, setAutoMode] = useState(true)
  const [units, setUnits] = useState<UnitControl[]>([
    { 
      id: "elec", 
      name: "Énergie Électrique", 
      type: "Production Principale",
      status: "running", 
      power: 42.5, 
      charge: 72,
      consommation: 95,
      temperature: 425,
      pression: 8.2
    },
    { 
      id: "ted", 
      name: "Traitement Eau TED", 
      type: "Épuration",
      status: "running", 
      power: 2.5, 
      charge: 65,
      consommation: 88,
      temperature: 298,
      pression: 4.5
    },
  ])

  const handleControl = (unitId: string, action: "start" | "pause" | "stop") => {
    setUnits((prev) =>
      prev.map((unit) => {
        if (unit.id === unitId) {
          switch (action) {
            case "start":
              return { 
                ...unit, 
                status: "running", 
                power: unit.id === "elec" ? 42.5 : 2.5,
                charge: 75 + Math.random() * 20,
                consommation: 85 + Math.random() * 15,
                temperature: unit.id === "elec" ? 425 : 300,
                pression: unit.id === "elec" ? 8 : 5
              }
            case "pause":
              return { ...unit, status: "paused", power: 0, charge: 0, consommation: 0 }
            case "stop":
              return { 
                ...unit, 
                status: "stopped", 
                power: 0, 
                charge: 0, 
                consommation: 0,
                temperature: 180 + Math.random() * 20,
                pression: 2 + Math.random() * 0.5
              }
            default:
              return unit
          }
        }
        return unit
      }),
    )
  }

  const handleEmergencyStop = () => {
    setUnits((prev) => prev.map((unit) => ({
      ...unit,
      status: "stopped",
      power: 0,
      charge: 0,
      consommation: 0,
      temperature: 180 + Math.random() * 20,
      pression: 2 + Math.random() * 0.5
    })))
  }

  const handleStartAll = () => {
    setUnits((prev) => prev.map((unit) => ({
      ...unit,
      status: "running",
      power: unit.id === "elec" ? 42.5 : 2.5,
      charge: 75 + Math.random() * 20,
      consommation: 85 + Math.random() * 15,
      temperature: unit.id === "elec" ? 425 : 300,
      pression: unit.id === "elec" ? 8 : 5
    })))
  }

  const activeUnits = units.filter(u => u.status === "running").length
  const totalProduction = units.filter(u => u.status === "running").reduce((sum, u) => sum + u.power, 0)
  const averageCharge = units.filter(u => u.status === "running").reduce((sum, u) => sum + u.charge, 0) / (activeUnits || 1)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">En marche</Badge>
      case "paused":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">En pause</Badge>
      case "stopped":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Arrêt</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">Inconnu</Badge>
    }
  }

  const getChargeBarColor = (charge: number) => {
    if (charge >= 80) return "from-emerald-500 to-cyan-500"
    if (charge >= 50) return "from-amber-500 to-yellow-500"
    return "from-red-500 to-amber-500"
  }

  const getTemperatureStatus = (temp: number, status: string) => {
    if (status !== "running") return "text-slate-500"
    if (temp > 450) return "text-amber-400"
    return "text-emerald-400"
  }

  const getPressionStatus = (pression: number, status: string) => {
    if (status !== "running") return "text-slate-500"
    if (pression > 10) return "text-amber-400"
    return "text-cyan-400"
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Contrôle de Production</h2>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Unités Actives</p>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-blue-400">{activeUnits}<span className="text-xl text-slate-400">/2</span></p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Opérationnelles
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/20 to-slate-900 border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Production Totale</p>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-yellow-400">{totalProduction.toFixed(1)}<span className="text-xl text-slate-400"> MW</span></p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Charge Moyenne</p>
              <Gauge className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-4xl font-bold text-emerald-400">{averageCharge.toFixed(0)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-900 border-2 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Contrôles Globaux</p>
              <Power className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Button
                size="sm"
                className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                onClick={handleEmergencyStop}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Arrêt d'Urgence
              </Button>
              <Button
                size="sm"
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                onClick={handleStartAll}
              >
                <Play className="w-4 h-4 mr-2" />
                Démarrer Tout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Details */}
      <div className="space-y-4">
        {units.map((unit) => (
          <Card
            key={unit.id}
            className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-6">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 min-w-0">
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white">{unit.name}</h3>
                    <p className="text-sm text-slate-400">{unit.type}</p>
                  </div>
                  {getStatusBadge(unit.status)}
                </div>
                {unit.status === "running" && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">{unit.power.toFixed(1)} MW</span>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                {/* Charge with Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Charge
                    </span>
                    <span className="text-white font-bold">{unit.charge.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getChargeBarColor(unit.charge)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${unit.charge}%` }}
                    />
                  </div>
                </div>

                {/* Consommation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Consommation
                    </span>
                    <span className={`font-bold ${unit.status === "running" ? "text-cyan-400" : "text-slate-500"}`}>
                      {unit.consommation.toFixed(0)}%
                    </span>
                  </div>
                  {/* concise */}
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Température
                    </span>
                    <span className={`font-bold ${getTemperatureStatus(unit.temperature, unit.status)}`}>
                      {unit.temperature.toFixed(0)}°C
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{unit.status === "running" ? "Surveillance" : "Refroidissement"}</p>
                </div>

                {/* Pression */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Pression
                    </span>
                    <span className={`font-bold ${getPressionStatus(unit.pression, unit.status)}`}>
                      {unit.pression.toFixed(1)} bar
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{unit.status === "running" ? "Pression en ligne" : "Basse"}</p>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                  onClick={() => handleControl(unit.id, "start")}
                  disabled={unit.status === "running"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30"
                  onClick={() => handleControl(unit.id, "pause")}
                  disabled={unit.status !== "running"}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                  onClick={() => handleControl(unit.id, "stop")}
                  disabled={unit.status === "stopped"}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Arrêter
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-slate-500/20 text-slate-400 border border-slate-500/50 hover:bg-slate-500/30"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
