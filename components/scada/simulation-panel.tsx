"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Droplets,
  Thermometer,
  Gauge,
  TrendingUp,
  Factory,
  Flame,
  Beaker,
} from "lucide-react"

// Input parameters that user can control
interface InputParameters {
  capU: { active: boolean; steamFlow: number; waterInput: number }
  capV: { active: boolean; steamFlow: number; waterInput: number }
  capW: { active: boolean; steamFlow: number; waterInput: number }
  centralThermal: { active: boolean; targetTemp: number; pressure: number }
  sulfuric: { active: boolean; productionRate: number }
  ted: { active: boolean; treatmentCapacity: number; recycleTarget: number }
}

// Calculated outputs based on inputs
interface CalculatedOutputs {
  totalPower: number
  totalWaterConsumption: number
  efficiency: number
  dailyCost: number
  vhpFlow: number
  vbpFlow: number
  co2Emissions: number
  waterRecycled: number
  phEstimate: number
  conductivityEstimate: number
}

export function SimulationPanel() {
  const [isRunning, setIsRunning] = useState(false)

  // Input parameters (user-controlled)
  const [inputs, setInputs] = useState<InputParameters>({
    capU: { active: true, steamFlow: 0, waterInput: 0 },
    capV: { active: true, steamFlow: 0, waterInput: 0 },
    capW: { active: false, steamFlow: 0, waterInput: 0 },
    centralThermal: { active: true, targetTemp: 0, pressure: 0 },
    sulfuric: { active: true, productionRate: 0 },
    ted: { active: true, treatmentCapacity: 0, recycleTarget: 0 },
  })

  // Calculated outputs (derived from inputs)
  const [outputs, setOutputs] = useState<CalculatedOutputs>({
    totalPower: 0,
    totalWaterConsumption: 0,
    efficiency: 0,
    dailyCost: 0,
    vhpFlow: 0,
    vbpFlow: 0,
    co2Emissions: 0,
    waterRecycled: 0,
    phEstimate: 7.0,
    conductivityEstimate: 400,
  })

  // Calculate outputs based on inputs
  const calculateOutputs = useCallback((params: InputParameters): CalculatedOutputs => {
    // Active units
    const activeUnits = [
      params.capU.active ? params.capU : null,
      params.capV.active ? params.capV : null,
      params.capW.active ? params.capW : null,
    ].filter(Boolean)

    const numActiveUnits = activeUnits.length

    // Power calculation: base power per unit + steam flow contribution
    const capUPower = params.capU.active ? 8 + params.capU.steamFlow * 0.05 : 0
    const capVPower = params.capV.active ? 7.5 + params.capV.steamFlow * 0.048 : 0
    const capWPower = params.capW.active ? 7 + params.capW.steamFlow * 0.045 : 0
    const centralPower = params.centralThermal.active
      ? params.centralThermal.pressure * 0.3 + params.centralThermal.targetTemp * 0.02
      : 0
    const sulfuricPower = params.sulfuric.active ? params.sulfuric.productionRate * 0.1 : 0
    const tedPower = params.ted.active ? params.ted.treatmentCapacity * 0.008 : 0

    const totalPower = capUPower + capVPower + capWPower + centralPower + sulfuricPower + tedPower

    // Water consumption: sum of inputs minus recycled
    const totalWaterInput =
      (params.capU.active ? params.capU.waterInput : 0) +
      (params.capV.active ? params.capV.waterInput : 0) +
      (params.capW.active ? params.capW.waterInput : 0)

    const waterRecycled = params.ted.active ? (totalWaterInput * params.ted.recycleTarget) / 100 : 0
    const totalWaterConsumption =
      totalWaterInput - waterRecycled + (params.ted.active ? params.ted.treatmentCapacity * 0.1 : 0)

    // VHP/VBP flow based on steam flows and temperature
    const totalSteamFlow =
      (params.capU.active ? params.capU.steamFlow : 0) +
      (params.capV.active ? params.capV.steamFlow : 0) +
      (params.capW.active ? params.capW.steamFlow : 0)

    const vhpFlow = params.centralThermal.active ? totalSteamFlow * 0.55 * (params.centralThermal.pressure / 50) : 0
    const vbpFlow = params.centralThermal.active ? totalSteamFlow * 0.35 * (params.centralThermal.pressure / 50) : 0

    // Efficiency: based on temperature, pressure, and active units
    const tempEfficiency = params.centralThermal.active
      ? Math.min(100, (params.centralThermal.targetTemp / 450) * 100)
      : 0
    const pressureEfficiency = params.centralThermal.active
      ? Math.min(100, (params.centralThermal.pressure / 50) * 100)
      : 0
    const unitEfficiency = numActiveUnits > 0 ? (numActiveUnits / 3) * 100 : 0
    const recycleEfficiency = params.ted.active ? params.ted.recycleTarget : 0
    const efficiency =
      tempEfficiency * 0.3 + pressureEfficiency * 0.25 + unitEfficiency * 0.25 + recycleEfficiency * 0.2

    // Daily cost in DH
    const energyCost = totalPower * 850 // DH per MW
    const waterCost = totalWaterConsumption * 12 // DH per m³
    const productionCost = params.sulfuric.active ? params.sulfuric.productionRate * 150 : 0
    const dailyCost = (energyCost + waterCost + productionCost) * 24

    // CO2 emissions (inversely related to efficiency and recycle rate)
    const co2Emissions = Math.max(0, 25 - efficiency * 0.15 - (params.ted.active ? params.ted.recycleTarget * 0.05 : 0))

    // pH estimate: affected by sulfuric production and treatment
    const phEstimate =
      7.0 +
      (params.ted.active ? params.ted.treatmentCapacity / 1000 : 0) -
      (params.sulfuric.active ? params.sulfuric.productionRate / 200 : 0)

    // Conductivity: affected by water flow and recycling
    const conductivityEstimate = 350 + totalWaterInput * 0.5 - (params.ted.active ? params.ted.recycleTarget * 2 : 0)

    return {
      totalPower: Math.round(totalPower * 10) / 10,
      totalWaterConsumption: Math.round(totalWaterConsumption),
      efficiency: Math.round(efficiency * 10) / 10,
      dailyCost: Math.round(dailyCost),
      vhpFlow: Math.round(vhpFlow * 10) / 10,
      vbpFlow: Math.round(vbpFlow * 10) / 10,
      co2Emissions: Math.round(co2Emissions * 10) / 10,
      waterRecycled: Math.round(waterRecycled),
      phEstimate: Math.round(phEstimate * 100) / 100,
      conductivityEstimate: Math.round(conductivityEstimate),
    }
  }, [])

  // Recalculate when inputs change
  useEffect(() => {
    setOutputs(calculateOutputs(inputs))
  }, [inputs, calculateOutputs])

  // Simulation loop with small fluctuations
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setOutputs((prev) => ({
        ...prev,
        totalPower: prev.totalPower + (Math.random() - 0.5) * 0.5,
        efficiency: Math.min(100, Math.max(0, prev.efficiency + (Math.random() - 0.5) * 0.3)),
        phEstimate: prev.phEstimate + (Math.random() - 0.5) * 0.02,
        conductivityEstimate: prev.conductivityEstimate + (Math.random() - 0.5) * 5,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const resetToDefaults = () => {
    setInputs({
      capU: { active: true, steamFlow: 0, waterInput: 0 },
      capV: { active: true, steamFlow: 0, waterInput: 0 },
      capW: { active: false, steamFlow: 0, waterInput: 0 },
      centralThermal: { active: true, targetTemp: 0, pressure: 0 },
      sulfuric: { active: true, productionRate: 0 },
      ted: { active: true, treatmentCapacity: 0, recycleTarget: 0 },
    })
    setIsRunning(false)
  }

  // Check slider range status
  const checkSliderStatus = () => {
    const allValues = [
      inputs.capU.steamFlow,
      inputs.capU.waterInput,
      inputs.capV.steamFlow,
      inputs.capV.waterInput,
      inputs.capW.steamFlow,
      inputs.capW.waterInput,
      inputs.centralThermal.targetTemp,
      inputs.centralThermal.pressure,
      inputs.sulfuric.productionRate,
      inputs.ted.treatmentCapacity,
      inputs.ted.recycleTarget,
    ]
    
    // Green if all values are within valid ranges (>= 0)
    return allValues.every(val => val >= 0)
  }

  // Check individual component status
  const checkCapUnitStatus = (unit: "capU" | "capV" | "capW") => {
    // NO if active but values too low, or values out of safe range
    if (!inputs[unit].active) return true // OK if disabled
    return inputs[unit].steamFlow >= 30 && inputs[unit].waterInput >= 30 && 
           inputs[unit].steamFlow <= 150 && inputs[unit].waterInput <= 200
  }

  const checkCentralThermalStatus = () => {
    if (!inputs.centralThermal.active) return true
    // NO if temperature too low (<200) or pressure too low (<10) for operation
    return inputs.centralThermal.targetTemp >= 200 && inputs.centralThermal.pressure >= 10
  }

  const checkSulfuricStatus = () => {
    if (!inputs.sulfuric.active) return true
    // NO if production rate too low for operation
    return inputs.sulfuric.productionRate >= 20
  }

  const checkTedStatus = () => {
    if (!inputs.ted.active) return true
    // NO if treatment capacity too low (<100) or recycle target too low (<30)
    return inputs.ted.treatmentCapacity >= 100 && inputs.ted.recycleTarget >= 30
  }

  const isSliderHealthy = checkSliderStatus()

  const updateCapUnit = (unit: "capU" | "capV" | "capW", field: string, value: number | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [unit]: { ...prev[unit], [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Simulation du Procédé</h2>
          <p className="text-slate-400 mt-1">Modifiez les paramètres d'entrée pour voir l'impact sur le système en temps réel</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Slider Status Indicator - Big Light */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 ${isSliderHealthy ? "border-emerald-500/50 bg-emerald-500/10" : "border-red-500/50 bg-red-500/10"}`}>
            <div className={`w-4 h-4 rounded-full ${isSliderHealthy ? "bg-emerald-500 shadow-lg shadow-emerald-500/70 animate-pulse" : "bg-red-500 shadow-lg shadow-red-500/70 animate-pulse"}`} />
            <span className={`text-sm font-bold ${isSliderHealthy ? "text-emerald-400" : "text-red-400"}`}>
              {isSliderHealthy ? "Plages Valides" : "Erreur Plage"}
            </span>
          </div>
          
          <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-gradient-to-r from-emerald-600 to-emerald-500" : "bg-slate-700"}>
            {isRunning ? "En cours" : "Arrêté"}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="border-indigo-500/50 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Pause" : "Démarrer"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="border-slate-600/50 hover:bg-slate-800/50 bg-transparent transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT PARAMETERS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Paramètres d'Entrée (Modifiables)
            </h3>
            {/* Status Indicator for Input Parameters */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isSliderHealthy ? "border-emerald-500/40 bg-emerald-500/8" : "border-red-500/40 bg-red-500/8"}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isSliderHealthy ? "bg-emerald-500 shadow-md shadow-emerald-500/60 animate-pulse" : "bg-red-500 shadow-md shadow-red-500/60 animate-pulse"}`} />
              <span className={`text-xs font-semibold ${isSliderHealthy ? "text-emerald-400" : "text-red-400"}`}>
                {isSliderHealthy ? "OK" : "Erreur"}
              </span>
            </div>
          </div>

          {/* CAP Units */}
          {(["capU", "capV", "capW"] as const).map((unit) => {
            const isUnitHealthy = checkCapUnitStatus(unit)
            return (
            <Card key={unit} className="bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/30 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-indigo-400" />
                    <span className={`${isUnitHealthy ? "text-emerald-400" : "text-red-400"} font-semibold`}>CAP {unit.slice(-1)}</span>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isUnitHealthy ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isUnitHealthy ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                      {isUnitHealthy ? "OK" : "NO"}
                    </div>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Actif</span>
                    <Switch
                      checked={inputs[unit].active}
                      onCheckedChange={(checked) => updateCapUnit(unit, "active", checked)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Débit Vapeur</span>
                    <span className="text-indigo-300 font-semibold">{inputs[unit].steamFlow} T/h</span>
                  </div>
                  <Slider
                    value={[inputs[unit].steamFlow]}
                    onValueChange={([v]) => updateCapUnit(unit, "steamFlow", v)}
                    min={0}
                    max={150}
                    step={1}
                    disabled={!inputs[unit].active}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Retour Condensat</span>
                    <span className="text-indigo-300 font-semibold">{inputs[unit].waterInput} m³/h</span>
                  </div>
                  <Slider
                    value={[inputs[unit].waterInput]}
                    onValueChange={([v]) => updateCapUnit(unit, "waterInput", v)}
                    min={0}
                    max={200}
                    step={1}
                    disabled={!inputs[unit].active}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
            )
          })}

          {/* Central Thermal */}
          <Card className="bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className={`${checkCentralThermalStatus() ? "text-emerald-400" : "text-red-400"} font-semibold`}>Central Thermique</span>
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${checkCentralThermalStatus() ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checkCentralThermalStatus() ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                    {checkCentralThermalStatus() ? "OK" : "NO"}
                  </div>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Actif</span>
                  <Switch
                    checked={inputs.centralThermal.active}
                    onCheckedChange={(checked) =>
                      setInputs((prev) => ({
                        ...prev,
                        centralThermal: { ...prev.centralThermal, active: checked },
                      }))
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Température Cible</span>
                  <span className="text-orange-300 font-semibold">{inputs.centralThermal.targetTemp} °C</span>
                </div>
                <Slider
                  value={[inputs.centralThermal.targetTemp]}
                  onValueChange={([v]) =>
                    setInputs((prev) => ({
                      ...prev,
                      centralThermal: { ...prev.centralThermal, targetTemp: v },
                    }))
                  }
                  min={0}
                  max={500}
                  step={5}
                  disabled={!inputs.centralThermal.active}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pression</span>
                  <span className="text-orange-300 font-semibold">{inputs.centralThermal.pressure} bar</span>
                </div>
                <Slider
                  value={[inputs.centralThermal.pressure]}
                  onValueChange={([v]) =>
                    setInputs((prev) => ({
                      ...prev,
                      centralThermal: { ...prev.centralThermal, pressure: v },
                    }))
                  }
                  min={0}
                  max={60}
                  step={1}
                  disabled={!inputs.centralThermal.active}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sulfuric Unit */}
          <Card className="bg-slate-800/40 border-slate-700/50 hover:border-yellow-500/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-yellow-400" />
                  <span className={`${checkSulfuricStatus() ? "text-emerald-400" : "text-red-400"} font-semibold`}>Unité Sulfurique</span>
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${checkSulfuricStatus() ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checkSulfuricStatus() ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                    {checkSulfuricStatus() ? "OK" : "NO"}
                  </div>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Actif</span>
                  <Switch
                    checked={inputs.sulfuric.active}
                    onCheckedChange={(checked) =>
                      setInputs((prev) => ({
                        ...prev,
                        sulfuric: { ...prev.sulfuric, active: checked },
                      }))
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taux de Production</span>
                  <span className="text-yellow-300 font-semibold">{inputs.sulfuric.productionRate} %</span>
                </div>
                <Slider
                  value={[inputs.sulfuric.productionRate]}
                  onValueChange={([v]) =>
                    setInputs((prev) => ({
                      ...prev,
                      sulfuric: { ...prev.sulfuric, productionRate: v },
                    }))
                  }
                  min={0}
                  max={100}
                  step={1}
                  disabled={!inputs.sulfuric.active}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* TED */}
          <Card className="bg-slate-800/40 border-slate-700/50 hover:border-blue-500/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className={`${checkTedStatus() ? "text-emerald-400" : "text-red-400"} font-semibold`}>Traitement Eau (TED)</span>
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${checkTedStatus() ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checkTedStatus() ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                    {checkTedStatus() ? "OK" : "NO"}
                  </div>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Actif</span>
                  <Switch
                    checked={inputs.ted.active}
                    onCheckedChange={(checked) =>
                      setInputs((prev) => ({
                        ...prev,
                        ted: { ...prev.ted, active: checked },
                      }))
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Capacité Traitement</span>
                  <span className="text-blue-300 font-semibold">{inputs.ted.treatmentCapacity} m³/h</span>
                </div>
                <Slider
                  value={[inputs.ted.treatmentCapacity]}
                  onValueChange={([v]) =>
                    setInputs((prev) => ({
                      ...prev,
                      ted: { ...prev.ted, treatmentCapacity: v },
                    }))
                  }
                  min={0}
                  max={500}
                  step={10}
                  disabled={!inputs.ted.active}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Objectif Recyclage</span>
                  <span className="text-blue-300 font-semibold">{inputs.ted.recycleTarget} %</span>
                </div>
                <Slider
                  value={[inputs.ted.recycleTarget]}
                  onValueChange={([v]) =>
                    setInputs((prev) => ({
                      ...prev,
                      ted: { ...prev.ted, recycleTarget: v },
                    }))
                  }
                  min={0}
                  max={100}
                  step={1}
                  disabled={!inputs.ted.active}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CALCULATED OUTPUTS */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-300 flex items-center gap-2 px-2">
            <TrendingUp className="w-5 h-5" />
            Résultats Calculés (Automatiques)
          </h3>

          {/* Main KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-indigo-900/30 to-slate-900/40 border-indigo-500/30 hover:border-indigo-400/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm text-slate-400">Puissance Totale</span>
                </div>
                <p className="text-3xl font-bold text-indigo-300">{outputs.totalPower.toFixed(1)}</p>
                <p className="text-sm text-slate-400">MW</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900/40 border-blue-500/30 hover:border-blue-400/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Conso. Eau Nette</span>
                </div>
                <p className="text-3xl font-bold text-blue-300">{outputs.totalWaterConsumption}</p>
                <p className="text-sm text-slate-400">m³/h</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900/40 border-emerald-500/30 hover:border-emerald-400/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-400">Efficacité</span>
                </div>
                <p className="text-3xl font-bold text-emerald-300">{outputs.efficiency.toFixed(1)}</p>
                <p className="text-sm text-slate-400">%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/40 border-amber-500/30 hover:border-amber-400/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-slate-400">Coût Journalier</span>
                </div>
                <p className="text-3xl font-bold text-amber-300">{(outputs.dailyCost / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-400">DH</p>
              </CardContent>
            </Card>
          </div>

          {/* Steam Flows */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                Débits Vapeur Calculés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/30 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">VHP (Haute Pression)</p>
                  <p className="text-2xl font-bold text-orange-400">{outputs.vhpFlow.toFixed(1)} T/h</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/30 to-slate-800/30 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">VBP (Basse Pression)</p>
                  <p className="text-2xl font-bold text-yellow-400">{outputs.vbpFlow.toFixed(1)} T/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water & Environment */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Eau & Environnement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Eau Recyclée</p>
                  <p className="text-2xl font-bold text-blue-400">{outputs.waterRecycled} m³/h</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Réduction CO₂</p>
                  <p className="text-2xl font-bold text-emerald-400">{outputs.co2Emissions.toFixed(1)} %</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Estimates */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Beaker className="w-4 h-4 text-purple-400" />
                Qualité Eau Estimée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">pH Estimé</p>
                  <p
                    className={`text-2xl font-bold ${
                      outputs.phEstimate >= 6.5 && outputs.phEstimate <= 7.5 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {outputs.phEstimate.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">Optimal: 6.5 - 7.5</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Conductivité</p>
                  <p
                    className={`text-2xl font-bold ${
                      outputs.conductivityEstimate <= 500 ? "text-emerald-400" : "text-yellow-400"
                    }`}
                  >
                    {outputs.conductivityEstimate}
                  </p>
                  <p className="text-xs text-slate-500">µS/cm (max: 500)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formula explanation */}
          <Card className="bg-slate-800/50 border-slate-700/30">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">Formules utilisées:</strong>
                <br />• Puissance = Σ(base + débit × coeff) par unité
                <br />• Efficacité = 0.3×Temp + 0.25×Pression + 0.25×Unités + 0.2×Recyclage
                <br />• Coût = (Énergie×850 + Eau×12 + Prod×150) × 24h
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
