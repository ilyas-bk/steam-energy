"use client"

import { useState, useEffect, useMemo } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Droplets, Recycle, TrendingDown, CheckCircle, Gauge, Thermometer, Activity, AlertTriangle } from "lucide-react"

export function WaterPanel() {
  const { dataMultiplier, anomalyActive } = useDashboard()
  const [currentFlow, setCurrentFlow] = useState(1285.6)
  const [recycleRate, setRecycleRate] = useState(68.2)
  const [monthlySavings, setMonthlySavings] = useState(4250)
  const [avgQuality, setAvgQuality] = useState(96.8)

  // Apply multiplier for anomaly - water leak reduces water availability
  const adjustedFlow = useMemo(() => {
    if (anomalyActive === "water-leak") {
      return currentFlow * 0.7 // Simulate 30% water loss
    }
    return currentFlow
  }, [currentFlow, anomalyActive])

  const adjustedSavings = useMemo(() => {
    if (anomalyActive === "water-leak") {
      return monthlySavings * 0.6
    }
    return monthlySavings
  }, [monthlySavings, anomalyActive])

  const [consumptionData, setConsumptionData] = useState([
    { time: "00:00", consommation: 1180, recyclage: 805 },
    { time: "04:00", consommation: 1220, recyclage: 835 },
    { time: "08:00", consommation: 1310, recyclage: 890 },
    { time: "12:00", consommation: 1280, recyclage: 875 },
    { time: "16:00", consommation: 1245, recyclage: 850 },
    { time: "20:00", consommation: 1290, recyclage: 880 },
  ])

  const [qualityData, setQualityData] = useState([
    { parameter: "pH", value: 95 },
    { parameter: "Turbidité", value: 98 },
    { parameter: "Conductivité", value: 97 },
    { parameter: "Chlore", value: 94 },
    { parameter: "Température", value: 96 },
  ])

  const [circuits, setCircuits] = useState({
    primaire: { debit: 520, temp: 42, pression: 8.2, status: "operational" },
    refroidissement: { debit: 385, temp: 28, pression: 6.5, status: "operational" },
    recycleTED: { debit: 280, temp: 35, pression: 11.8, status: "warning" },
    traitement: { debit: 100, temp: 22, pression: 4.2, status: "operational" },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Update KPI values
      setCurrentFlow(prev => prev + (Math.random() - 0.5) * 15)
      setRecycleRate(prev => Math.min(100, Math.max(50, prev + (Math.random() - 0.5) * 2)))
      setMonthlySavings(prev => prev + (Math.random() - 0.5) * 50)
      setAvgQuality(prev => Math.min(100, Math.max(90, prev + (Math.random() - 0.5) * 0.5)))

      // Update consumption chart
      setConsumptionData(prev => prev.map(point => ({
        ...point,
        consommation: point.consommation + (Math.random() - 0.5) * 20,
        recyclage: point.recyclage + (Math.random() - 0.5) * 15,
      })))

      // Update quality chart
      setQualityData(prev => prev.map(param => ({
        ...param,
        value: Math.min(100, Math.max(85, param.value + (Math.random() - 0.5) * 2)),
      })))

      // Update circuits
      setCircuits(prev => ({
        primaire: {
          ...prev.primaire,
          debit: prev.primaire.debit + (Math.random() - 0.5) * 10,
          temp: prev.primaire.temp + (Math.random() - 0.5) * 1,
          pression: prev.primaire.pression + (Math.random() - 0.5) * 0.3,
        },
        refroidissement: {
          ...prev.refroidissement,
          debit: prev.refroidissement.debit + (Math.random() - 0.5) * 8,
          temp: prev.refroidissement.temp + (Math.random() - 0.5) * 1,
          pression: prev.refroidissement.pression + (Math.random() - 0.5) * 0.2,
        },
        recycleTED: {
          ...prev.recycleTED,
          debit: prev.recycleTED.debit + (Math.random() - 0.5) * 6,
          temp: prev.recycleTED.temp + (Math.random() - 0.5) * 1,
          pression: prev.recycleTED.pression + (Math.random() - 0.5) * 0.4,
          status: prev.recycleTED.pression > 11 ? "warning" : "operational",
        },
        traitement: {
          ...prev.traitement,
          debit: prev.traitement.debit + (Math.random() - 0.5) * 4,
          temp: prev.traitement.temp + (Math.random() - 0.5) * 0.8,
          pression: prev.traitement.pression + (Math.random() - 0.5) * 0.2,
        },
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const flowProgress = Math.min(100, (currentFlow / 1500) * 100)
  const isQualityConforme = avgQuality >= 95

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion de l'Eau</h2>
        {anomalyActive === "water-leak" && (
          <div className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/50">
            <AlertTriangle className="w-4 h-4" />
            Fuite d'Eau Détectée
          </div>
        )}
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Débit Actuel</p>
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-3">{adjustedFlow.toFixed(1)} m³/h</p>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  anomalyActive === "water-leak" 
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                }`}
                style={{ width: `${Math.min(100, (adjustedFlow / 1500) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Capacité: 1500 m³/h</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Taux de Recyclage</p>
              <Recycle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{recycleRate.toFixed(1)}%</p>
            <p className="text-xs text-emerald-400 mt-2">+2.3% vs hier</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Économie d'Eau (mois)</p>
              <TrendingDown className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-cyan-400">{adjustedSavings.toFixed(0)} m³</p>
            <p className="text-xs text-cyan-400 mt-2">{anomalyActive === "water-leak" ? "-40% perte" : "-15% consommation"}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Qualité Moyenne</p>
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{avgQuality.toFixed(1)}%</p>
            <Badge 
              className={`mt-2 ${isQualityConforme ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}
            >
              {isQualityConforme ? 'Conforme' : 'À surveiller'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption vs Recycling Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Consommation & Recyclage (m³/h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consommation" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Consommation"
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recyclage" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Recyclage"
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Water Quality Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              Qualité de l'Eau (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="parameter" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="value" name="Qualité">
                    {qualityData.map((entry, index) => (
                      <Bar
                        key={`bar-${index}`}
                        dataKey="value"
                        fill={entry.value >= 95 ? "#10b981" : entry.value >= 90 ? "#eab308" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circuit Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Circuit Primaire */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Circuit Primaire
              </CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Opérationnel
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Débit
              </span>
              <span className="text-white font-semibold">{circuits.primaire.debit.toFixed(1)} m³/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temp
              </span>
              <span className="text-white font-semibold">{circuits.primaire.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pression
              </span>
              <span className="text-white font-semibold">{circuits.primaire.pression.toFixed(1)} bar</span>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Refroidissement */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Refroidissement
              </CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Opérationnel
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Débit
              </span>
              <span className="text-white font-semibold">{circuits.refroidissement.debit.toFixed(1)} m³/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temp
              </span>
              <span className="text-white font-semibold">{circuits.refroidissement.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pression
              </span>
              <span className="text-white font-semibold">{circuits.refroidissement.pression.toFixed(1)} bar</span>
            </div>
          </CardContent>
        </Card>

        {/* Recyclage TED */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-400" />
                Recyclage TED
              </CardTitle>
              <Badge className={`${circuits.recycleTED.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'}`}>
                {circuits.recycleTED.status === 'warning' ? 'Alerte' : 'Opérationnel'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Débit
              </span>
              <span className="text-white font-semibold">{circuits.recycleTED.debit.toFixed(1)} m³/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temp
              </span>
              <span className="text-white font-semibold">{circuits.recycleTED.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pression
              </span>
              <span className={`font-semibold ${circuits.recycleTED.pression > 11 ? 'text-amber-400' : 'text-white'}`}>
                {circuits.recycleTED.pression.toFixed(1)} bar
                {circuits.recycleTED.pression > 11 && <AlertTriangle className="w-4 h-4 inline ml-1" />}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Traitement Chimique */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Traitement Chimique
              </CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Opérationnel
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Débit
              </span>
              <span className="text-white font-semibold">{circuits.traitement.debit.toFixed(1)} m³/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temp
              </span>
              <span className="text-white font-semibold">{circuits.traitement.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pression
              </span>
              <span className="text-white font-semibold">{circuits.traitement.pression.toFixed(1)} bar</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
