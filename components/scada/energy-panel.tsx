"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, TrendingDown, DollarSign, Target, Download, Settings } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function EnergyPanel() {
  const [currentPower, setCurrentPower] = useState(5.43)
  const [todaysSavings, setTodaysSavings] = useState(1245)
  const [costReduction, setCostReduction] = useState(2.5)
  const [aiEfficiency, setAiEfficiency] = useState(96.8)

  // Consumption & AI Predictions chart data
  const [consumptionData, setConsumptionData] = useState([
    { time: "00:00", real: 4.2, forecast: 4.1 },
    { time: "04:00", real: 3.8, forecast: 3.9 },
    { time: "08:00", real: 5.1, forecast: 5.0 },
    { time: "12:00", real: 5.8, forecast: 5.7 },
    { time: "16:00", real: 5.3, forecast: 5.4 },
    { time: "20:00", real: 4.9, forecast: 4.8 },
  ])

  // Energy Distribution (Donut Chart)
  const distributionData = [
    { name: "CAP U", value: 28, color: "#f59e0b" },
    { name: "CAP V", value: 22, color: "#3b82f6" },
    { name: "CAP W", value: 18, color: "#8b5cf6" },
    { name: "Centrale", value: 25, color: "#10b981" },
    { name: "Others", value: 7, color: "#64748b" },
  ]

  // AI Savings Bar Chart with detailed data
  const savingsData = [
    { month: "Jan", savings: 15, cost: 850, target: 20 },
    { month: "Fév", savings: 18, cost: 920, target: 22 },
    { month: "Mar", savings: 22, cost: 1150, target: 24 },
    { month: "Avr", savings: 25, cost: 1380, target: 26 },
    { month: "Mai", savings: 28, cost: 1580, target: 28 },
    { month: "Jun", savings: 32, cost: 1820, target: 30 },
  ]

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPower(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(2))
      setTodaysSavings(prev => prev + Math.floor(Math.random() * 5))
      setAiEfficiency(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(1))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Monitoring Énergétique</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-emerald-500/50 hover:bg-emerald-600/20 text-emerald-400">
            <Settings className="w-4 h-4 mr-2" />
            Optimiser
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600/50 hover:bg-slate-800/50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Puissance Actuelle */}
        <Card className="bg-slate-800/40 border-2 border-amber-500/30 shadow-lg shadow-amber-500/10 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-400">Puissance Actuelle</span>
            </div>
            <p className="text-3xl font-bold text-amber-300 mb-3">{currentPower.toFixed(2)} MW</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentPower / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Capacité: 10 MW</p>
          </CardContent>
        </Card>

        {/* Economie Aujourd'hui */}
        <Card className="bg-slate-800/40 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-400">Economie Aujourd'hui</span>
            </div>
            <p className="text-3xl font-bold text-emerald-300 mb-1">{todaysSavings.toLocaleString()} kWh</p>
            <p className="text-sm text-emerald-400 font-semibold">-32% vs hier</p>
          </CardContent>
        </Card>

        {/* Cout Reduct */}
        <Card className="bg-slate-800/40 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Cout Reduct</span>
            </div>
            <p className="text-3xl font-bold text-cyan-300 mb-1">DH {costReduction.toFixed(1)}k</p>
            <p className="text-sm text-slate-400">Ce mois</p>
          </CardContent>
        </Card>

        {/* Efficacite IA */}
        <Card className="bg-slate-800/40 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Efficacite IA</span>
            </div>
            <p className="text-3xl font-bold text-purple-300 mb-1">{aiEfficiency.toFixed(1)}%</p>
            <p className="text-sm text-purple-400 font-semibold">+2.3% optimisation</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Consumption & AI Predictions */}
        <Card className="lg:col-span-2 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Consumption & AI Predictions (MW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Line type="monotone" dataKey="real" stroke="#f59e0b" strokeWidth={3} name="Réel" dot={{ fill: '#f59e0b', r: 5 }} />
                <Line type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={3} strokeDasharray="5 5" name="Prévision IA" dot={{ fill: '#06b6d4', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart - Energy Distribution */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">Distribution Énergétique</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  labelLine={false}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced AI Savings Section */}
      <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-800/40 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Économies Réalisées par IA
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">Économie Totale</p>
                <p className="text-xl font-bold text-emerald-400">+32%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Coût Évité</p>
                <p className="text-xl font-bold text-cyan-400">7.7K DH</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={savingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                style={{ fontSize: '13px', fontWeight: 600 }} 
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
                label={{ value: 'Économie (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #10b981', 
                  borderRadius: '12px',
                  padding: '12px'
                }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
                formatter={(value: any, name: string) => {
                  if (name === 'savings') return [`${value}%`, 'Économie Réalisée']
                  if (name === 'target') return [`${value}%`, 'Objectif']
                  if (name === 'cost') return [`${value} DH`, 'Coût Évité']
                  return [value, name]
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="savings" 
                fill="url(#colorSavings)" 
                radius={[10, 10, 0, 0]} 
                name="Économie Réalisée (%)"
                maxBarSize={50}
              />
              <Bar 
                dataKey="target" 
                fill="url(#colorTarget)" 
                radius={[10, 10, 0, 0]} 
                name="Objectif (%)"
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Summary Cards Below Chart */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/60 rounded-lg p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-400">Moyenne Mensuelle</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">23.3%</p>
              <p className="text-xs text-slate-500 mt-1">Économie d'énergie</p>
            </div>
            
            <div className="bg-slate-800/60 rounded-lg p-4 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-xs text-slate-400">Tendance</span>
              </div>
              <p className="text-2xl font-bold text-cyan-400">+113%</p>
              <p className="text-xs text-slate-500 mt-1">Croissance 6 mois</p>
            </div>
            
            <div className="bg-slate-800/60 rounded-lg p-4 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="text-xs text-slate-400">Prédiction Juillet</span>
              </div>
              <p className="text-2xl font-bold text-violet-400">35%</p>
              <p className="text-xs text-slate-500 mt-1">Économie estimée</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
