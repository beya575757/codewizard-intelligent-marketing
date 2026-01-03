# Guida Completa API - CodeWizard Intelligent Marketing

Questa guida spiega come usare ogni API configurata nel sistema.

---

## 1. HACKER NEWS (Algolia)

### Descrizione
Accesso ai contenuti di Hacker News per identificare pain points, trend e discussioni tech.

### Autenticazione
**Nessuna** - API completamente pubblica

### Base URL
```
https://hn.algolia.com/api/v1
```

### Endpoint Principali

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| /search | GET | Ricerca per rilevanza |
| /search_by_date | GET | Ricerca per data |

### Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| query | string | Termini di ricerca |
| tags | string | story, comment, poll, ask_hn, show_hn |
| numericFilters | string | created_at_i, points, num_comments |
| hitsPerPage | number | Max 1000 |

### Esempi

```
https://hn.algolia.com/api/v1/search?query=devops+pain+point&tags=story
https://hn.algolia.com/api/v1/search_by_date?query=kubernetes+problem&tags=story
```

### PowerShell
```powershell
$response = Invoke-RestMethod -Uri "https://hn.algolia.com/api/v1/search?query=devops+pain&tags=story"
$response.hits | Select-Object title, points, num_comments, url
```

### Rate Limits
10,000 richieste/ora - Nessuna chiave richiesta

---

## 2. TED EUROPA

### Descrizione
Bandi pubblici europei sopra soglia 140k EUR. Database ufficiale EU.

### Autenticazione
**Nessuna** per Search API

### Endpoint
```
POST https://api.ted.europa.eu/v3/notices/search
Content-Type: application/json
```

### Body Request
```json
{
    "query": "CY=ITA AND TI=software",
    "fields": ["ND", "TI", "PD", "PC", "AA", "CY"],
    "limit": 50,
    "page": 1
}
```

### Codici Campo

| Codice | Descrizione |
|--------|-------------|
| ND | Notice ID |
| TI | Titolo (TI.ita, TI.eng) |
| PD | Data pubblicazione (YYYYMMDD) |
| PC | CPV codes |
| AA | Tipo autorita |
| CY | Paese (ISO 3 lettere: ITA, GBR, DEU) |

### Sintassi Query

| Operazione | Esempio |
|------------|---------|
| Paese Italia | `CY=ITA` |
| Servizi IT | `PC=[72000000]` |
| Data da | `PD>=20240101` |
| Titolo contiene | `TI=software` |
| AND/OR | `CY=ITA AND (TI=cloud OR TI=devops)` |

### CPV Codes IT

| CPV | Descrizione |
|-----|-------------|
| 72000000 | Servizi IT e affini |
| 72200000 | Programmazione e consulenza |
| 72300000 | Elaborazione dati |
| 72400000 | Servizi Internet |

### PowerShell
```powershell
$body = @{
    query = "CY=ITA AND TI=software AND PD>=20240101"
    fields = @("ND", "TI", "PD", "PC", "AA", "CY")
    limit = 50
} | ConvertTo-Json

$results = Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
Write-Host "Totale bandi: $($results.totalNoticeCount)"
```

### Rate Limits
15,000 risultati max, 250 per pagina

### Link Utili
- Expert Search: https://ted.europa.eu/en/expert-search
- API Docs: https://ted.europa.eu/api/documentation/index.html

---

## 3. ADZUNA

### Descrizione
Aggregatore job: Indeed, Monster, CareerBuilder, SimplyHired.

### Autenticazione
**Richiesta** - app_id e app_key

### Registrazione
https://developer.adzuna.com

### Endpoint
```
GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}
```

### Paesi
it, gb, us, de, fr, au, br, ca, in, nl, pl, ru, za

### Parametri

| Parametro | Descrizione |
|-----------|-------------|
| app_id | Il tuo App ID |
| app_key | La tua App Key |
| what | Keywords ricerca |
| where | Location |
| results_per_page | Max 50 |
| salary_min/max | Filtro stipendio |

### Esempio
```
https://api.adzuna.com/v1/api/jobs/it/search/1?app_id=XXX&app_key=YYY&what=devops&where=milano
```

---

## 4. APIFY

### Descrizione
Piattaforma scraping per LinkedIn, Indeed, Glassdoor, Google Trends.

### Autenticazione
**Richiesta** - Bearer token

### Registrazione
https://apify.com

### Actor Utili

| Actor | ID |
|-------|-----|
| Indeed | misceres/indeed-scraper |
| LinkedIn Jobs | bebity/linkedin-jobs-scraper |
| Glassdoor | bebity/glassdoor-jobs-scraper |
| Google Trends | emastra/google-trends-scraper |

### Endpoint
```
POST https://api.apify.com/v2/acts/{actorId}/runs
Authorization: Bearer YOUR_TOKEN
```

### Rate Limits
Free tier: $5 crediti/mese

---

## 5. STACK OVERFLOW API (Da Configurare)

### Autenticazione
Opzionale - 300 req/giorno senza key

### Endpoint
```
GET https://api.stackexchange.com/2.3/search?intitle=kubernetes+error&site=stackoverflow
```

---

## 6. GITHUB API (Da Configurare)

### Autenticazione
Consigliata - 5,000 req/ora con token

### Endpoint
```
GET https://api.github.com/search/repositories?q=kubernetes&sort=stars
```

---

## 7. ANAC OPEN DATA (Da Configurare)

### Descrizione
Bandi pubblici italiani sotto soglia EU.

### Risorse
- Catalogo: https://dati.anticorruzione.it/opendata/dataset
- SPARQL: https://dati.anticorruzione.it/sparql

---

## 8. REDDIT API (In Attesa)

### Subreddit Target
r/devops, r/sysadmin, r/ItalyInformatica, r/programming, r/kubernetes, r/aws

### Status
In attesa approvazione (24-48h)

---

*Ultimo aggiornamento: 03 Gennaio 2026*
