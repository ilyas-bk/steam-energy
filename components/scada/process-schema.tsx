"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "@/context/dashboard-context"

interface SchemaData {
  capU: { charge: number; puissance: number; pH: number; cond: number; flow: number }
  capV: { charge: number; puissance: number; pH: number; cond: number; flow: number }
  capW: { charge: number; puissance: number; pH: number; cond: number; flow: number }
  centrale: {
    charge: number
    puissance: number
    efficacite: number
    temp: number
    retourPH: number
    retourCond: number
    retourDebit: number
    retourTemp: number
  }
  sulfurique: { charge: number; temp: number; vhpExport: number; vhpTemp: number; vbpExport: number; vbpTemp: number }
  ted: { charge: number; debitEntree: number; debitSortie: number; stockActuel: number; prevision24h: number; tauxRecyclage: number }
  echangeElec: {
    energieNecessaire: number
    energieProduite: number
    energieExportee: number
    energieImportee: number
    bilanNet: number
    statut: string
  }
}

export function ProcessSchema() {
  const { setAnomalyActive } = useDashboard()
  const [data, setData] = useState<SchemaData>({
    capU: { charge: 118.5, puissance: 11.85, pH: 6.9, cond: 450, flow: 63.1 },
    capV: { charge: 113.6, puissance: 11.36, pH: 7.0, cond: 485, flow: 56.6 },
    capW: { charge: 113.4, puissance: 11.34, pH: 6.7, cond: 467, flow: 61.4 },
    centrale: { charge: 91, puissance: 45.68, efficacite: 93.8, temp: 417.19, retourPH: 7.4, retourCond: 520, retourDebit: 210, retourTemp: 85 },
    sulfurique: { charge: 83, temp: 410, vhpExport: 46, vhpTemp: 410, vbpExport: 32, vbpTemp: 175 },
    ted: { charge: 86, debitEntree: 680, debitSortie: 340, stockActuel: 15125, prevision24h: 14097, tauxRecyclage: 92 },
    echangeElec: {
      energieNecessaire: 38.5,
      energieProduite: 45.68,
      energieExportee: 7.18,
      energieImportee: 0,
      bilanNet: 7.18,
      statut: "EXPORTATION"
    }
  })

  const [anomalyMode, setAnomalyMode] = useState<"none" | "uncomfortable-steam" | "water-leak">("none")

  // Force statut: set to "EXPORTATION", "IMPORTATION" or null to keep automatic mode
  const FORCE_STATUT: "EXPORTATION" | "IMPORTATION" | null = "IMPORTATION"

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPuissance = prev.centrale.puissance + (Math.random() - 0.5) * 0.5
        const energieNecessaire = prev.capU.puissance + prev.capV.puissance + prev.capW.puissance + 4.2
        let bilanNet = newPuissance - energieNecessaire
        let statut = bilanNet > 0 ? "EXPORTATION" : bilanNet < -2 ? "IMPORTATION" : "ÉQUILIBRE"

        // Override statut if forcing mode
        if (FORCE_STATUT === "EXPORTATION") {
          statut = "EXPORTATION"
          // Ensure positive export with a minimum visibility value
          bilanNet = Math.max(bilanNet, 0.5)
        } else if (FORCE_STATUT === "IMPORTATION") {
          statut = "IMPORTATION"
          // Ensure positive import with a minimum visibility value
          bilanNet = -Math.max(Math.abs(bilanNet), 0.5)
        }

        let newData = {
          capU: { ...prev.capU, charge: prev.capU.charge + (Math.random() - 0.5) * 2 },
          capV: { ...prev.capV, charge: prev.capV.charge + (Math.random() - 0.5) * 2 },
          capW: { ...prev.capW, charge: prev.capW.charge + (Math.random() - 0.5) * 2 },
          centrale: { ...prev.centrale, puissance: newPuissance },
          sulfurique: { ...prev.sulfurique, temp: prev.sulfurique.temp + (Math.random() - 0.5) * 1 },
          ted: { ...prev.ted, debitEntree: prev.ted.debitEntree + (Math.random() - 0.5) * 10 },
          echangeElec: {
            energieNecessaire,
            energieProduite: newPuissance,
            energieExportee: bilanNet > 0 ? bilanNet : 0,
            energieImportee: bilanNet < 0 ? Math.abs(bilanNet) : 0,
            bilanNet,
            statut,
          },
        }

        // Apply anomaly simulations
        if (anomalyMode === "uncomfortable-steam") {
          // Simulate uncomfortable steam: vapor flow significantly different from condensate return
          const vaporFlow = prev.capU.flow + prev.capV.flow + prev.capW.flow
          newData.centrale = {
            ...newData.centrale,
            retourDebit: vaporFlow * 0.65 // 35% difference (uncomfortable)
          }
        } else if (anomalyMode === "water-leak") {
          // Simulate water leak: return water less than input water
          newData.ted = {
            ...newData.ted,
            debitSortie: newData.ted.debitEntree * 0.70 // 30% loss (leak)
          }
        }

        return newData
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [anomalyMode])

  return (
    <div className="space-y-6">
      <div className="relative">
        <h2 className="relative text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">Schéma Procédé</h2>
        <p className="relative text-slate-300 mt-2 text-lg font-medium">Diagramme détaillé avec valeurs en temps réel</p>
      </div>

      {/* Anomaly Testing Controls */}
      <div className="relative bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">🧪 Tests d'Anomalies</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setAnomalyMode("none")
              setAnomalyActive("none")
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              anomalyMode === "none"
                ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ✓ Normal
          </button>
          <button
            onClick={() => {
              setAnomalyMode("uncomfortable-steam")
              setAnomalyActive("uncomfortable-steam")
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              anomalyMode === "uncomfortable-steam"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ⚠️ Vapeur Inconfortable
          </button>
          <button
            onClick={() => {
              setAnomalyMode("water-leak")
              setAnomalyActive("water-leak")
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              anomalyMode === "water-leak"
                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            💧 Fuite d'Eau
          </button>
        </div>
      </div>

      {/* SVG Schema */}
      <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800/60">
        <svg className="w-full" style={{ minHeight: 700 }} viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="#22d3ee" />
            </marker>
            <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="#fb923c" />
            </marker>
            <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="#10b981" />
            </marker>
            <marker id="arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="#fbbf24" />
            </marker>
            <style>{`
              .unit-box { fill: rgba(15,23,42,0.9); stroke: #1e293b; stroke-width: 2; }
              .unit-title { font: 700 16px Inter, sans-serif; fill: #22d3ee; }
              .value-big { font: 700 18px Inter, sans-serif; fill: #fbbf24; }
              .value-med { font: 600 14px Inter, sans-serif; fill: #34d399; }
              .value-small { font: 500 12px Inter, sans-serif; fill: #94a3b8; }
              .label { font: 500 11px Inter, sans-serif; fill: #64748b; }
              .pipe { stroke: #22d3ee; stroke-width: 3; fill: none; }
              .pipe-vapor { stroke: #fb923c; stroke-width: 3; fill: none; }
              .pipe-elec-export { stroke: #10b981; stroke-width: 3; fill: none; }
              .pipe-elec-import { stroke: #fbbf24; stroke-width: 3; fill: none; }
              .sensor-dot { fill: #06b6d4; }
              .counter-box { fill: rgba(71,85,105,0.3); stroke: #475569; stroke-width: 1.5; }
              .status-export { fill: #22d3ee; }
              .status-import { fill: #fbbf24; }
              .status-balance { fill: #64748b; }
            `}</style>
          </defs>

          {/* TOP: Condensat+ header line */}
          <path d="M 80 60 H 1320" className="pipe" />
          <text x="90" y="50" className="label">Cond. +</text>
          <circle cx="400" cy="60" r="5" className="sensor-dot" />
          <circle cx="700" cy="60" r="5" className="sensor-dot" />
          <circle cx="1000" cy="60" r="5" className="sensor-dot" />

          {/* CAP U */}
          <rect x="120" y="100" width="200" height="140" rx="8" className="unit-box" />
          <text x="220" y="125" textAnchor="middle" className="unit-title">CAP U</text>
          <text x="140" y="155" className="label">Charge:</text>
          <text x="280" y="155" textAnchor="end" className="value-big">{data.capU.charge.toFixed(1)}%</text>
          <text x="140" y="175" className="label">Puissance:</text>
          <text x="280" y="175" textAnchor="end" className="value-med">{data.capU.puissance.toFixed(2)} MW</text>
          <text x="140" y="200" className="label">Recyclage Vapeur BP:</text>
          <text x="140" y="218" className="value-small">pH: {data.capU.pH}</text>
          <text x="190" y="218" className="value-small">Cond: {data.capU.cond}</text>
          <text x="250" y="218" className="value-small">F: {data.capU.flow.toFixed(1)}</text>
          <path d="M 220 240 V 310" className="pipe-vapor" markerEnd="url(#arrowOrange)" />
          <circle cx="220" cy="250" r="5" className="sensor-dot" />

          {/* CAP V */}
          <rect x="370" y="100" width="200" height="140" rx="8" className="unit-box" />
          <text x="470" y="125" textAnchor="middle" className="unit-title">CAP V</text>
          <text x="390" y="155" className="label">Charge:</text>
          <text x="530" y="155" textAnchor="end" className="value-big">{data.capV.charge.toFixed(1)}%</text>
          <text x="390" y="175" className="label">Puissance:</text>
          <text x="530" y="175" textAnchor="end" className="value-med">{data.capV.puissance.toFixed(2)} MW</text>
          <text x="390" y="200" className="label">Recyclage Vapeur BP:</text>
          <text x="390" y="218" className="value-small">pH: {data.capV.pH}</text>
          <text x="440" y="218" className="value-small">Cond: {data.capV.cond}</text>
          <text x="500" y="218" className="value-small">F: {data.capV.flow.toFixed(1)}</text>
          <path d="M 470 240 V 310" className="pipe-vapor" markerEnd="url(#arrowOrange)" />
          <circle cx="470" cy="250" r="5" className="sensor-dot" />

          {/* CAP W */}
          <rect x="620" y="100" width="200" height="140" rx="8" className="unit-box" />
          <text x="720" y="125" textAnchor="middle" className="unit-title">CAP W</text>
          <text x="640" y="155" className="label">Charge:</text>
          <text x="780" y="155" textAnchor="end" className="value-big">{data.capW.charge.toFixed(1)}%</text>
          <text x="640" y="175" className="label">Puissance:</text>
          <text x="780" y="175" textAnchor="end" className="value-med">{data.capW.puissance.toFixed(2)} MW</text>
          <text x="640" y="200" className="label">Recyclage Vapeur BP:</text>
          <text x="640" y="218" className="value-small">pH: {data.capW.pH}</text>
          <text x="690" y="218" className="value-small">Cond: {data.capW.cond}</text>
          <text x="750" y="218" className="value-small">F: {data.capW.flow.toFixed(1)}</text>
          <path d="M 720 240 V 310" className="pipe-vapor" markerEnd="url(#arrowOrange)" />
          <circle cx="720" cy="250" r="5" className="sensor-dot" />

          {/* Vapeur BP horizontal collector */}
          <path d="M 220 310 H 720" className="pipe-vapor" />
          <text x="440" y="300" className="value-small">Vapeur BP</text>
          <circle cx="470" cy="310" r="5" className="sensor-dot" />

          {/* CENTRALE THERMIQUE */}
          <rect x="400" y="350" width="280" height="200" rx="10" className="unit-box" />
          <text x="540" y="380" textAnchor="middle" className="unit-title">CENTRALE THERMIQUE</text>
          <text x="420" y="410" className="label">Charge:</text>
          <text x="640" y="410" textAnchor="end" className="value-big">{data.centrale.charge}%</text>
          <text x="420" y="435" className="label">Puissance:</text>
          <text x="640" y="435" textAnchor="end" className="value-big">{data.centrale.puissance.toFixed(2)} MW</text>
          <text x="420" y="460" className="label">Efficacité IA:</text>
          <text x="640" y="460" textAnchor="end" className="value-med">{data.centrale.efficacite.toFixed(1)}%</text>
          <text x="420" y="485" className="label">Température:</text>
          <text x="640" y="485" textAnchor="end" className="value-med">{data.centrale.temp.toFixed(2)}°C</text>
          <text x="420" y="510" className="label">Retour Condensat - Sulfurique:</text>
          <text x="420" y="528" className="value-small">pH: {data.centrale.retourPH}</text>
          <text x="490" y="528" className="value-small">Cond: {data.centrale.retourCond}</text>
          <text x="570" y="528" className="value-small">Débit: {data.centrale.retourDebit}</text>

          {/* Centrale to Échange Électrique (Export) */}
          <path 
            d="M 680 370 H 900 V 140 H 1050" 
            className={data.echangeElec.energieExportee > 0 ? "pipe-elec-export" : "pipe"} 
            markerEnd={data.echangeElec.energieExportee > 0 ? "url(#arrowGreen)" : "url(#arrow)"} 
            strokeDasharray={data.echangeElec.energieExportee > 0 ? "0" : "5,5"}
          />
          <text x="780" y="130" className="value-small" fill={data.echangeElec.energieExportee > 0 ? "#10b981" : "#64748b"}>
            Export: {data.echangeElec.energieExportee.toFixed(2)} MW
          </text>

          {/* Centrale to Sulfurique */}
          <path d="M 680 420 H 1000" className="pipe-vapor" markerEnd="url(#arrowOrange)" />
          <text x="810" y="410" className="value-small">VHP/VBP</text>
          <circle cx="800" cy="420" r="5" className="sensor-dot" />

          {/* UNITE SULFURIQUE */}
          <rect x="1000" y="360" width="260" height="160" rx="10" className="unit-box" />
          <text x="1130" y="390" textAnchor="middle" className="unit-title">UNITE SULFURIQUE</text>
          <text x="1020" y="420" className="label">Charge:</text>
          <text x="1220" y="420" textAnchor="end" className="value-big">{data.sulfurique.charge}%</text>
          <text x="1020" y="445" className="label">Température:</text>
          <text x="1220" y="445" textAnchor="end" className="value-med">{data.sulfurique.temp}°C</text>
          <text x="1020" y="475" className="label">Export Vapeur:</text>
          <text x="1020" y="493" className="value-small">VHP: {data.sulfurique.vhpExport} T/h ({data.sulfurique.vhpTemp}°C)</text>
          <text x="1020" y="508" className="value-small">VBP: {data.sulfurique.vbpExport} T/h ({data.sulfurique.vbpTemp}°C)</text>

          {/* Retour condensat from Sulfurique */}
          <path d="M 1000 480 H 720 V 580 H 240" className="pipe" markerEnd="url(#arrow)" />
          <text x="700" y="570" className="value-small">Retour condensat</text>
          <circle cx="850" cy="480" r="5" className="sensor-dot" />

          {/* TRAITEMENT TED */}
          <rect x="80" y="550" width="280" height="140" rx="10" className="unit-box" />
          <text x="220" y="580" textAnchor="middle" className="unit-title">TRAITEMENT TED</text>
          <text x="100" y="610" className="label">Charge:</text>
          <text x="320" y="610" textAnchor="end" className="value-big">{data.ted.charge}%</text>
          <text x="100" y="635" className="label">Débit Entrée:</text>
          <text x="320" y="635" textAnchor="end" className="value-med">{data.ted.debitEntree.toFixed(0)} m³/h</text>
          <text x="100" y="658" className="label">Débit Sortie:</text>
          <text x="320" y="658" textAnchor="end" className="value-med">{data.ted.debitSortie.toFixed(0)} m³/h</text>
          <text x="100" y="678" className="value-small">Taux Recyclage: {data.ted.tauxRecyclage}%</text>

          {/* TED to top condensat line */}
          <path d="M 180 550 V 60" className="pipe" markerEnd="url(#arrow)" />
          <circle cx="180" cy="200" r="5" className="sensor-dot" />

          {/* Échange électrique (top right) */}
          <rect x="1050" y="80" width="280" height="180" rx="10" className="unit-box" />
          <text x="1190" y="110" textAnchor="middle" className="unit-title">ÉCHANGE ÉLECTRIQUE</text>
          
          <text x="1070" y="140" className="label">Énergie nécessaire:</text>
          <text x="1300" y="140" textAnchor="end" className="value-med">{data.echangeElec.energieNecessaire.toFixed(2)} MW</text>
          
          <text x="1070" y="165" className="label">Énergie produite:</text>
          <text x="1300" y="165" textAnchor="end" className="value-med">{data.echangeElec.energieProduite.toFixed(2)} MW</text>
          
          <text x="1070" y="190" className="label">Bilan net:</text>
          <text x="1300" y="190" textAnchor="end" className="value-big" fill={data.echangeElec.bilanNet > 0 ? "#10b981" : data.echangeElec.bilanNet < -1 ? "#fbbf24" : "#94a3b8"}>
            {data.echangeElec.bilanNet > 0 ? "+" : ""}{data.echangeElec.bilanNet.toFixed(2)} MW
          </text>
          
          <text x="1070" y="220" className="label">Statut:</text>
          <rect 
            x="1150" 
            y="207" 
            width="140" 
            height="20" 
            rx="4" 
            className={
              data.echangeElec.statut === "EXPORTATION" ? "status-export" : 
              data.echangeElec.statut === "IMPORTATION" ? "status-import" : 
              "status-balance"
            } 
          />
          <text x="1220" y="222" textAnchor="middle" className="value-small" fill="#ffffff" fontWeight="700">{data.echangeElec.statut}</text>
          
          <text x="1070" y="245" className="value-small" fill={data.echangeElec.bilanNet > 0 ? "#10b981" : "#64748b"}>
            Énergie utilisable: {data.echangeElec.bilanNet > 0 ? "OUI ✓" : "NON ✗"}
          </text>

          {/* Échange Électrique vers Centrale (import) */}
          <path 
            d="M 1190 260 V 340 H 680" 
            className={data.echangeElec.energieImportee > 0 ? "pipe-elec-import" : "pipe"} 
            markerEnd={data.echangeElec.energieImportee > 0 ? "url(#arrowYellow)" : "url(#arrow)"}
            strokeDasharray={data.echangeElec.energieImportee > 0 ? "0" : "5,5"}
          />
          <text x="880" y="330" className="value-small" fill={data.echangeElec.energieImportee > 0 ? "#fbbf24" : "#64748b"}>
            Import: {data.echangeElec.energieImportee.toFixed(2)} MW
          </text>
          <circle cx="1190" cy="260" r="5" className="sensor-dot" />

          {/* kWh counters */}
          <rect x="320" y="320" width="100" height="30" rx="6" className="counter-box" />
          <text x="370" y="340" textAnchor="middle" className="value-small">Compteur kWh</text>

          <rect x="920" y="540" width="100" height="30" rx="6" className="counter-box" />
          <text x="970" y="560" textAnchor="middle" className="value-small">Compteur kWh</text>

          {/* Legend */}
          <g transform="translate(80, 20)">
            <circle cx="0" cy="0" r="5" fill="#22d3ee" />
            <text x="12" y="4" className="value-small">Condensat</text>
            <circle cx="100" cy="0" r="5" fill="#fb923c" />
            <text x="112" y="4" className="value-small">Vapeur</text>
            <circle cx="180" cy="0" r="5" className="sensor-dot" />
            <text x="192" y="4" className="value-small">Capteur</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
