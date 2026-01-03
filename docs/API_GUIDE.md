# Guida Completa API - CodeWizard Intelligent Marketing

---

## 1. HACKER NEWS (Algolia) ✅ CONFERMATA
Accesso ai contenuti di Hacker News per pain points e trend tech.
- **Auth:** Nessuna
- **Endpoint:** `GET https://hn.algolia.com/api/v1/search?query=devops+pain&tags=story`
- **Rate:** 10,000/ora

---

## 2. TED EUROPA ✅ CONFERMATA
Bandi pubblici EU sopra €140k.
- **Auth:** Nessuna
- **Endpoint:** `POST https://api.ted.europa.eu/v3/notices/search`
- **Query:** `CY=ITA AND PC=72000000 AND PD>=20240101`
- **CPV IT:** 72000000, 48000000, 72200000
- **Rate:** 15,000 risultati max

---

## 3. ADZUNA ✅ CONFERMATA
Aggregatore job (Indeed, Monster, CareerBuilder).
- **Auth:** app_id + app_key
- **Endpoint:** `GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}`
- **Paesi:** it, gb, us, de, fr, au, br, ca, in, nl, pl, ru, za

---

## 4. APIFY ✅ CONFERMATA
Scraping LinkedIn, Indeed, Glassdoor, Google Trends.
- **Auth:** Bearer token
- **Actor:** misceres/indeed-scraper, bebity/linkedin-jobs-scraper
- **Rate:** Free tier $5/mese

---

## 5. STACK OVERFLOW ❌ JOBS CHIUSO (2022)
Solo Q&A API attiva: `GET https://api.stackexchange.com/2.3/search?intitle=kubernetes+error&site=stackoverflow`

---

## 6. ANAC OPEN DATA 📋 DA CONFIGURARE
Bandi PA italiani sotto soglia EU.
- **SPARQL:** https://dati.anticorruzione.it/sparql
- Complementare a TED (tutti i contratti PA)

---

## 7. GITHUB API ✅ CONFERMATA
Trend tech, repository popolari. **Token già attivo!**

### Query Syntax
| Filtro | Esempio |
|--------|---------|
| stars | `stars:>1000` |
| created | `created:>2024-01-01` |
| language | `language:python` |
| topic | `topic:devops` |
| org | `org:microsoft` |

### Esempi Testati
- `kubernetes stars:>1000 created:>2024-01-01` → 45 repo
- `topic:devops created:>2025-01-01 stars:>500` → 25 repo

### Risultati Kubernetes 2024+
- GoogleCloudPlatform/kubectl-ai - AI powered K8s Assistant
- freelensapp/freelens - Free IDE for Kubernetes
- microsoft/retina - eBPF networking observability
- Flux159/mcp-server-kubernetes - MCP Server for K8s

**Rate:** 5,000/ora

---

## 8. REDDIT API ⏳ IN ATTESA
Subreddit: r/devops, r/sysadmin, r/ItalyInformatica, r/kubernetes, r/aws

---

## 9. REMOTEOK API ✅ CONFERMATA
Job board lavori remoti.
- **Auth:** Nessuna (serve User-Agent)
- **Endpoint:** `GET https://remoteok.com/api`
- **⚠️ Jobs da indice 1** (primo elemento = metadata)

### PowerShell
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
$devopsJobs = $jobs[1..($jobs.Count)] | Where-Object { ($_.tags -join " ") -match "devops|cloud|kubernetes" }
```

---

## RIEPILOGO STATUS

| API | Status | Auth | Use Case |
|-----|--------|------|----------|
| Hacker News | ✅ | No | Pain points |
| TED Europa | ✅ | No | Bandi EU |
| Adzuna | ✅ | Sì | Job market IT |
| Apify | ✅ | Sì | Scraping |
| GitHub | ✅ | Token attivo | Trend tech |
| RemoteOK | ✅ | No | Remote jobs |
| ANAC | 📋 | No | Bandi PA IT |
| Reddit | ⏳ | Pending | Discussioni |
| Stack Overflow Jobs | ❌ | - | CHIUSO |

**6/9 API operative!**

*Ultimo aggiornamento: 03 Gennaio 2026*
