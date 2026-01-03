# Guida Completa API - CodeWizard Intelligent Marketing

---

## 1. HACKER NEWS (Algolia) ✅ CONFERMATA

### Descrizione
Accesso ai contenuti di Hacker News per identificare pain points, trend e discussioni tech.

### Autenticazione
**Nessuna** - API completamente pubblica

### Base URL
```
https://hn.algolia.com/api/v1
```

### Endpoint

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| /search | GET | Ricerca per rilevanza |
| /search_by_date | GET | Ricerca per data (più recenti prima) |

### Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| query | string | Termini di ricerca |
| tags | string | story, comment, poll, ask_hn, show_hn |
| numericFilters | string | created_at_i, points, num_comments |
| hitsPerPage | number | Risultati per pagina (default 20, max 1000) |
| page | number | Numero pagina (0-indexed) |

### Esempi Pratici

**Pain points DevOps:**
```
https://hn.algolia.com/api/v1/search?query=devops+pain+point&tags=story
```

**Problemi Kubernetes recenti:**
```
https://hn.algolia.com/api/v1/search_by_date?query=kubernetes+problem&tags=story
```

**Discussioni con molti commenti:**
```
https://hn.algolia.com/api/v1/search?query=frustrating&tags=story&numericFilters=num_comments>100
```

### PowerShell
```powershell
$response = Invoke-RestMethod -Uri "https://hn.algolia.com/api/v1/search?query=devops+pain&tags=story"
$response.hits | Select-Object title, points, num_comments, url
```

### Rate Limits
- 10,000 richieste/ora
- Nessuna chiave richiesta

---

## 2. TED EUROPA ✅ CONFERMATA

### Descrizione
Bandi pubblici europei sopra soglia €140k. Database ufficiale EU.

### Autenticazione
**Nessuna** per Search API (solo lettura)

### Endpoint
```
POST https://api.ted.europa.eu/v3/notices/search
Content-Type: application/json
```

### Struttura Base Request
```powershell
$body = @{
    query = "CAMPO=VALORE"
    fields = @("CAMPO1", "CAMPO2")
    limit = 50
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Campi Principali

| Campo | Descrizione | Esempio |
|-------|-------------|---------|
| CY | Paese (ISO 3 lettere) | `CY=ITA` (Italia), `CY=ESP` (Spagna) |
| PD | Data pubblicazione | `PD>=20240101` (dal 2024) |
| TI | Titolo | `TI=software` |
| PC | Codice CPV | `PC=72000000` (IT services) |
| ND | Notice ID | `ND=*` (tutti) |
| AA | Tipo autorità | Ente appaltante |
| TD | Tipo documento | Tipo bando |

### Codici CPV per IT

| CPV | Descrizione |
|-----|-------------|
| 72000000 | Servizi IT e affini |
| 48000000 | Software e sistemi informatici |
| 72200000 | Consulenza software e programmazione |
| 72300000 | Servizi elaborazione dati |
| 72400000 | Servizi Internet |
| 72500000 | Servizi informatici |
| 72600000 | Assistenza e supporto informatico |

### Operatori Query

| Operatore | Descrizione | Esempio |
|-----------|-------------|---------|
| AND | Entrambe condizioni | `CY=ITA AND TI=software` |
| OR | Una delle due | `TI=cloud OR TI=kubernetes` |
| = | Uguale | `CY=ITA` |
| >= | Maggiore o uguale | `PD>=20240101` |
| () | Raggruppamento | `(PC=72000000 OR PC=48000000)` |

### Esempi Pratici

**1. Bandi Italia 2024:**
```powershell
$body = @{
    query = "CY=ITA AND PD>=20240101"
    fields = @("ND", "TI", "PD")
    limit = 20
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**2. Bandi IT Services Italia:**
```powershell
$body = @{
    query = "CY=ITA AND PC=72000000"
    fields = @("ND", "TI", "PD", "PC", "CY")
    limit = 50
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**3. Bandi software ultimi 30 giorni:**
```powershell
$data = (Get-Date).AddDays(-30).ToString("yyyyMMdd")
$body = @{
    query = "CY=ITA AND TI=software AND PD>=$data"
    fields = @("ND", "TI", "PD", "PC")
    limit = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**4. Combinazione complessa (IT + Software):**
```powershell
$body = @{
    query = "CY=ITA AND (PC=72000000 OR PC=48000000) AND PD>=20240101"
    fields = @("ND", "TI", "PD", "PC", "AA", "CY")
    limit = 250
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**5. Bandi cloud/DevOps/Kubernetes:**
```powershell
$body = @{
    query = "CY=ITA AND (TI=cloud OR TI=kubernetes OR TI=devops OR TI=microservizi) AND PD>=20240101"
    fields = @("ND", "TI", "PD", "PC", "AA", "CY")
    limit = 100
} | ConvertTo-Json

$results = Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
Write-Host "Totale bandi trovati: $($results.totalNoticeCount)" -ForegroundColor Green
```

### Struttura Response
```json
{
  "notices": [
    {
      "ND": "12345-2024",
      "TI": { "ita": "Titolo italiano", "eng": "English title" },
      "PD": "2024-01-15Z",
      "PC": ["72000000"],
      "CY": ["ITA"],
      "links": {
        "html": { "ITA": "https://ted.europa.eu/it/notice/-/detail/12345-2024" }
      }
    }
  ],
  "totalNoticeCount": 1500
}
```

### Export CSV
```powershell
$export = $results.notices | ForEach-Object {
    [PSCustomObject]@{
        ID = $_.ND
        Titolo = $_.TI.ita
        Data = $_.PD
        CPV = $_.PC -join "; "
        Link = $_.links.html.ITA
    }
}
$export | Export-Csv -Path "ted_bandi_italia.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Salvato in ted_bandi_italia.csv" -ForegroundColor Green
```

### Rate Limits
- 15,000 risultati max in pagination mode
- 250 risultati per pagina max
- Scroll mode per risultati illimitati (usa iterationNextToken)

### Link Utili
- Expert Search Builder: https://ted.europa.eu/en/expert-search
- API Docs: https://ted.europa.eu/api/documentation/index.html
- Swagger: https://api.ted.europa.eu/swagger-ui.html

---

## 3. ADZUNA ✅ CONFERMATA

### Descrizione
Aggregatore annunci lavoro. Include Indeed, Monster, CareerBuilder, SimplyHired.

### Autenticazione
**Richiesta** - app_id e app_key come query params

### Registrazione
https://developer.adzuna.com

### Endpoint
```
GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}
```

### Paesi Disponibili
it, gb, us, de, fr, au, br, ca, in, nl, pl, ru, za

### Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| app_id | string | Il tuo App ID |
| app_key | string | La tua App Key |
| what | string | Keywords ricerca |
| where | string | Location |
| results_per_page | number | Max 50 |
| max_days_old | number | Età massima annunci |
| salary_min | number | Stipendio minimo |
| salary_max | number | Stipendio massimo |
| full_time | 1 | Solo full time |
| permanent | 1 | Solo contratti permanenti |

### Esempi

**Developer Brescia:**
```powershell
$appId = "YOUR_APP_ID"
$appKey = "YOUR_APP_KEY"
$url = "https://api.adzuna.com/v1/api/jobs/it/search/1?app_id=$appId&app_key=$appKey&what=developer&where=brescia&results_per_page=20"

$results = Invoke-RestMethod -Uri $url
$results.results | Select-Object title, company, location, salary_min, salary_max
```

**DevOps Milano stipendio > 50k:**
```
https://api.adzuna.com/v1/api/jobs/it/search/1?app_id=XXX&app_key=YYY&what=devops&where=milano&salary_min=50000
```

### Rate Limits
Free tier disponibile - vedi dashboard developer

---

## 4. APIFY ✅ CONFERMATA

### Descrizione
Piattaforma scraping con actor pre-costruiti per LinkedIn, Indeed, Glassdoor, Google Trends.

### Autenticazione
**Richiesta** - Bearer token

### Registrazione
https://apify.com

### Actor Utili

| Actor | ID | Use Case |
|-------|-----|----------|
| Indeed Scraper | misceres/indeed-scraper | Job postings Indeed |
| LinkedIn Jobs | bebity/linkedin-jobs-scraper | Job postings LinkedIn |
| Glassdoor | bebity/glassdoor-jobs-scraper | Job + reviews |
| Google Trends | emastra/google-trends-scraper | Trend ricerche (workaround) |

### Endpoint

**Avviare Actor:**
```
POST https://api.apify.com/v2/acts/{actorId}/runs
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Ottenere risultati:**
```
GET https://api.apify.com/v2/actor-runs/{runId}/dataset/items
```

### Esempio Indeed Scraper
```powershell
$token = "YOUR_APIFY_TOKEN"
$headers = @{ "Authorization" = "Bearer $token" }

$body = @{
    queries = @("devops brescia", "kubernetes milano")
    country = "IT"
    maxItems = 50
} | ConvertTo-Json

$run = Invoke-RestMethod -Uri "https://api.apify.com/v2/acts/misceres~indeed-scraper/runs" -Method POST -Headers $headers -ContentType "application/json" -Body $body

# Attendi e ottieni risultati
Start-Sleep -Seconds 60
$results = Invoke-RestMethod -Uri "https://api.apify.com/v2/actor-runs/$($run.data.id)/dataset/items" -Headers $headers
```

### Rate Limits
Free tier: $5 crediti/mese (~1000 risultati scraping)

---

## 5. STACK OVERFLOW JOBS ❌ CHIUSO

### ⚠️ ATTENZIONE
**Stack Overflow ha chiuso la sezione Jobs nel 2022.**

NON esiste più Stack Overflow Jobs API.

### Cosa rimane disponibile
L'API Stack Exchange per Q&A è ancora attiva (per identificare pain points tecnici):

```
GET https://api.stackexchange.com/2.3/search?intitle=kubernetes+error&site=stackoverflow
```

Ma per job listings, usare alternative:
- **Adzuna** ✅ (già configurata)
- **Apify** ✅ (già configurata - Indeed, LinkedIn)
- **RemoteOK** (API gratuita per remote jobs)
- **We Work Remotely** (RSS feed)

---

## 6. ANAC OPEN DATA 📋 DA CONFIGURARE

### Descrizione
Bandi pubblici italiani sotto soglia EU. Tutti i contratti PA.

### Autenticazione
**Nessuna**

### Risorse

| Risorsa | URL |
|---------|-----|
| Catalogo Dataset | https://dati.anticorruzione.it/opendata/dataset |
| SPARQL Endpoint | https://dati.anticorruzione.it/sparql |

### Note
Complementare a TED Europa:
- TED = bandi sopra €140k
- ANAC = TUTTI i contratti pubblici italiani

---

## 7. GITHUB API 📋 DA CONFIGURARE

### Descrizione
Trend tecnologici, repository popolari, progetti emergenti.

### Autenticazione
Consigliata (5,000 req/ora vs 60 senza token)

### Endpoint
```
GET https://api.github.com/search/repositories?q=kubernetes&sort=stars&order=desc
```

### Rate Limits
- Senza token: 60 req/ora
- Con token: 5,000 req/ora

---

## 8. REDDIT API ⏳ IN ATTESA APPROVAZIONE

### Descrizione
Discussioni reali su subreddit tech per pain points e trend.

### Subreddit Target
- r/devops
- r/sysadmin
- r/ItalyInformatica
- r/programming
- r/kubernetes
- r/aws

### Status
In attesa approvazione (24-48h)

---

## 9. REMOTEOK API 📋 DA CONFIGURARE

### Descrizione
Job board specializzato in lavori remoti. API gratuita.

### Autenticazione
**Nessuna**

### Endpoint
```
GET https://remoteok.com/api
```

### Note
Ritorna JSON con tutti i job remoti disponibili. Filtro lato client.

---

*Ultimo aggiornamento: 03 Gennaio 2026*
