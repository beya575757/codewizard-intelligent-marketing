# Cronologia Progetto - CodeWizard Intelligent Marketing

## Obiettivo del Progetto

Creare un sistema di analisi del mercato IT in tempo reale per rispondere a:

1. **Cosa richiede il mercato IT?** - Competenze e prodotti
2. **Chi lo richiede?** - Tipologia di aziende
3. **Quali pain points sono ancora aperti?** - Problemi non risolti
4. **Dove sono le aziende?** - Distribuzione geografica
5. **Quali bandi PA sono disponibili?** - Opportunità pubbliche

---

## Timeline Attività

### 03 Gennaio 2026

#### Fase 1: Analisi Fonti Necessarie

**Problema identificato:** Le API già possedute (Apify + Adzuna) coprono solo ~40% delle esigenze.

**Gap identificati:**
- Pain points: nessuna copertura diretta
- Bandi PA italiani: nessuna copertura
- Profili aziende dettagliati: copertura parziale

**Fonti selezionate per categoria:**

| Categoria | Fonti Scelte |
|-----------|--------------|
| Pain Points | Hacker News, Reddit, Stack Overflow |
| Bandi EU | TED Europa |
| Bandi IT | ANAC Open Data |
| Job Market | Adzuna (già posseduta) |
| Scraping | Apify (già posseduta) |
| Tech Trends | GitHub API |

#### Fase 2: Test API Gratuite Istantanee

**1. Hacker News (Algolia)** ✅ CONFERMATA
- Zero signup, funziona subito

**2. Google Trends** ❌ SCARTATA
- Nessuna API ufficiale, workaround via Apify

**3. TED Europa** ✅ CONFERMATA
- Risolti problemi sintassi query

**4. Reddit API** ⏳ IN ATTESA APPROVAZIONE

#### Fase 3: Setup Infrastruttura

- MongoDB Docker avviato
- Repository GitHub creato
- Documentazione API su database

---

## Problemi Risolti

### TED Europa - Sintassi Corretta

**Soluzione:** Paese con codice ISO 3 lettere `CY=ITA`

### PowerShell vs Bash

**Soluzione:** Usare `Invoke-RestMethod` invece di `curl`

---

## Prossimi Passi

1. [ ] Stack Overflow API
2. [ ] ANAC Open Data  
3. [ ] GitHub API
4. [ ] Reddit API (attesa approvazione)

---

*Ultimo aggiornamento: 03 Gennaio 2026*
