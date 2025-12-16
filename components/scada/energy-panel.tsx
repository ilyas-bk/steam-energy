"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, AlertCircle, BarChart3, PieChart, Activity, Gauge, Thermometer, Droplets } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart as RechartsChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function EnergyPanel() {
  const energyData = [
    { time: "00:00", production: 42.5, consumption: 38.2, grid: 4.3 },
    { time: "04:00", production: 38.2, consumption: 35.1, grid: 3.1 },
    { time: "08:00", production: 45.8, consumption: 42.3, grid: 3.5 },
    { time: "12:00", production: 48.2, consumption: 45.6, grid: 2.6 },
    { time: "16:00", production: 46.5, consumption: 44.2, grid: 2.3 },
    { time: "20:00", production: 44.1, consumption: 41.8, grid: 2.3 },
    { time: "23:59", production: 42.8, consumption: 39.5, grid: 3.3 },
  ]

  const sourceData = [
    { name: "Centrale Thermique", value: 65, fill: "#f59e0b" },
    { name: "Unité Sulfurique", value: 20, fill: "#ef4444" },
    { name: "CAP U/V/W", value: 15, fill: "#3b82f6" },
  ]

  const consumptionData = [
    { name: "Refroidissement", value: 35, fill: "#06b6d4" },
    { name: "Pompes", value: 25, fill: "#10b981" },
    { name: "Contrôle", value: 20, fill: "#8b5cf6" },
    { name: "Autres", value: 20, fill: "#64748b" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion Énergétique</h2>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">En ligne</Badge>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-900/20 to-slate-900 border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Production</p>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">45.68 MW</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Consommation</p>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">42.15 MW</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Excédent Export</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">3.53 MW</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Efficacité</p>
              <Gauge className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">93.2%</p>
          </CardContent>
        </Card>
      </div>

      {/* Production vs Consumption Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Production vs Consommation (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line type="monotone" dataKey="production" stroke="#f59e0b" strokeWidth={2} name="Production" />
                <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} name="Consommation" />
                <Line type="monotone" dataKey="grid" stroke="#10b981" strokeWidth={2} name="Export" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sources and Consumption Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Energy Sources */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              Sources d'Énergie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Consumption */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Répartition Consommation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie data={consumptionData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {consumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Puissance Actuelle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Centrale Thermique</span>
              <Thermometer className="w-5 h-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Puissance</span>
                  <span className="text-white font-bold">29.7 MW</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Température: <span className="text-white font-bold">417°C</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Unité Sulfurique</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Puissance</span>
                  <span className="text-white font-bold">9.1 MW</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Export VHP: <span className="text-white font-bold">46 T/h</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">CAP U/V/W</span>
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Puissance</span>
                  <span className="text-white font-bold">6.88 MW</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Charge moy: <span className="text-white font-bold">115%</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="bg-amber-500/10 border-2 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-1" />
            <div>
              <p className="text-amber-400 font-semibold mb-1">⚠️ Consommation Élevée Prévue</p>
              <p className="text-sm text-amber-300">La consommation devrait augmenter de 8% dans les 2 prochaines heures. Vérifiez la capacité des circuits.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
