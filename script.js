{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // script.js\
// Prototaip Kalkulator Indeks Kesibukan Staf Fakulti\
\
let sbiChart = null;\
\
document.addEventListener("DOMContentLoaded", () => \{\
  const form = document.getElementById("sbi-form");\
  const resultCard = document.getElementById("result-card");\
  const indexValueSpan = document.getElementById("index-value-number");\
  const indexInterpretation = document.getElementById("index-interpretation");\
  const zoneBadge = document.getElementById("zone-badge");\
\
  const scoreTSpan = document.getElementById("score-T");\
  const scoreRSpan = document.getElementById("score-R");\
  const scoreASpan = document.getElementById("score-A");\
\
  form.addEventListener("submit", (event) => \{\
    event.preventDefault();\
\
    // --- 1. Baca input ---\
    const coursesUG = toNumber("coursesUG");\
    const coursesPG = toNumber("coursesPG");\
    const mastersSup = toNumber("mastersSup");\
    const phdSup = toNumber("phdSup");\
\
    const grantsPI = toNumber("grantsPI");\
    const grantsCo = toNumber("grantsCo");\
    const papers = toNumber("papers");\
\
    const majorAdmin = toNumber("majorAdmin");\
    const minorAdmin = toNumber("minorAdmin");\
    const otherDuties = toNumber("otherDuties");\
\
    // --- 2. Kira skor mengikut rubrik prototaip ---\
\
    // 2.1 Pengajaran & Penyeliaan (T) \'96 maksimum 100\
    //   1 kursus UG = 10 mata\
    //   1 kursus PG = 15 mata\
    //   1 pelajar Master = 5 mata\
    //   1 pelajar PhD = 8 mata\
    let scoreT =\
      coursesUG * 10 +\
      coursesPG * 15 +\
      mastersSup * 5 +\
      phdSup * 8;\
    scoreT = clamp(scoreT, 0, 100);\
\
    // 2.2 Penyelidikan & Geran (R) \'96 maksimum 100\
    //   1 geran PI = 20 mata\
    //   1 geran Co = 10 mata\
    //   1 artikel jurnal = 5 mata\
    let scoreR =\
      grantsPI * 20 +\
      grantsCo * 10 +\
      papers * 5;\
    scoreR = clamp(scoreR, 0, 100);\
\
    // 2.3 Pentadbiran & Jawatan (A) \'96 maksimum 100\
    //   1 jawatan utama = 40 mata\
    //   1 jawatan / ahli JK = 10 mata\
    //   1 tugas khas lain = 8 mata\
    let scoreA =\
      majorAdmin * 40 +\
      minorAdmin * 10 +\
      otherDuties * 8;\
    scoreA = clamp(scoreA, 0, 100);\
\
    // --- 3. Pemberat dan Indeks Keseluruhan ---\
    // Boleh ubah ikut keputusan fakulti:\
    //   T = 40%, R = 30%, A = 30%\
    const weightT = 0.4;\
    const weightR = 0.3;\
    const weightA = 0.3;\
\
    let indexValue = weightT * scoreT + weightR * scoreR + weightA * scoreA;\
    indexValue = Math.round(indexValue * 10) / 10; // satu titik perpuluhan\
\
    // --- 4. Tentukan zon -->\
    const \{ zone, label, explanation, badgeClass \} = classifyIndex(indexValue);\
\
    // --- 5. Papar keputusan di UI ---\
    indexValueSpan.textContent = indexValue.toFixed(1);\
    indexInterpretation.textContent = explanation;\
\
    zoneBadge.textContent = `Zon $\{label\}`;\
    zoneBadge.className = "badge " + badgeClass;\
\
    scoreTSpan.textContent = scoreT.toFixed(0);\
    scoreRSpan.textContent = scoreR.toFixed(0);\
    scoreASpan.textContent = scoreA.toFixed(0);\
\
    resultCard.classList.remove("hidden");\
\
    // --- 6. Graf menggunakan Chart.js ---\
    drawChart(scoreT, scoreR, scoreA, indexValue);\
  \});\
\
  // Reset: sembunyikan semula kad keputusan\
  form.addEventListener("reset", () => \{\
    setTimeout(() => \{\
      resultCard.classList.add("hidden");\
      if (sbiChart) \{\
        sbiChart.destroy();\
        sbiChart = null;\
      \}\
    \}, 0);\
  \});\
\});\
\
// Fungsi bantu: tukar input kepada nombor\
function toNumber(id) \{\
  const el = document.getElementById(id);\
  if (!el) return 0;\
  const value = parseFloat(el.value);\
  return isNaN(value) ? 0 : value;\
\}\
\
function clamp(x, min, max) \{\
  return Math.max(min, Math.min(max, x));\
\}\
\
// Klasifikasi indeks kepada zon\
function classifyIndex(indexValue) \{\
  if (indexValue < 40) \{\
    return \{\
      zone: "low",\
      label: "Kurang Beban",\
      explanation:\
        "Indeks menunjukkan staf berada dalam zon beban kerja yang rendah. Boleh dipertimbangkan untuk menerima lebih banyak tugas rasmi jika sesuai.",\
      badgeClass: "low",\
    \};\
  \} else if (indexValue < 70) \{\
    return \{\
      zone: "normal",\
      label: "Normal / Seimbang",\
      explanation:\
        "Indeks dalam julat normal. Beban kerja dan kesibukan staf dianggap seimbang.",\
      badgeClass: "normal",\
    \};\
  \} else if (indexValue < 90) \{\
    return \{\
      zone: "high",\
      label: "Tinggi",\
      explanation:\
        "Indeks menunjukkan kesibukan yang tinggi. Perlu berhati-hati apabila menambah tugas baharu.",\
      badgeClass: "high",\
    \};\
  \} else \{\
    return \{\
      zone: "overload",\
      label: "Overload",\
      explanation:\
        "Indeks sangat tinggi. Staf berisiko overload. Pertimbangkan pengagihan semula tugas atau sokongan tambahan.",\
      badgeClass: "overload",\
    \};\
  \}\
\}\
\
// Lukis graf bar\
function drawChart(scoreT, scoreR, scoreA, indexValue) \{\
  const ctx = document.getElementById("sbiChart").getContext("2d");\
\
  // Jika graf lama wujud, hancurkan dulu\
  if (sbiChart) \{\
    sbiChart.destroy();\
  \}\
\
  sbiChart = new Chart(ctx, \{\
    type: "bar",\
    data: \{\
      labels: [\
        "Pengajaran & Penyeliaan (T)",\
        "Penyelidikan & Geran (R)",\
        "Pentadbiran & Jawatan (A)",\
        "Indeks Kesibukan (SBI)",\
      ],\
      datasets: [\
        \{\
          label: "Skor",\
          data: [scoreT, scoreR, scoreA, indexValue],\
        \},\
      ],\
    \},\
    options: \{\
      responsive: true,\
      plugins: \{\
        legend: \{\
          display: false,\
        \},\
        tooltip: \{\
          callbacks: \{\
            label: function (context) \{\
              return "Skor: " + context.parsed.y.toFixed(1);\
            \},\
          \},\
        \},\
      \},\
      scales: \{\
        y: \{\
          beginAtZero: true,\
          max: 100,\
          ticks: \{\
            stepSize: 20,\
          \},\
          title: \{\
            display: true,\
            text: "Skor (0\'96100)",\
          \},\
        \},\
      \},\
    \},\
  \});\
\}\
}