# CodeWizard Intelligent Marketing

Sistema di analisi del mercato IT in tempo reale per identificare opportunità di business.

## 🎯 Obiettivo

Rispondere a 5 domande chiave:

1. **Cosa richiede il mercato IT?** - Competenze e prodotti più richiesti
2. **Chi lo richiede?** - Tipologia di aziende
3. **Quali pain points sono ancora aperti?** - Problemi non risolti
4. **Dove sono le aziende?** - Distribuzione geografica
5. **Quali bandi PA sono disponibili?** - Opportunità pubbliche

## 📊 API Sources - Status

### ✅ Confermate e Funzionanti

| API | Categoria | Auth | Costo | Note |
|-----|-----------|------|-------|------|
| **Hacker News (Algolia)** | Pain Points | ❌ No | Free | Zero signup |
| **TED Europa** | Bandi EU | ❌ No | Free | Bandi >€140k |
| **Adzuna** | Job Market | ✅ Sì | Free | Aggregatore job |
| **Apify** | Scraping | ✅ Sì | Free tier | Multi-platform |

### ⏳ In Attesa Approvazione

| API | Categoria | Tempo Attesa |
|-----|-----------|--------------|
| **Reddit** | Pain Points | 24-48h |

### 📋 Da Configurare

| API | Categoria | Auth | Note |
|-----|-----------|------|------|
| **ANAC Open Data** | Bandi IT | ❌ No | Bandi sotto soglia EU |
| **Stack Overflow** | Pain Points | ❌ No | 300 req/day free |
| **GitHub** | Tech Trends | ✅ Sì | Token già disponibile |

## 🚀 Quick Start

### 1. Avvia MongoDB

```bash
cd codewizard-intelligent-marketing
docker-compose up -d
```

### 2. Accedi al database

- **MongoDB**: `mongodb://codewizard:marketing2024@localhost:27017/intelligent_marketing`
- **Mongo Express UI**: http://localhost:8081 (admin/admin)

## 📖 Documentazione API

### Hacker News (Algolia)

**Zero signup. Funziona subito.**

```bash
curl "https://hn.algolia.com/api/v1/search?query=devops+pain+point&tags=story"
```

### TED Europa - Bandi Pubblici EU

**Zero API key. POST request.**

```powershell
$body = @{
    query = "CY=ITA AND TI=software AND PD>=20240101"
    fields = @("ND", "TI", "PD", "PC", "AA", "CY")
    limit = 20
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" `
    -Method POST -ContentType "application/json" -Body $body
```

**Query syntax:**
- `CY=ITA` - Paese Italia (ISO 3 lettere)
- `PC=[72000000]` - CPV servizi IT  
- `PD>=20240101` - Data pubblicazione dal 2024
- `TI=software` - Titolo contiene "software"

### Adzuna - Job Market

```bash
curl "https://api.adzuna.com/v1/api/jobs/it/search/1?app_id=YOUR_ID&app_key=YOUR_KEY&what=developer&where=brescia"
```

## 📁 Struttura Progetto

```
codewizard-intelligent-marketing/
├── docker-compose.yml      # MongoDB + Mongo Express
├── init-mongo.js           # Inizializzazione DB e API sources
├── README.md               # Questa guida
├── .gitignore
├── scripts/                # Script di raccolta dati
└── config/
    └── credentials.example.json
```

## 👤 Autore

**CodeWizard SRL** - Beya M'ganza

---

*Ultimo aggiornamento: Gennaio 2025*
