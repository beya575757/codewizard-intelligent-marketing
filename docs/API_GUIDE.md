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

### Codici CPV per IT

| CPV | Descrizione |
|-----|-------------|
| 72000000 | Servizi IT e affini |
| 48000000 | Software e sistemi informatici |
| 72200000 | Consulenza software e programmazione |
| 72300000 | Servizi elaborazione dati |

### Operatori Query
- `AND` - Entrambe condizioni
- `OR` - Una delle due
- `=` - Uguale
- `>=` - Maggiore o uguale
- `()` - Raggruppamento

### Esempi Pratici

**Bandi Italia 2024:**
```powershell
$body = @{
    query = "CY=ITA AND PD>=20240101"
    fields = @("ND", "TI", "PD")
    limit = 20
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**Bandi IT Services Italia:**
```powershell
$body = @{
    query = "CY=ITA AND PC=72000000"
    fields = @("ND", "TI", "PD", "PC", "CY")
    limit = 50
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**Bandi software ultimi 30 giorni:**
```powershell
$data = (Get-Date).AddDays(-30).ToString("yyyyMMdd")
$body = @{
    query = "CY=ITA AND TI=software AND PD>=$data"
    fields = @("ND", "TI", "PD", "PC")
    limit = 100
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

**Combinazione complessa (IT + Software):**
```powershell
$body = @{
    query = "CY=ITA AND (PC=72000000 OR PC=48000000) AND PD>=20240101"
    fields = @("ND", "TI", "PD", "PC", "AA", "CY")
    limit = 250
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.ted.europa.eu/v3/notices/search" -Method POST -ContentType "application/json" -Body $body
```

### Response Structure
```json
{
  "notices": [
    {
      "ND": "12345-2024",
      "TI": { "ita": "Titolo italiano", "eng": "English title" },
      "PD": "2024-01-15Z",
      "PC": ["72000000"],
      "CY": ["ITA"],
      "links": { "html": { "ITA": "https://ted.europa.eu/it/notice/-/detail/12345-2024" } }
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
```

### Rate Limits
- 15,000 risultati max, 250 per pagina
- Expert Search: https://ted.europa.eu/en/expert-search

---

## 3. ADZUNA ✅ CONFERMATA

### Descrizione
Aggregatore annunci lavoro. Include Indeed, Monster, CareerBuilder, SimplyHired.

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
app_id, app_key, what, where, results_per_page, salary_min, salary_max

---

## 4. APIFY ✅ CONFERMATA

### Descrizione
Piattaforma scraping per LinkedIn, Indeed, Glassdoor, Google Trends.

### Autenticazione
**Richiesta** - Bearer token

### Actor Utili
- Indeed: misceres/indeed-scraper
- LinkedIn Jobs: bebity/linkedin-jobs-scraper
- Google Trends: emastra/google-trends-scraper

### Rate Limits
Free tier: $5 crediti/mese

---

## 5. STACK OVERFLOW ❌ JOBS CHIUSO

**Stack Overflow ha chiuso Jobs nel 2022.** API Q&A ancora attiva per pain points:
```
GET https://api.stackexchange.com/2.3/search?intitle=kubernetes+error&site=stackoverflow
```

---

## 6. ANAC OPEN DATA 📋 DA CONFIGURARE

Bandi PA italiani sotto soglia EU.
- Catalogo: https://dati.anticorruzione.it/opendata/dataset
- SPARQL: https://dati.anticorruzione.it/sparql

---

## 7. GITHUB API 📋 DA CONFIGURARE

Trend tech, repository popolari.
```
GET https://api.github.com/search/repositories?q=kubernetes&sort=stars
```
Rate: 60/ora senza token, 5000/ora con token

---

## 8. REDDIT API ⏳ IN ATTESA

Subreddit: r/devops, r/sysadmin, r/ItalyInformatica, r/kubernetes, r/aws

---

## 9. REMOTEOK API ✅ CONFERMATA

### Descrizione
Job board lavori remoti. API gratuita.

### Autenticazione
**Nessuna** - Richiede User-Agent header

### Endpoint
```
GET https://remoteok.com/api
Headers: User-Agent: Mozilla/5.0
```

### ⚠️ Importante
- Primo elemento array è metadata, jobs da indice 1
- Filtro lato client

### Request Base
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
# Jobs reali: $jobs[1..($jobs.Count)]
```

### Campi Response
position, company, location, salary_min, salary_max, tags, url, date

### Jobs DevOps/Cloud
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
$devopsJobs = $jobs[1..($jobs.Count)] | Where-Object {
    ($_.tags -join " ") -match "devops|cloud|kubernetes|aws|azure|terraform|docker"
}
Write-Host "Totale jobs DevOps/Cloud: $($devopsJobs.Count)" -ForegroundColor Green
$devopsJobs | Select-Object -First 10 | Format-Table position, company, location -AutoSize
```

### Analisi Tags
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
$allTags = $jobs[1..($jobs.Count)] | ForEach-Object { $_.tags } | Where-Object { $_ -ne $null }
$flatTags = $allTags | ForEach-Object { $_ }
$tagCounts = $flatTags | Group-Object | Sort-Object Count -Descending | Select-Object -First 15
Write-Host "Top 15 tags:" -ForegroundColor Cyan
$tagCounts | ForEach-Object { Write-Host "$($_.Name): $($_.Count) jobs" }
```

### Salary Benchmark
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
$devopsWithSalary = $jobs[1..($jobs.Count)] | Where-Object {
    ($_.tags -join " " -match "devops|cloud") -and $_.salary_min -gt 0
}
$avgSalary = ($devopsWithSalary.salary_min | Measure-Object -Average).Average
Write-Host "Salary medio MIN: $([Math]::Round($avgSalary))" -ForegroundColor Green
$devopsWithSalary | Sort-Object salary_min -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.salary_min)k - $($_.position) @ $($_.company)"
}
```

### Export CSV
```powershell
$jobs = Invoke-RestMethod -Uri "https://remoteok.com/api" -Headers @{"User-Agent"="Mozilla/5.0"}
$export = $jobs[1..($jobs.Count)] | ForEach-Object {
    [PSCustomObject]@{
        Position = $_.position
        Company = $_.company
        Location = $_.location
        Salary_Min = $_.salary_min
        Salary_Max = $_.salary_max
        Tags = ($_.tags -join "; ")
        URL = $_.url
        Has_DevOps = if (($_.tags -join " ") -match "devops") { "YES" } else { "NO" }
        Has_Cloud = if (($_.tags -join " ") -match "cloud") { "YES" } else { "NO" }
        Is_Senior = if ($_.position -match "senior|lead|principal|architect") { "YES" } else { "NO" }
    }
}
$export | Export-Csv -Path "RemoteOK_ALL_Jobs.csv" -NoTypeInformation -Encoding UTF8
Start-Process "RemoteOK_ALL_Jobs.csv"
```

### Tags Rilevanti
devops, cloud, kubernetes, aws, azure, terraform, docker, python, golang, senior, lead, architect

---

*Ultimo aggiornamento: 03 Gennaio 2026*
