// ========================
// APPLICATION STATE
// ========================

const appState = {
    weeklyHours: 0,
    hourlyRate: 0,
    monthlyCost: 0,
    annualCost: 0,
    selectedTasks: [],
    otherTask: '',
    timing: '',
    objective: '',
    detectedNeed: '',
    contact: {
        firstName: '',
        email: '',
        phone: '',
        location: '',
        availability: []
    }
};

// ========================
// INITIALIZE EMAILJS
// ========================

// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',     // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'      // Replace with your EmailJS public key
};

// Initialize EmailJS when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
    
    initializeApp();
});

// ========================
// INITIALIZATION
// ========================

function initializeApp() {
    // Phase 1: Calculator
    const calculatorForm = document.getElementById('calculatorForm');
    calculatorForm.addEventListener('submit', handleCalculatorSubmit);
    
    // Transition CTA
    const btnQualification = document.getElementById('btnQualification');
    btnQualification.addEventListener('click', showQualificationForm);
    
    // Phase 2: Qualification Form
    const qualificationForm = document.getElementById('qualificationForm');
    qualificationForm.addEventListener('submit', handleQualificationSubmit);
    
    // "Autre" checkbox handler
    const autreCheckbox = document.getElementById('autreCheckbox');
    const autreText = document.getElementById('autreText');
    autreCheckbox.addEventListener('change', function() {
        autreText.disabled = !this.checked;
        if (!this.checked) {
            autreText.value = '';
        }
    });
    
    // Contact CTA
    const btnContactYes = document.getElementById('btnContactYes');
    const btnContactNo = document.getElementById('btnContactNo');
    btnContactYes.addEventListener('click', showContactForm);
    btnContactNo.addEventListener('click', showNoContactMessage);
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Restart buttons
    const btnRestart = document.getElementById('btnRestart');
    const btnRestartNoContact = document.getElementById('btnRestartNoContact');
    btnRestart.addEventListener('click', restartSimulation);
    btnRestartNoContact.addEventListener('click', restartSimulation);
    
    // Load saved data from localStorage
    loadFromLocalStorage();
}

// ========================
// PHASE 1: CALCULATOR
// ========================

function handleCalculatorSubmit(e) {
    e.preventDefault();
    
    const weeklyHours = parseFloat(document.getElementById('weeklyHours').value);
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    
    // Validate inputs
    if (weeklyHours <= 0 || hourlyRate <= 0) {
        alert('Veuillez entrer des valeurs positives.');
        return;
    }
    
    // Calculate costs
    const monthlyHours = weeklyHours * 4.33; // Average weeks per month
    const monthlyCost = monthlyHours * hourlyRate;
    const annualCost = monthlyCost * 12;
    
    // Update state
    appState.weeklyHours = weeklyHours;
    appState.hourlyRate = hourlyRate;
    appState.monthlyCost = monthlyCost;
    appState.annualCost = annualCost;
    
    // Display results
    displayResults(weeklyHours, monthlyHours, monthlyCost, annualCost);
    
    // Save to localStorage
    saveToLocalStorage();
}

function displayResults(weeklyHours, monthlyHours, monthlyCost, annualCost) {
    // Update result values
    document.getElementById('monthlyHours').textContent = monthlyHours.toFixed(1);
    document.getElementById('monthlyCost').textContent = formatCurrency(monthlyCost);
    document.getElementById('annualCost').textContent = formatCurrency(annualCost);
    
    // Generate impact message
    const impactText = generateImpactMessage(weeklyHours, monthlyCost, annualCost);
    document.getElementById('impactText').textContent = impactText;
    
    // Show results section
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function generateImpactMessage(weeklyHours, monthlyCost, annualCost) {
    const messages = [
        `Chaque année, vous perdez ${formatCurrency(annualCost)} de chiffre d'affaires à gérer votre administratif. C'est l'équivalent de ${Math.round(annualCost / appState.hourlyRate)} heures de travail facturable.`,
        `${formatCurrency(monthlyCost)} par mois, c'est ce que vous coûte votre administratif. Imaginez ce que vous pourriez faire avec ce budget ou ce temps.`,
        `En ${weeklyHours} heures par semaine, vous pourriez facturer ${formatCurrency(weeklyHours * appState.hourlyRate * 52)} de plus par an. Votre administratif vous coûte réellement de l'argent.`,
        `${formatCurrency(annualCost)} par an : c'est le prix réel de votre charge administrative. Ce temps pourrait être consacré à développer votre activité.`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

// ========================
// TRANSITION
// ========================

function showQualificationForm() {
    hideSection('phase1');
    showSection('phase2');
    scrollToTop();
}

// ========================
// PHASE 2: QUALIFICATION
// ========================

function handleQualificationSubmit(e) {
    e.preventDefault();
    
    // Collect selected tasks
    const taskCheckboxes = document.querySelectorAll('input[name="tasks"]:checked');
    const selectedTasks = Array.from(taskCheckboxes).map(cb => cb.value);
    
    // Get "autre" text if checked
    const autreCheckbox = document.getElementById('autreCheckbox');
    const autreText = document.getElementById('autreText').value.trim();
    
    if (selectedTasks.length === 0) {
        alert('Veuillez sélectionner au moins une tâche.');
        return;
    }
    
    // Get timing
    const timing = document.querySelector('input[name="timing"]:checked')?.value;
    if (!timing) {
        alert('Veuillez sélectionner un moment de gestion.');
        return;
    }
    
    // Get objective
    const objective = document.querySelector('input[name="objective"]:checked')?.value;
    if (!objective) {
        alert('Veuillez sélectionner un objectif.');
        return;
    }
    
    // Update state
    appState.selectedTasks = selectedTasks;
    appState.otherTask = autreCheckbox.checked ? autreText : '';
    appState.timing = timing;
    appState.objective = objective;
    
    // Detect need
    const detectedNeed = detectNeed(selectedTasks);
    appState.detectedNeed = detectedNeed;
    
    // Display personalized message
    displayPersonalizedMessage(detectedNeed);
    
    // Save to localStorage
    saveToLocalStorage();
}

function detectNeed(tasks) {
    // Financial and administrative management
    const financialTasks = ['urssaf', 'tva', 'comptable'];
    if (tasks.some(task => financialTasks.includes(task))) {
        return 'Gestion administrative et financière';
    }
    
    // Current administrative management
    const currentAdminTasks = ['factures', 'devis', 'relances'];
    if (tasks.some(task => currentAdminTasks.includes(task))) {
        return 'Gestion administrative courante';
    }
    
    // Administrative organization
    const organizationTasks = ['classement', 'maj-dossiers', 'echeances', 'reporting'];
    if (tasks.some(task => organizationTasks.includes(task))) {
        return 'Organisation administrative';
    }
    
    // Administrative assistance
    const assistanceTasks = ['emails', 'agenda', 'suivi-clients'];
    if (tasks.some(task => assistanceTasks.includes(task))) {
        return 'Assistance administrative / direction';
    }
    
    // Personalized administrative support
    const personalTasks = ['admin-perso', 'courriers'];
    if (tasks.some(task => personalTasks.includes(task))) {
        return 'Accompagnement administratif personnalisé';
    }
    
    // Default
    return 'Besoin administratif général';
}

function displayPersonalizedMessage(need) {
    document.getElementById('detectedNeed').textContent = need;
    
    hideSection('phase2');
    showSection('phase2Results');
    scrollToTop();
}

// ========================
// CONTACT CTA
// ========================

function showContactForm() {
    hideSection('phase2Results');
    showSection('contactSection');
    scrollToTop();
}

function showNoContactMessage() {
    hideSection('phase2Results');
    showSection('noContact');
    scrollToTop();
}

// ========================
// CONTACT FORM
// ========================

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
    const availability = Array.from(availabilityCheckboxes).map(cb => cb.value);
    
    const rgpd = document.getElementById('rgpd').checked;
    
    // Validation
    if (!firstName || !email || !phone || !location) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    if (availability.length === 0) {
        alert('Veuillez sélectionner au moins une disponibilité.');
        return;
    }
    
    if (!rgpd) {
        alert('Veuillez accepter les conditions RGPD.');
        return;
    }
    
    // Update state
    appState.contact = {
        firstName,
        email,
        phone,
        location,
        availability
    };
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Send email via EmailJS
    sendEmailNotification();
}

function sendEmailNotification() {
    const btnSubmit = document.getElementById('btnSubmitContact');
    btnSubmit.textContent = 'Envoi en cours...';
    btnSubmit.disabled = true;
    
    // Prepare email template parameters
    const templateParams = {
        // Contact information
        firstName: appState.contact.firstName,
        email: appState.contact.email,
        phone: appState.contact.phone,
        location: appState.contact.location,
        availability: appState.contact.availability.join(', '),
        
        // Phase 1 data
        weeklyHours: appState.weeklyHours,
        hourlyRate: appState.hourlyRate,
        monthlyCost: formatCurrency(appState.monthlyCost),
        annualCost: formatCurrency(appState.annualCost),
        
        // Phase 2 data
        selectedTasks: appState.selectedTasks.join(', '),
        otherTask: appState.otherTask || 'Non spécifié',
        timing: appState.timing,
        objective: appState.objective,
        detectedNeed: appState.detectedNeed,
        
        // Timestamp
        timestamp: new Date().toLocaleString('fr-FR')
    };
    
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
        // EmailJS not configured - simulate success for demo
        console.log('EmailJS not yet configured. Data that would be sent:', templateParams);
        
        setTimeout(() => {
            // Store data in localStorage for manual retrieval
            const submissions = JSON.parse(localStorage.getItem('cashAdminSubmissions') || '[]');
            submissions.push({
                ...templateParams,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('cashAdminSubmissions', JSON.stringify(submissions));
            
            showThankYou();
            btnSubmit.textContent = 'Envoyer ma demande';
            btnSubmit.disabled = false;
        }, 1000);
        
        return;
    }
    
    // Send email using EmailJS
    emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
    )
    .then(function(response) {
        console.log('Email sent successfully', response);
        showThankYou();
        btnSubmit.textContent = 'Envoyer ma demande';
        btnSubmit.disabled = false;
    })
    .catch(function(error) {
        console.error('Email sending failed', error);
        alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
        btnSubmit.textContent = 'Envoyer ma demande';
        btnSubmit.disabled = false;
    });
}

function showThankYou() {
    hideSection('contactSection');
    showSection('thankYou');
    scrollToTop();
}

// ========================
// RESTART
// ========================

function restartSimulation() {
    // Reset state
    Object.keys(appState).forEach(key => {
        if (typeof appState[key] === 'object' && !Array.isArray(appState[key])) {
            appState[key] = {};
        } else if (Array.isArray(appState[key])) {
            appState[key] = [];
        } else {
            appState[key] = 0;
        }
    });
    
    // Reset forms
    document.getElementById('calculatorForm').reset();
    document.getElementById('qualificationForm').reset();
    document.getElementById('contactForm').reset();
    
    // Disable "autre" text input
    document.getElementById('autreText').disabled = true;
    
    // Hide all sections except phase1
    hideSection('results');
    hideSection('phase2');
    hideSection('phase2Results');
    hideSection('contactSection');
    hideSection('thankYou');
    hideSection('noContact');
    
    showSection('phase1');
    scrollToTop();
    
    // Clear localStorage (optional - comment out if you want to keep history)
    // localStorage.removeItem('cashAdminData');
}

// ========================
// UTILITIES
// ========================

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.remove('hidden');
    setTimeout(() => {
        section.classList.add('active');
    }, 10);
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.remove('active');
    setTimeout(() => {
        section.classList.add('hidden');
    }, 350);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount));
}

// ========================
// LOCAL STORAGE
// ========================

function saveToLocalStorage() {
    try {
        localStorage.setItem('cashAdminData', JSON.stringify(appState));
    } catch (e) {
        console.error('Failed to save to localStorage', e);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('cashAdminData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(appState, data);
        }
    } catch (e) {
        console.error('Failed to load from localStorage', e);
    }
}

// ========================
// EMAILJS TEMPLATE EXAMPLE
// ========================

/*
When setting up your EmailJS template, use these variable names:

Subject: Nouveau lead Cash Admin - {{firstName}}

Body:
======================
NOUVEAU LEAD CASH ADMIN
======================

INFORMATIONS CONTACT
-------------------
Prénom: {{firstName}}
Email: {{email}}
Téléphone: {{phone}}
Ville/CP: {{location}}
Disponibilité: {{availability}}

ANALYSE PHASE 1
--------------
Heures admin/semaine: {{weeklyHours}}h
Valeur horaire: {{hourlyRate}}€
Coût mensuel: {{monthlyCost}}€
Coût annuel: {{annualCost}}€

QUALIFICATION PHASE 2
--------------------
Tâches chronophages: {{selectedTasks}}
Autre précision: {{otherTask}}
Moment de gestion: {{timing}}
Objectif principal: {{objective}}

BESOIN DÉTECTÉ: {{detectedNeed}}

Reçu le: {{timestamp}}
*/
