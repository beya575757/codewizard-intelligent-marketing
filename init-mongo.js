// init-mongo.js - Inizializzazione database e API confermate

db = db.getSiblingDB('intelligent_marketing');

// Collezione API Sources - Le fonti dati confermate e funzionanti
db.createCollection('api_sources');

// ============================================
// API CONFERMATE E FUNZIONANTI
// ============================================

// 1. HACKER NEWS (Algolia) - Pain Points
db.api_sources.insertOne({
    name: "Hacker News (Algolia)",
    category: "pain_points",
    status: "confirmed",
    requires_auth: false,
    requires_approval: false,
    cost: "free",
    base_url: "https://hn.algolia.com/api/v1",
    endpoints: [
        {
            name: "search",
            method: "GET",
            url: "https://hn.algolia.com/api/v1/search",
            params: {
                query: "string - termini di ricerca",
                tags: "string - filtro (story, comment, poll, etc)",
                numericFilters: "string - filtri numerici"
            },
            example: "https://hn.algolia.com/api/v1/search?query=devops+pain+point&tags=story"
        },
        {
            name: "search_by_date",
            method: "GET", 
            url: "https://hn.algolia.com/api/v1/search_by_date",
            example: "https://hn.algolia.com/api/v1/search_by_date?query=kubernetes+problem&tags=story"
        }
    ],
    use_cases: [
        "Identificare pain points reali degli sviluppatori",
        "Trend tecnologici emergenti",
        "Problemi con tool specifici",
        "Sentiment su tecnologie"
    ],
    rate_limits: "10,000 requests/hour",
    documentation: "https://hn.algolia.com/api",
    confirmed_date: new Date(),
    notes: "Zero signup. Funziona direttamente nel browser."
});

// 2. TED EUROPA - Bandi EU
db.api_sources.insertOne({
    name: "TED Europa",
    category: "public_tenders",
    status: "confirmed",
    requires_auth: false,
    requires_approval: false,
    cost: "free",
    base_url: "https://api.ted.europa.eu",
    endpoints: [
        {
            name: "notices_search",
            method: "POST",
            url: "https://api.ted.europa.eu/v3/notices/search",
            content_type: "application/json",
            body_schema: {
                query: "string - Expert Search query",
                fields: "array - campi da restituire",
                limit: "number - max 250",
                page: "number"
            },
            field_codes: {
                ND: "Notice ID",
                TI: "Titolo (TI.ita, TI.eng)",
                PD: "Data pubblicazione (YYYYMMDD)",
                PC: "CPV codes",
                AA: "Tipo autorita",
                CY: "Paese (ISO 3 lettere: ITA, GBR, DEU)",
                TD: "Tipo documento"
            },
            query_syntax: {
                country_italy: "CY=ITA",
                it_services_cpv: "PC=[72000000]",
                date_from_2024: "PD>=20240101",
                title_contains: "TI=software",
                combined: "CY=ITA AND TI=software AND PD>=20240101"
            }
        }
    ],
    use_cases: [
        "Bandi pubblici EU sopra 140k EUR",
        "Gare IT/software PA italiana",
        "Monitoraggio opportunita procurement"
    ],
    rate_limits: "15,000 risultati max, 250 per pagina",
    documentation: "https://ted.europa.eu/api/documentation/index.html",
    expert_search_builder: "https://ted.europa.eu/en/expert-search",
    confirmed_date: new Date(),
    notes: "Zero API key. Italia = CY=ITA. CPV IT = 72000000."
});

// 3. ADZUNA - Job Market
db.api_sources.insertOne({
    name: "Adzuna",
    category: "job_market",
    status: "confirmed",
    requires_auth: true,
    requires_approval: false,
    cost: "free",
    base_url: "https://api.adzuna.com/v1/api",
    auth_type: "query_params",
    credentials_needed: ["app_id", "app_key"],
    registration_url: "https://developer.adzuna.com",
    endpoints: [
        {
            name: "job_search",
            method: "GET",
            url: "https://api.adzuna.com/v1/api/jobs/{country}/search/{page}",
            params: {
                app_id: "string",
                app_key: "string",
                what: "string - keywords",
                where: "string - location",
                results_per_page: "number - max 50"
            },
            countries: ["it", "gb", "us", "de", "fr", "au", "br", "ca", "in", "nl", "pl", "ru", "za"],
            example: "https://api.adzuna.com/v1/api/jobs/it/search/1?app_id=XXX&app_key=YYY&what=developer&where=brescia"
        }
    ],
    use_cases: [
        "Competenze piu richieste",
        "Salary benchmarking",
        "Trend domanda per tecnologie"
    ],
    rate_limits: "Free tier disponibile",
    documentation: "https://developer.adzuna.com/docs",
    confirmed_date: new Date(),
    notes: "Aggrega Indeed, Monster, CareerBuilder, SimplyHired."
});

// 4. APIFY - Scraping Platform
db.api_sources.insertOne({
    name: "Apify",
    category: "scraping_platform",
    status: "confirmed",
    requires_auth: true,
    requires_approval: false,
    cost: "free_tier",
    base_url: "https://api.apify.com/v2",
    auth_type: "bearer_token",
    credentials_needed: ["api_token"],
    registration_url: "https://apify.com",
    actors_available: [
        { name: "Indeed Scraper", actor_id: "misceres/indeed-scraper" },
        { name: "LinkedIn Jobs Scraper", actor_id: "bebity/linkedin-jobs-scraper" },
        { name: "Glassdoor Scraper", actor_id: "bebity/glassdoor-jobs-scraper" },
        { name: "Google Trends Scraper", actor_id: "emastra/google-trends-scraper" }
    ],
    endpoints: [
        {
            name: "run_actor",
            method: "POST",
            url: "https://api.apify.com/v2/acts/{actorId}/runs",
            headers: { "Authorization": "Bearer YOUR_TOKEN" }
        },
        {
            name: "get_results",
            method: "GET",
            url: "https://api.apify.com/v2/actor-runs/{runId}/dataset/items"
        }
    ],
    use_cases: [
        "Scraping job boards multipli",
        "LinkedIn company data",
        "Google Trends (workaround)"
    ],
    rate_limits: "Free tier: $5 crediti/mese",
    documentation: "https://docs.apify.com",
    confirmed_date: new Date(),
    notes: "Usare per Google Trends dato che API ufficiale non esiste."
});

// ============================================
// API IN ATTESA APPROVAZIONE
// ============================================

db.api_sources.insertOne({
    name: "Reddit API",
    category: "pain_points",
    status: "pending_approval",
    requires_auth: true,
    requires_approval: true,
    approval_time: "24-48 ore",
    cost: "free",
    base_url: "https://oauth.reddit.com",
    registration_url: "https://www.reddit.com/prefs/apps",
    credentials_needed: ["client_id", "client_secret"],
    subreddits_target: ["r/devops", "r/sysadmin", "r/ItalyInformatica", "r/programming", "r/kubernetes", "r/aws"],
    rate_limits: "60 requests/minuto",
    documentation: "https://www.reddit.com/dev/api",
    request_date: new Date(),
    notes: "Richiesta inviata, in attesa approvazione"
});

// ============================================
// API DA CONFIGURARE
// ============================================

db.api_sources.insertOne({
    name: "ANAC Open Data",
    category: "public_tenders",
    status: "to_configure",
    requires_auth: false,
    cost: "free",
    base_url: "https://dati.anticorruzione.it",
    endpoints: [
        { name: "sparql", url: "https://dati.anticorruzione.it/sparql" },
        { name: "datasets", url: "https://dati.anticorruzione.it/opendata/dataset" }
    ],
    use_cases: ["Bandi Italia sotto soglia EU", "Contratti PA completi", "CIG e fornitori"],
    documentation: "https://dati.anticorruzione.it/opendata",
    notes: "Complementare a TED. Copre TUTTI i contratti pubblici italiani."
});

db.api_sources.insertOne({
    name: "Stack Overflow API",
    category: "pain_points",
    status: "to_configure",
    requires_auth: false,
    cost: "free",
    base_url: "https://api.stackexchange.com/2.3",
    endpoints: [
        {
            name: "search",
            method: "GET",
            url: "https://api.stackexchange.com/2.3/search",
            example: "https://api.stackexchange.com/2.3/search?intitle=kubernetes+error&site=stackoverflow"
        }
    ],
    use_cases: ["Problemi tecnici comuni", "Gap di conoscenza"],
    rate_limits: "300 requests/giorno senza key",
    documentation: "https://api.stackexchange.com/docs"
});

db.api_sources.insertOne({
    name: "GitHub API",
    category: "tech_trends",
    status: "to_configure",
    requires_auth: true,
    cost: "free",
    base_url: "https://api.github.com",
    auth_type: "bearer_token",
    registration_url: "https://github.com/settings/tokens",
    endpoints: [
        {
            name: "search_repos",
            method: "GET",
            url: "https://api.github.com/search/repositories",
            example: "https://api.github.com/search/repositories?q=kubernetes&sort=stars"
        }
    ],
    use_cases: ["Tecnologie in crescita", "Tool piu adottati"],
    rate_limits: "5,000 requests/hour con token",
    documentation: "https://docs.github.com/en/rest"
});

// ============================================
// INDICI E COLLEZIONI
// ============================================

db.api_sources.createIndex({ name: 1 }, { unique: true });
db.api_sources.createIndex({ category: 1 });
db.api_sources.createIndex({ status: 1 });

db.createCollection('collected_data');
db.collected_data.createIndex({ source: 1, collected_at: -1 });

db.createCollection('search_history');
db.search_history.createIndex({ api_source: 1, executed_at: -1 });

print("Database intelligent_marketing inizializzato!");
print("API sources inserite: " + db.api_sources.countDocuments());
