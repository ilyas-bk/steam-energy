"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Settings, Archive, MapPin, Clock, Thermometer, Droplets, Zap, Activity, Wrench, Brain, AlertOctagon } from "lucide-react"

interface Alert {
  id: string
  level: "critical" | "warning" | "info" | "success"
  title: string
  description: string
  timestamp: string
  acknowledged: boolean
  source: string
  category: "thermique" | "qualité" | "ressources" | "production" | "maintenance" | "ia"
  impact?: string
}

type FilterCategory = "all" | "critical" | "warning" | "info" | "unacknowledged"

export function AlertsPanel() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all")
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      level: "critical",
      title: "Température VHP élevée",
      description: "Température VHP Sulfurique: 435°C (seuil: 420°C)",
      timestamp: "14:32:15",
      acknowledged: false,
      source: "Unité Sulfurique",
      category: "thermique",
      impact: "Risque de dépassement de seuil critique et arrêt automatique"
    },
    {
      id: "2",
      level: "warning",
      title: "pH hors plage - CAP W",
      description: "pH condensat: 6.8 (plage normale: 7.0-7.5)",
      timestamp: "14:28:45",
      acknowledged: false,
      source: "CAP W",
      category: "qualité",
      impact: "Qualité de l'eau compromise - ajustement requis"
    },
    {
      id: "3",
      level: "warning",
      title: "Stock TED bas",
      description: "Stock prévu insuffisant pour les prochaines 24h",
      timestamp: "14:15:00",
      acknowledged: true,
      source: "Traitement TED",
      category: "ressources"
    },
    {
      id: "4",
      level: "info",
      title: "Maintenance planifiée",
      description: "Maintenance CAP V prévue dans 48h",
      timestamp: "10:00:00",
      acknowledged: true,
      source: "CAP V",
      category: "maintenance"
    },
    {
      id: "5",
      level: "critical",
      title: "Pression anormale Circuit Primaire",
      description: "Pression: 12.8 bar (seuil max: 12.0 bar)",
      timestamp: "14:45:22",
      acknowledged: false,
      source: "Circuit Primaire",
      category: "thermique",
      impact: "Risque de surpression - intervention immédiate requise"
    },
    {
      id: "6",
      level: "info",
      title: "Optimisation IA appliquée",
      description: "L'IA a ajusté les paramètres de CAP U pour améliorer l'efficacité",
      timestamp: "13:20:10",
      acknowledged: true,
      source: "Système IA",
      category: "ia"
    },
    {
      id: "7",
      level: "warning",
      title: "Débit d'eau réduit",
      description: "Débit Circuit Refroidissement: 365 m³/h (min: 380 m³/h)",
      timestamp: "12:15:33",
      acknowledged: false,
      source: "Circuit Refroidissement",
      category: "ressources",
      impact: "Refroidissement insuffisant - surveillance nécessaire"
    },
    {
      id: "8",
      level: "success",
      title: "Audit qualité réussi",
      description: "Tous les paramètres de qualité conformes aux normes",
      timestamp: "09:00:00",
      acknowledged: true,
      source: "Système Qualité",
      category: "qualité"
    }
  ])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const archiveAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })))
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertOctagon className="w-5 h-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "thermique":
        return <Thermometer className="w-4 h-4" />
      case "qualité":
        return <Droplets className="w-4 h-4" />
      case "ressources":
        return <Activity className="w-4 h-4" />
      case "production":
        return <Zap className="w-4 h-4" />
      case "maintenance":
        return <Wrench className="w-4 h-4" />
      case "ia":
        return <Brain className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Critique</Badge>
      case "warning":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Avertissement</Badge>
      case "info":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Information</Badge>
      case "success":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Succès</Badge>
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">Inconnu</Badge>
    }
  }

  const getAlertStyle = (level: string, acknowledged: boolean) => {
    const opacity = acknowledged ? "opacity-60" : ""
    switch (level) {
      case "critical":
        return `border-red-500/50 bg-red-500/10 hover:bg-red-500/15 ${opacity}`
      case "warning":
        return `border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/15 ${opacity}`
      case "info":
        return `border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/15 ${opacity}`
      case "success":
        return `border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15 ${opacity}`
      default:
        return `border-slate-500/50 bg-slate-500/10 ${opacity}`
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    switch (activeFilter) {
      case "critical":
        return alert.level === "critical"
      case "warning":
        return alert.level === "warning"
      case "info":
        return alert.level === "info" || alert.level === "success"
      case "unacknowledged":
        return !alert.acknowledged
      default:
        return true
    }
  })

  const criticalCount = alerts.filter((a) => a.level === "critical" && !a.acknowledged).length
  const warningCount = alerts.filter((a) => a.level === "warning" && !a.acknowledged).length
  const infoCount = alerts.filter((a) => (a.level === "info" || a.level === "success") && !a.acknowledged).length
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Alertes Système</h2>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="bg-slate-500/20 text-slate-400 border border-slate-500/50 hover:bg-slate-500/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurer Alertes
          </Button>
          <Button
            size="sm"
            className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
            onClick={archiveAll}
          >
            <Archive className="w-4 h-4 mr-2" />
            Archiver Tout
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-900/20 to-slate-900 border-2 border-red-500/30 shadow-lg shadow-red-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Alertes Critiques</p>
              <AlertOctagon className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-4xl font-bold text-red-400">{criticalCount}</p>
            <p className="text-xs text-red-400 mt-2">Action immédiate requise</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900 border-2 border-amber-500/30 shadow-lg shadow-amber-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Avertissements</p>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-4xl font-bold text-amber-400">{warningCount}</p>
            <p className="text-xs text-amber-400 mt-2">Surveillance nécessaire</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Moyennes Audits</p>
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-4xl font-bold text-slate-300">{infoCount}</p>
            <p className="text-xs text-slate-400 mt-2">Informationnel</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Total Alts</p>
              <AlertCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-4xl font-bold text-cyan-400">{alerts.length}</p>
            <p className="text-xs text-cyan-400 mt-2">{unacknowledgedCount} non acquittées</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={activeFilter === "all" ? "default" : "outline"}
          className={activeFilter === "all" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-slate-800 hover:bg-slate-700"}
          onClick={() => setActiveFilter("all")}
        >
          Tous ({alerts.length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "critical" ? "default" : "outline"}
          className={activeFilter === "critical" ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-700"}
          onClick={() => setActiveFilter("critical")}
        >
          Critique ({alerts.filter(a => a.level === "critical").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "warning" ? "default" : "outline"}
          className={activeFilter === "warning" ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-800 hover:bg-slate-700"}
          onClick={() => setActiveFilter("warning")}
        >
          Avertissements ({alerts.filter(a => a.level === "warning").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "info" ? "default" : "outline"}
          className={activeFilter === "info" ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-800 hover:bg-slate-700"}
          onClick={() => setActiveFilter("info")}
        >
          Informations ({alerts.filter(a => a.level === "info" || a.level === "success").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "unacknowledged" ? "default" : "outline"}
          className={activeFilter === "unacknowledged" ? "bg-purple-500 hover:bg-purple-600" : "bg-slate-800 hover:bg-slate-700"}
          onClick={() => setActiveFilter("unacknowledged")}
        >
          Non Acquittés ({unacknowledgedCount})
        </Button>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucune alerte</h3>
              <p className="text-slate-400">Aucune alerte ne correspond aux critères de filtrage sélectionnés</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border transition-all duration-300 ${getAlertStyle(alert.level, alert.acknowledged)}`}>
              <CardContent className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.level)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getSeverityBadge(alert.level)}
                        {alert.acknowledged && (
                          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">
                            Acquitté
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-lg">{alert.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-4 ml-8">{alert.description}</p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ml-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Source</p>
                      <p className="text-sm text-white font-medium">{alert.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Horodatage</p>
                      <p className="text-sm text-white font-medium">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(alert.category)}
                    <div>
                      <p className="text-xs text-slate-500">Catégorie</p>
                      <p className="text-sm text-white font-medium capitalize">{alert.category}</p>
                    </div>
                  </div>
                </div>

                {/* Impact Box */}
                {alert.impact && !alert.acknowledged && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 ml-8">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-yellow-400 mb-1">Impact</p>
                        <p className="text-sm text-yellow-300">{alert.impact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 ml-8">
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acquitter
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
