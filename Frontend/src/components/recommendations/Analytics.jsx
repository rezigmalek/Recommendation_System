import { useAppContext } from '../../context/AppContext';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecommendationNavbar from './RecommendationNavbar';
import logo from '../../assets/Djezzy_Logo_2015.svg';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function svgUrlToPngBase64(svgUrl, width = 320, height = 120) {
  return new Promise((resolve) => {
    const drawOnCanvas = (src) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    };

    if (svgUrl && svgUrl.startsWith('data:')) {
      drawOnCanvas(svgUrl);
      return;
    }

    fetch(svgUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
      })
      .catch(() => resolve(null));
  });
}

const localLabels = {
  fr: {
    title: "Analytics & Performance",
    subtitle: "Vue d'ensemble des recommandations et de la performance des abonnés",
    totalClients: "TOTAL CLIENTS",
    topOffer: "OFFRE TOP RECOMMANDÉE",
    conversionMoyenne: "CONVERSION MOYENNE ESTIMÉE",
    analyseTitle: "Analyse des Mouvements",
    batchLabel: "Évolution",
    clientProgression: "Progression des clients par type de mouvement",
    upsell: "UPSELL",
    stable: "STABLE",
    downsell: "DOWNSELL",
    upsellDesc: "Augmentation de la valeur contractuelle",
    stableDesc: "Maintien de l'offre actuelle sans changement",
    downsellDesc: "Migration vers une offre de gamme inférieure",
    usageTitle: "Usage Performance",
    avgData: "Consommation Data Moyenne",
    mobileData: "MOBILE DATA",
    avgVoice: "Consommation Voix Moyenne",
    voiceSms: "VOIX",
    arpu: "ARPU Moyen",
    revenueImpact: "REVENUE",
    targetMet: "OBJECTIF ATTEINT",
    vsLastBatch: "vs dernier batch",
    exportPdf: "Exporter Rapport PDF",
    exportingPdf: "Génération du rapport…",
    loading: "Chargement des données…",
    error: "Impossible de charger les données analytiques.",
    noData: "Aucune donnée disponible pour cette recommandation.",
  },
  en: {
    title: "Analytics & Performance",
    subtitle: "Overview of recommendations and subscriber performance",
    totalClients: "TOTAL CLIENTS",
    topOffer: "TOP RECOMMENDED OFFER",
    conversionMoyenne: "ESTIMATED AVERAGE CONVERSION",
    analyseTitle: "Movement Analysis",
    batchLabel: "Evolution",
    clientProgression: "Client progression by movement type",
    upsell: "UPSELL",
    stable: "STABLE",
    downsell: "DOWNSELL",
    upsellDesc: "Increase in contractual value",
    stableDesc: "Maintaining current offer without change",
    downsellDesc: "Migration to a lower tier offer",
    usageTitle: "Usage Performance",
    avgData: "Avg. Data Consumption",
    mobileData: "MOBILE DATA",
    avgVoice: "Avg. Voice Consumption",
    voiceSms: "VOICE",
    arpu: "Average ARPU",
    revenueImpact: "REVENUE",
    targetMet: "TARGET MET",
    vsLastBatch: "vs last batch",
    exportPdf: "Export PDF Report",
    exportingPdf: "Generating report…",
    loading: "Loading data…",
    error: "Unable to load analytics data.",
    noData: "No data available for this recommendation.",
  }
};

const PDF_COLORS = {
  red:        [230, 0,   0  ],
  darkRed:    [179, 0,   0  ],
  navy:       [30,  64,  175],
  teal:       [13,  148, 136],
  black:      [20,  20,  20 ],
  darkGray:   [60,  60,  60 ],
  tableHead:  [55,  65,  81 ],
  midGray:    [110, 110, 110],
  lightGray:  [200, 200, 200],
  veryLight:  [245, 245, 245],
  footerBg:   [240, 240, 240],
  footerText: [90,  90,  90 ],
  white:      [255, 255, 255],
  green:      [34,  197, 94 ],
  amber:      [245, 158, 11 ],
  blue:       [59,  130, 246],
};

async function generateProfessionalPDF(data, lang, logoSvgUrl) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  const isFr = lang === 'fr';

  const now = new Date();
  const dateStr = now.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const logoPng = await svgUrlToPngBase64(logoSvgUrl, 320, 120);

  const setFont = (style = 'normal', size = 10) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
  };
  const setColor = (rgb) => pdf.setTextColor(...rgb);
  const setFill  = (rgb) => pdf.setFillColor(...rgb);
  const setDraw  = (rgb) => pdf.setDrawColor(...rgb);

  const addFooter = (pageNum, totalPages) => {
    const y = H - 7;
    setFill(PDF_COLORS.footerBg);
    pdf.rect(0, H - 12, W, 12, 'F');
    setDraw(PDF_COLORS.lightGray);
    pdf.setLineWidth(0.3);
    pdf.line(0, H - 12, W, H - 12);
    setFont('normal', 7);
    setColor(PDF_COLORS.footerText);
    const leftText = isFr
      ? 'Confidentiel — Djezzy AI Recommendation Platform'
      : 'Confidential — Djezzy AI Recommendation Platform';
    pdf.text(leftText, MARGIN, y);
    pdf.text(`${dateStr} — ${timeStr}`, W / 2, y, { align: 'center' });
    setFont('bold', 7);
    setColor(PDF_COLORS.darkGray);
    pdf.text(`${pageNum} / ${totalPages}`, W - MARGIN, y, { align: 'right' });
  };

  const kpiBox = (x, y, w, h, label, value, sub, accentColor) => {
    setFill(PDF_COLORS.veryLight);
    setDraw(PDF_COLORS.lightGray);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, y, w, h, 2, 2, 'FD');
    setFill(accentColor);
    pdf.roundedRect(x, y, w, 1.2, 1, 1, 'F');
    setFont('bold', 7);
    setColor(PDF_COLORS.midGray);
    pdf.text(label, x + w / 2, y + 7, { align: 'center' });
    setFont('bold', 14);
    setColor(PDF_COLORS.black);
    pdf.text(String(value), x + w / 2, y + 16, { align: 'center', maxWidth: w - 4 });
    if (sub) {
      setFont('normal', 7);
      setColor(PDF_COLORS.midGray);
      pdf.text(sub, x + w / 2, y + 22, { align: 'center', maxWidth: w - 4 });
    }
  };

  // PAGE 1
  setFill(PDF_COLORS.tableHead);
  pdf.rect(0, 0, W, 42, 'F');

  setFont('bold', 18);
  setColor(PDF_COLORS.white);
  pdf.text('DJEZZY', MARGIN, 18);

  setFill(PDF_COLORS.darkRed);
  pdf.roundedRect(W - MARGIN - 46, 8, 46, 8, 2, 2, 'F');
  setFont('bold', 7);
  setColor(PDF_COLORS.white);
  const badgeText = isFr ? 'RAPPORT ANALYTIQUE' : 'ANALYTICS REPORT';
  pdf.text(badgeText, W - MARGIN - 23, 13.2, { align: 'center' });

  setFont('bold', 16);
  setColor(PDF_COLORS.white);
  pdf.text('Analytics & Performance', MARGIN, 27);
  setFont('normal', 8.5);
  setColor([255, 200, 200]);
  pdf.text(
    isFr
      ? "Vue d'ensemble des recommandations et de la performance des abonnés"
      : 'Overview of recommendations and subscriber performance',
    MARGIN, 34
  );

  setFill(PDF_COLORS.veryLight);
  pdf.rect(0, 42, W, 13, 'F');
  setFont('normal', 8);
  setColor(PDF_COLORS.darkGray);
  pdf.text(`Batch #${data.id_recommandation}`, MARGIN, 51);
  pdf.text(`${isFr ? 'Généré le' : 'Generated on'}: ${dateStr} à ${timeStr}`, W / 2, 51, { align: 'center' });
  pdf.text(`ID: ${data.id}`, W - MARGIN, 51, { align: 'right' });
  setFill(PDF_COLORS.lightGray);
  pdf.rect(0, 55, W, 0.6, 'F');

  let curY = 63;

  // SECTION 1
  setFont('bold', 12);
  setColor(PDF_COLORS.teal);
  pdf.text(isFr ? '1.  Résumé Exécutif' : '1.  Executive Summary', MARGIN, curY);
  curY += 2;
  setFill(PDF_COLORS.teal);
  pdf.rect(MARGIN, curY, 22, 0.5, 'F');
  curY += 5;

  const boxW = (CONTENT_W - 8) / 3;
  const boxH = 26;
  kpiBox(MARGIN,                curY, boxW, boxH, isFr ? 'TOTAL CLIENTS' : 'TOTAL CLIENTS', data.total_clients.toLocaleString('fr-FR'), '', PDF_COLORS.blue);
  kpiBox(MARGIN + boxW + 4,     curY, boxW, boxH, isFr ? 'OFFRE TOP RECOMMANDÉE' : 'TOP RECOMMENDED OFFER', data.top_offer_recommended_name, `ID: ${data.top_offer_recommended_id}`, PDF_COLORS.darkRed);
  kpiBox(MARGIN + (boxW + 4)*2, curY, boxW, boxH, isFr ? 'TAUX DE CONVERSION ESTIMÉ' : 'ESTIMATED CONVERSION RATE', `${data.conversion_moyenne.toFixed(1)}%`, `Score moy: ${(data.conversion_delta * 100).toFixed(1)}%`, PDF_COLORS.green);
  curY += boxH + 10;

  // SECTION 2
  setFont('bold', 12);
  setColor(PDF_COLORS.teal);
  pdf.text(isFr ? '2.  Analyse des Mouvements' : '2.  Movement Analysis', MARGIN, curY);
  curY += 2;
  setFill(PDF_COLORS.teal);
  pdf.rect(MARGIN, curY, 30, 0.5, 'F');
  curY += 6;

  setFont('normal', 8.5);
  setColor(PDF_COLORS.darkGray);
  pdf.text(
    isFr
      ? `Ce batch couvre ${data.total_clients.toLocaleString('fr-FR')} abonnés répartis en trois catégories de mouvement.`
      : `This batch covers ${data.total_clients.toLocaleString('fr-FR')} subscribers distributed across three movement categories.`,
    MARGIN, curY
  );
  curY += 7;

  // ── Stacked bar PDF — FIX : ne dessiner que si > 0 ──
  const barH = 9;
  const barW = CONTENT_W;
  const upW  = barW * (data.upsell_pourcentage / 100);
  const stW  = barW * (data.stable_pourcentage / 100);
  const dnW  = barW * (data.downsell_pourcentage / 100);

  if (upW > 0) {
    setFill(PDF_COLORS.green);
    pdf.roundedRect(MARGIN, curY, upW, barH, 1.5, 1.5, 'F');
  }
  if (stW > 0) {
    setFill([148, 163, 184]);
    pdf.rect(MARGIN + upW, curY, stW, barH, 'F');
  }
  if (dnW > 0) {
    setFill(PDF_COLORS.darkRed);
    pdf.roundedRect(MARGIN + upW + stW, curY, dnW, barH, 1.5, 1.5, 'F');
  }

  setFont('bold', 7);
  setColor(PDF_COLORS.white);
  if (upW > 12) pdf.text(`${data.upsell_pourcentage.toFixed(1)}%`,   MARGIN + upW / 2,               curY + 5.8, { align: 'center' });
  if (stW > 12) pdf.text(`${data.stable_pourcentage.toFixed(1)}%`,   MARGIN + upW + stW / 2,         curY + 5.8, { align: 'center' });
  if (dnW > 12) pdf.text(`${data.downsell_pourcentage.toFixed(1)}%`, MARGIN + upW + stW + dnW / 2,   curY + 5.8, { align: 'center' });
  curY += barH + 4;

  // ── Legend PDF — FIX : ne montrer que si > 0 ──
  const legendItems = [
    { color: PDF_COLORS.green,   label: 'Upsell',   pct: data.upsell_pourcentage },
    { color: [148, 163, 184],    label: 'Stable',   pct: data.stable_pourcentage },
    { color: PDF_COLORS.darkRed, label: 'Downsell', pct: data.downsell_pourcentage },
  ].filter(item => item.pct > 0);

  const legW = CONTENT_W / legendItems.length;
  legendItems.forEach((item, i) => {
    const lx = MARGIN + i * legW;
    setFill(item.color);
    pdf.roundedRect(lx, curY, 3, 3, 0.5, 0.5, 'F');
    setFont('normal', 8);
    setColor(PDF_COLORS.darkGray);
    pdf.text(`${item.label}`, lx + 5, curY + 2.5);
    setFont('bold', 8);
    setColor(PDF_COLORS.black);
    pdf.text(`${item.pct.toFixed(2)}%`, lx + 5 + pdf.getTextWidth(`${item.label}  `), curY + 2.5);
  });
  curY += 9;

  // ── Movement table PDF — FIX : ne montrer que les lignes > 0 ──
  const movementRows = [
    [
      { content: 'UPSELL',   styles: { textColor: [22, 163, 74],  fontStyle: 'bold' } },
      `${data.upsell_pourcentage.toFixed(2)}%`,
      Math.round(data.total_clients * data.upsell_pourcentage / 100).toLocaleString('fr-FR'),
      isFr ? 'Augmentation de la valeur contractuelle' : 'Increase in contractual value',
    ],
    [
      { content: 'STABLE',   styles: { textColor: [100, 116, 139], fontStyle: 'bold' } },
      `${data.stable_pourcentage.toFixed(2)}%`,
      Math.round(data.total_clients * data.stable_pourcentage / 100).toLocaleString('fr-FR'),
      isFr ? "Maintien de l'offre actuelle" : 'Maintaining current offer',
    ],
    [
      { content: 'DOWNSELL', styles: { textColor: [220, 38, 38],  fontStyle: 'bold' } },
      `${data.downsell_pourcentage.toFixed(2)}%`,
      Math.round(data.total_clients * data.downsell_pourcentage / 100).toLocaleString('fr-FR'),
      isFr ? 'Migration vers une offre inférieure' : 'Migration to a lower tier offer',
    ],
  ].filter((_, idx) => {
    const pcts = [data.upsell_pourcentage, data.stable_pourcentage, data.downsell_pourcentage];
    return pcts[idx] > 0;
  });

  movementRows.push([
    { content: isFr ? 'TOTAL' : 'TOTAL', styles: { fontStyle: 'bold' } },
    { content: '100.00%', styles: { fontStyle: 'bold' } },
    { content: data.total_clients.toLocaleString('fr-FR'), styles: { fontStyle: 'bold' } },
    '',
  ]);

  pdf.autoTable({
    startY: curY,
    margin: { left: MARGIN, right: MARGIN },
    head: [[
      isFr ? 'Type de Mouvement' : 'Movement Type',
      isFr ? 'Pourcentage' : 'Percentage',
      isFr ? 'Clients Estimés' : 'Estimated Clients',
      isFr ? 'Description' : 'Description',
    ]],
    body: movementRows,
    styles: { fontSize: 8.5, cellPadding: 3, lineColor: PDF_COLORS.lightGray, lineWidth: 0.2 },
    headStyles: { fillColor: PDF_COLORS.tableHead, textColor: PDF_COLORS.white, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: PDF_COLORS.veryLight },
    rowPageBreak: 'avoid',
  });
  curY = pdf.lastAutoTable.finalY + 10;

  // SECTION 3
  if (curY > H - 90) { addFooter(1, 2); pdf.addPage(); curY = 20; }

  setFont('bold', 12);
  setColor(PDF_COLORS.teal);
  pdf.text(isFr ? "3.  Performance d'Usage" : '3.  Usage Performance', MARGIN, curY);
  curY += 2;
  setFill(PDF_COLORS.teal);
  pdf.rect(MARGIN, curY, 28, 0.5, 'F');
  curY += 6;

  pdf.autoTable({
    startY: curY,
    margin: { left: MARGIN, right: MARGIN },
    head: [[isFr ? 'Métrique' : 'Metric', isFr ? 'Catégorie' : 'Category', isFr ? 'Valeur Mesurée' : 'Measured Value']],
    body: [
      [isFr ? 'Consommation Data Moyenne' : 'Avg. Data Consumption', 'MOBILE DATA', `${data.data_avg_gb} GB`],
      [isFr ? 'Consommation Voix Moyenne' : 'Avg. Voice Consumption', isFr ? 'VOIX' : 'VOICE', `${data.voice_avg_min} min`],
      [isFr ? 'ARPU Moyen' : 'Average ARPU', 'REVENUE', `${data.arpu_shift.toFixed(2)} DZD`],
    ],
    styles: { fontSize: 8.5, cellPadding: 3, lineColor: PDF_COLORS.lightGray, lineWidth: 0.2 },
    headStyles: { fillColor: PDF_COLORS.tableHead, textColor: PDF_COLORS.white, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: PDF_COLORS.veryLight },
  });
  curY = pdf.lastAutoTable.finalY + 10;

  // SECTION 4
  if (curY > H - 60) { addFooter(1, 2); pdf.addPage(); curY = 20; }

  setFont('bold', 12);
  setColor(PDF_COLORS.teal);
  pdf.text(isFr ? '4.  Score & Conversion' : '4.  Score & Conversion', MARGIN, curY);
  curY += 2;
  setFill(PDF_COLORS.teal);
  pdf.rect(MARGIN, curY, 28, 0.5, 'F');
  curY += 6;

  pdf.autoTable({
    startY: curY,
    margin: { left: MARGIN, right: MARGIN },
    head: [[isFr ? 'Indicateur' : 'Indicator', isFr ? 'Valeur' : 'Value', isFr ? 'Interprétation' : 'Interpretation']],
    body: [
      [
        isFr ? 'Score de Recommandation Moyen' : 'Average Recommendation Score',
        `${(data.conversion_delta * 100).toFixed(1)}%`,
        isFr ? "Score agrégé sur l'ensemble des recommandations du batch" : 'Aggregated score across all recommendations in the batch',
      ],
      [
        isFr ? 'Taux de Conversion Estimé' : 'Estimated Conversion Rate',
        `${data.conversion_moyenne.toFixed(2)}%`,
        isFr ? "Proportion estimée de clients susceptibles d'adopter l'offre recommandée" : 'Estimated proportion of clients likely to adopt the recommended offer',
      ],
      [
        isFr ? 'Offre la plus Recommandée' : 'Most Recommended Offer',
        data.top_offer_recommended_name,
        isFr ? `Offre dominante dans ce batch (réf. ${data.top_offer_recommended_id})` : `Dominant offer in this batch (ref. ${data.top_offer_recommended_id})`,
      ],
    ],
    styles: { fontSize: 8.5, cellPadding: 3, lineColor: PDF_COLORS.lightGray, lineWidth: 0.2 },
    headStyles: { fillColor: PDF_COLORS.tableHead, textColor: PDF_COLORS.white, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: PDF_COLORS.veryLight },
    columnStyles: { 2: { cellWidth: 85 } },
  });
  curY = pdf.lastAutoTable.finalY + 12;

  // Closing note
  if (curY > H - 36) { addFooter(1, 2); pdf.addPage(); curY = 20; }

  setFill(PDF_COLORS.veryLight);
  setDraw(PDF_COLORS.lightGray);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(MARGIN, curY, CONTENT_W, 20, 2, 2, 'FD');
  setFill(PDF_COLORS.darkRed);
  pdf.roundedRect(MARGIN, curY, 2, 20, 1, 1, 'F');
  setFont('bold', 8);
  setColor(PDF_COLORS.darkGray);
  pdf.text(isFr ? 'Note de confidentialité' : 'Confidentiality notice', MARGIN + 6, curY + 7);
  setFont('normal', 7.5);
  setColor(PDF_COLORS.midGray);
  const noteText = isFr
    ? 'Ce document est généré automatiquement par la plateforme Djezzy AI Recommendation. Il est destiné exclusivement à usage interne.'
    : 'This document is automatically generated by the Djezzy AI Recommendation Platform. It is intended exclusively for internal use.';
  pdf.text(pdf.splitTextToSize(noteText, CONTENT_W - 10), MARGIN + 6, curY + 13);

  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    addFooter(p, totalPages);
  }

  pdf.save(`djezzy-rapport-analytique-batch-${data.id_recommandation}.pdf`);
}

export default function Analytics({ analyticsData, batchRef }) {
  const { lang } = useAppContext();
  const t = (key) => localLabels[lang]?.[key] || key;
  const { id } = useParams();

  const [apiData,   setApiData]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/recommendation/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        const raw = result.data[0];
        setApiData({
          id:                         raw.id,
          id_recommandation:          raw.recommendationReference,
          total_clients:              raw.totalClients,
          top_offer_recommended_id:   raw.topOfferRecommendedReference,
          top_offer_recommended_name: raw.topOfferRecommendedName,
          upsell_pourcentage:         raw.upsellPercentage,
          downsell_pourcentage:       raw.downsellPercentage,
          stable_pourcentage:         raw.stablePercentage,
          conversion_moyenne:         raw.EstimatedConversionRate,
          conversion_delta:           parseFloat(raw.AverageRecommendationScore.toFixed(2)),
          data_avg_gb:                parseFloat(raw.averageData.toFixed(2)),
          data_delta:                 0,
          voice_avg_min:              parseFloat(raw.averageVoice.toFixed(2)),
          voice_stable:               true,
          arpu_shift:                 raw.averageArpu,
          arpu_target_met:            true,
        });
      } else {
        setApiData(null);
      }
    } catch (err) {
      console.error('Erreur analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [id]);

  const handleExportPdf = async () => {
    if (!data || exporting) return;
    setExporting(true);
    try {
      await generateProfessionalPDF(data, lang, logo);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  const data = apiData || analyticsData || null;
  const batchNumber = batchRef || data?.id_recommandation;

  const renderBody = () => {
    if (loading) {
      return (
        <div className="an-state-box">
          <div className="an-spinner" />
          <p className="an-state-msg">{t('loading')}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="an-state-box error">
          <span className="an-state-icon">⚠️</span>
          <p className="an-state-msg">{t('error')}</p>
          <p className="an-state-detail">{error}</p>
          <button className="an-retry-btn" onClick={fetchAnalytics}>↺ Réessayer</button>
        </div>
      );
    }
    if (!data) {
      return (
        <div className="an-state-box">
          <span className="an-state-icon">📭</span>
          <p className="an-state-msg">{t('noData')}</p>
        </div>
      );
    }

    // ── FIX : construire uniquement les pills dont la valeur est > 0 ──
    const movementPills = [
      {
        key: 'up',
        show: data.upsell_pourcentage > 0,
        dotClass: 'green',
        pct: data.upsell_pourcentage,
        label: t('upsell'),
        desc: t('upsellDesc'),
        pillClass: 'up',
      },
      {
        key: 'st',
        show: data.stable_pourcentage > 0,
        dotClass: 'gray',
        pct: data.stable_pourcentage,
        label: t('stable'),
        desc: t('stableDesc'),
        pillClass: 'st',
      },
      {
        key: 'dn',
        show: data.downsell_pourcentage > 0,
        dotClass: 'red',
        pct: data.downsell_pourcentage,
        label: t('downsell'),
        desc: t('downsellDesc'),
        pillClass: 'dn',
      },
    ].filter(p => p.show);

    return (
      <div className="an-wrapper">
        {/* KPIs */}
        <div className="an-kpi-row">
          <div className="an-kpi-card">
            <div className="an-kpi-top"><div className="an-kpi-icon blue">👥</div></div>
            <div className="an-kpi-value">{data.total_clients.toLocaleString('fr-FR')}</div>
            <div className="an-kpi-label">{t('totalClients')}</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-top"><div className="an-kpi-icon red">⭐</div></div>
            <div className="an-kpi-value offer-name">{data.top_offer_recommended_name}</div>
            <div className="an-kpi-label">{t('topOffer')}</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-top">
              <div className="an-kpi-icon green">📈</div>
              <span className="an-badge green">{(data.conversion_delta * 100).toFixed(1)}%</span>
            </div>
            <div className="an-kpi-value">{data.conversion_moyenne.toFixed(1)}%</div>
            <div className="an-kpi-label">{t('conversionMoyenne')}</div>
          </div>
        </div>

        {/* Movement + Usage */}
        <div className="an-bottom-row">
          <div className="an-movement-card">
            <div>
              <div className="an-movement-head">
                <span className="an-movement-title">{t('analyseTitle')}</span>
                <span className="an-batch-badge">Batch #{batchNumber} {t('batchLabel')}</span>
              </div>
              <p className="an-movement-sub">{t('clientProgression')}</p>
            </div>

            {/* ── Stacked bar React — FIX : ne render que si > 0 ── */}
            <div className="an-seg-bar">
              {data.upsell_pourcentage   > 0 && <div className="an-seg-up" style={{ width: `${data.upsell_pourcentage}%`   }}>{t('upsell')}</div>}
              {data.stable_pourcentage   > 0 && <div className="an-seg-st" style={{ width: `${data.stable_pourcentage}%`   }}>{t('stable')}</div>}
              {data.downsell_pourcentage > 0 && <div className="an-seg-dn" style={{ width: `${data.downsell_pourcentage}%` }}>{t('downsell')}</div>}
            </div>

            {/* ── Pills React — FIX : ne render que si > 0 ── */}
            <div className="an-pills-grid">
              {movementPills.map(p => (
                <div key={p.key} className={`an-pill ${p.pillClass}`}>
                  <div className="an-pill-dot-row">
                    <span className={`an-pill-dot ${p.dotClass}`} />
                    <span className="an-pill-pct">{p.pct.toFixed(2)}%</span>
                  </div>
                  <div className="an-pill-lbl">{p.label}</div>
                  <div className="an-pill-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="an-usage-card">
            <div className="an-usage-head">{t('usageTitle')}</div>
            <div className="an-usage-row">
              <div className="an-usage-icon data">🗄️</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('avgData')}</span>
                <span className="an-usage-sub">{t('mobileData')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val data">{(data.data_avg_gb / 1024).toFixed(2)} GB</span>
                {data.data_delta !== 0
                  ? <span className="an-delta pos">+{data.data_delta}% {t('vsLastBatch')}</span>
                  : <span className="an-delta neutral">Stable</span>
                }
              </div>
            </div>
            <div className="an-usage-row">
              <div className="an-usage-icon voice">📞</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('avgVoice')}</span>
                <span className="an-usage-sub">{t('voiceSms')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val voice">{data.voice_avg_min} min</span>
                <span className="an-delta neutral">Stable</span>
              </div>
            </div>
            <div className="an-usage-row">
              <div className="an-usage-icon arpu">💰</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('arpu')}</span>
                <span className="an-usage-sub">{t('revenueImpact')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val arpu">{data.arpu_shift.toFixed(2)} DZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const styles = `
    .an-state-box {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 10px; min-height: 260px; padding: 40px 20px;
    }
    .an-state-box.error { color: var(--color-danger, #e53935); }
    .an-state-icon { font-size: 36px; }
    .an-state-msg  { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0; }
    .an-state-detail { font-size: 12px; color: var(--text-secondary); margin: 0; }
    .an-retry-btn {
      margin-top: 8px; padding: 7px 18px; border-radius: 8px;
      border: 1.5px solid var(--color-danger, #e53935); background: transparent;
      color: var(--color-danger, #e53935); font-size: 13px; font-weight: 600;
      cursor: pointer; transition: background .18s, color .18s;
    }
    .an-retry-btn:hover { background: var(--color-danger,#e53935); color:#fff; }
    .an-spinner {
      width: 38px; height: 38px;
      border: 3.5px solid var(--border-color, #e0e0e0);
      border-top-color: var(--color-primary, #e60000);
      border-radius: 50%; animation: an-spin .7s linear infinite;
    }
    @keyframes an-spin { to { transform: rotate(360deg); } }
    .an-title-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; margin-bottom: 8px; flex-wrap: wrap;
    }
    .an-title-left { display: flex; align-items: center; gap: 12px; }
    .an-pdf-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 9px 20px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e60000 0%, #b30000 100%);
      color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .3px;
      cursor: pointer; box-shadow: 0 2px 10px rgba(230,0,0,.25);
      transition: opacity .18s, transform .14s, box-shadow .18s;
      user-select: none; white-space: nowrap;
    }
    .an-pdf-btn:hover:not(:disabled) {
      opacity: .88; transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(230,0,0,.38);
    }
    .an-pdf-btn:active:not(:disabled) { transform: translateY(0); }
    .an-pdf-btn:disabled { opacity: .6; cursor: not-allowed; }
    .an-pdf-btn-badge {
      display: inline-flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,.22); border-radius: 5px;
      padding: 1px 5px; font-size: 9px; font-weight: 800; letter-spacing: .5px;
    }
    .an-pdf-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%;
      animation: an-spin .65s linear infinite;
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <RecommendationNavbar />

      <div className="an-title-row">
        <div className="an-title-left">
          <span className="wizard-icon"></span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{t('title')}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{t('subtitle')}</p>
          </div>
        </div>

        {!loading && !error && data && (
          <button className="an-pdf-btn" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? (
              <>
                <span className="an-pdf-spinner" />
                {t('exportingPdf')}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                {t('exportPdf')}
                <span className="an-pdf-btn-badge">PDF</span>
              </>
            )}
          </button>
        )}
      </div>

      {renderBody()}
    </div>
  );
}