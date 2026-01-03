// Template per salvare sessioni di lavoro
// Eseguire con: docker exec codewizard-marketing-db mongosh -u codewizard -p marketing2024 --authenticationDatabase admin intelligent_marketing /tmp/create_session.js

db.sessions.insertOne({
    session_id: 'SESSION_YYYY-MM-DD_NNN',
    date: new Date(),
    duration_hours: 0,
    
    request: {
        summary: "Descrizione richiesta utente",
        objectives: [],
        context: ""
    },
    
    work_completed: {
        // Fasi di lavoro completate
    },
    
    results: {
        // Risultati ottenuti
    },
    
    next_steps: [],
    technical_notes: [],
    
    created_at: new Date(),
    user: "Beya M'Ganza",
    project: "CodeWizard Intelligent Marketing"
});
