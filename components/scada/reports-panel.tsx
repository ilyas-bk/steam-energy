"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp, TrendingDown, Droplets, Leaf, Brain, DollarSign, BarChart3, FileSpreadsheet, FileDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useDashboard } from "@/context/dashboard-context"

export function ReportsPanel() {
  const { reports } = useDashboard()

  const trendData = [
    { month: "Juil", economies: 68500, couts: 3200000 },
    { month: "Août", economies: 72300, couts: 3150000 },
    { month: "Sept", economies: 85400, couts: 3100000 },
    { month: "Oct", economies: 92100, couts: 3050000 },
    { month: "Nov", economies: 98200, couts: 3000000 },
    { month: "Déc", economies: 105000, couts: 2950000 },
  ]

  const getCategoryBadge = (category: string) => {
    const colorClasses: Record<string, string> = {
      "Performance Globale": "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
      "Intelligence Artificielle": "bg-purple-500/20 text-purple-400 border-purple-500/50",
      "Énergie": "bg-amber-500/20 text-amber-400 border-amber-500/50",
      "Ressources Hydrauliques": "bg-blue-500/20 text-blue-400 border-blue-500/50",
      "Centrale Thermique": "bg-orange-500/20 text-orange-400 border-orange-500/50",
      "Unité Sulfurique": "bg-red-500/20 text-red-400 border-red-500/50",
      "TED": "bg-green-500/20 text-green-400 border-green-500/50",
      "CAP": "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
    }
    return <Badge className={colorClasses[category] || colorClasses["Performance Globale"]}>{category}</Badge>
  }

  const handleDownload = (reportId: string, format: "pdf" | "excel") => {
    console.log(`Downloading report ${reportId} as ${format}`)
    // TODO: Implement actual download logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Rapports & Analyses</h2>
        <div className="flex gap-2">
          <Button className="bg-slate-500/20 text-slate-400 border border-slate-500/50 hover:bg-slate-500/30">
            <Calendar className="w-4 h-4 mr-2" />
            Période
          </Button>
          <Button className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30">
            <FileText className="w-4 h-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Économies Totale</p>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">543,200 DH</p>
            <p className="text-xs text-emerald-400 mt-2">+18.5% ce mois</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Eau Economisé</p>
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">18,450 m³</p>
            <p className="text-xs text-blue-400 mt-2">-22% consommation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-2 border-green-500/30 shadow-lg shadow-green-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">CO₂ Réduit</p>
              <Leaf className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">142 Tonnes</p>
            <p className="text-xs text-green-400 mt-2">Impact environnemental</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Efficacité IA</p>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">97.2%</p>
            <p className="text-xs text-purple-400 mt-2">Performance optimale</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Coût Total Mensuel</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">3.75M DH</p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Économies IA</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">425K DH</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-2 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Profit Net</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">350K DH</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-2 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Pertes Estimées</p>
                <p className="text-2xl font-bold text-red-400 mt-1">30K DH</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Tendance Économies vs Coûts Optimisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value: number) => `${value.toLocaleString()} DH`}
                />
                <Legend />
                <Bar dataKey="economies" name="Économies" fill="#f59e0b" />
                <Bar dataKey="couts" name="Coûts Optimisés" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Rapports Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-white">{report.title}</p>
                      {getCategoryBadge(report.category)}
                    </div>
                    <p className="text-xs text-slate-400">
                      {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(report.id, "pdf")}
                    className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(report.id, "excel")}
                    className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileDown className="w-5 h-5 text-purple-400" />
            Options d'Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Export PDF</h3>
                <p className="text-xs text-slate-400">Rapport complet avec graphiques</p>
                <Button 
                  className="mt-4 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Export Excel</h3>
                <p className="text-xs text-slate-400">Données brutes pour analyse</p>
                <Button 
                  className="mt-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileDown className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Export CSV</h3>
                <p className="text-xs text-slate-400">Format universel compatible</p>
                <Button 
                  className="mt-4 bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
