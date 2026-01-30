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
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        location: '',
        availability: []
    }
};

// ========================
// WEB3FORMS CONFIGURATION
// ========================

// Web3Forms Access Key
// Get your free access key at: https://web3forms.com
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';  // Replace with your Web3Forms access key

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
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
    autreCheckbox.addEventListener('change', function () {
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

    // Phone number formatting and validation
    setupPhoneValidation();

    // Email validation
    setupEmailValidation();

    // NEW: Navigation & UI enhancements
    setupNavigation();
    setupScrollEffects();
    setupMobileMenu();
}

// ========================
// NAVIGATION & SCROLL
// ========================

function setupNavigation() {
    // Smooth scroll for all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's a cross-page link (contains .html)
            if (href.includes('.html')) {
                // Allow normal navigation to other pages
                return;
            }

            // For same-page anchors, prevent default and smooth scroll
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.remove('active');
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function setupScrollEffects() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Helper functions for scrolling
function scrollToSimulator() {
    const simulator = document.getElementById('simulator');
    if (simulator) {
        simulator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToFeatures() {
    const features = document.getElementById('features');
    if (features) {
        features.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

/* This function is now defined in the ENHANCED CONTACT FORM VALIDATION section below
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

    // Send email via Web3Forms
    sendEmailNotification();
}*/

function sendEmailNotification() {
    const btnSubmit = document.getElementById('btnSubmitContact');
    btnSubmit.textContent = 'Envoi en cours...';
    btnSubmit.disabled = true;

    // Prepare email body with all data
    const emailBody = `
======================
NOUVEAU LEAD CASH ADMIN
======================

INFORMATIONS CONTACT
-------------------
Nom: ${appState.contact.lastName}
Prénom: ${appState.contact.firstName}
Email: ${appState.contact.email}
Téléphone: ${appState.contact.phone}
Ville/CP: ${appState.contact.location}
Disponibilité: ${appState.contact.availability.join(', ')}

ANALYSE PHASE 1
--------------
Heures admin/semaine: ${appState.weeklyHours}h
Valeur horaire: ${appState.hourlyRate}€
Coût mensuel: ${formatCurrency(appState.monthlyCost)}€
Coût annuel: ${formatCurrency(appState.annualCost)}€

QUALIFICATION PHASE 2
--------------------
Tâches chronophages: ${appState.selectedTasks.join(', ')}
Autre précision: ${appState.otherTask || 'Non spécifié'}
Moment de gestion: ${appState.timing}
Objectif principal: ${appState.objective}

BESOIN DÉTECTÉ: ${appState.detectedNeed}

Date de soumission: ${new Date().toLocaleString('fr-FR')}
    `.trim();

    // Prepare form data for Web3Forms
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `Nouveau lead 4Services - ${appState.contact.firstName} ${appState.contact.lastName}`);
    formData.append('from_name', '4Services Simulator');
    formData.append('message', emailBody);

    // Add individual fields for better email formatting
    formData.append('Nom', appState.contact.lastName);
    formData.append('Prénom', appState.contact.firstName);
    formData.append('Email', appState.contact.email);
    formData.append('Téléphone', appState.contact.phone);
    formData.append('Ville', appState.contact.location);

    // Check if Web3Forms is configured
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        // Not configured - simulate success for demo
        console.log('Web3Forms not yet configured. Data that would be sent:');
        console.log(emailBody);

        setTimeout(() => {
            // Store data in localStorage for manual retrieval
            const submissions = JSON.parse(localStorage.getItem('cashAdminSubmissions') || '[]');
            submissions.push({
                ...appState.contact,
                phase1: {
                    weeklyHours: appState.weeklyHours,
                    hourlyRate: appState.hourlyRate,
                    monthlyCost: appState.monthlyCost,
                    annualCost: appState.annualCost
                },
                phase2: {
                    selectedTasks: appState.selectedTasks,
                    otherTask: appState.otherTask,
                    timing: appState.timing,
                    objective: appState.objective,
                    detectedNeed: appState.detectedNeed
                },
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('cashAdminSubmissions', JSON.stringify(submissions));

            showThankYou();
            btnSubmit.textContent = 'Envoyer ma demande';
            btnSubmit.disabled = false;
        }, 1000);

        return;
    }

    // Send to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Email sent successfully via Web3Forms');
                showThankYou();
            } else {
                console.error('Web3Forms error:', data);
                alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            }
            btnSubmit.textContent = 'Envoyer ma demande';
            btnSubmit.disabled = false;
        })
        .catch(error => {
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
// PHONE & EMAIL VALIDATION
// ========================

function setupPhoneValidation() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    const phoneGroup = phoneInput.closest('.phone-input-group');

    // Format phone number as user types
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\s/g, ''); // Remove spaces

        // Remove non-numeric characters
        value = value.replace(/\D/g, '');

        // Format with spaces: 6 12 34 56 78
        if (value.length > 0) {
            let formatted = '';
            for (let i = 0; i < value.length && i < 9; i++) {
                if (i === 1 || i === 3 || i === 5 || i === 7) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            e.target.value = formatted.trim();
        }

        // Validate in real-time
        validatePhone(e.target.value, phoneGroup);
    });

    // Validate on blur
    phoneInput.addEventListener('blur', function (e) {
        validatePhone(e.target.value, phoneGroup);
    });
}

function validatePhone(value, phoneGroup) {
    const cleanValue = value.replace(/\s/g, '');

    // French mobile phone validation (must start with 6 or 7 for mobile, or 1-5 for landline)
    // Format: 9 digits without the leading 0
    const phoneRegex = /^[1-7]\d{8}$/;

    if (phoneGroup) {
        phoneGroup.classList.remove('error', 'success');

        if (value === '') {
            // Empty - neutral state
            return false;
        } else if (phoneRegex.test(cleanValue)) {
            // Valid
            phoneGroup.classList.add('success');
            return true;
        } else {
            // Invalid
            phoneGroup.classList.add('error');
            return false;
        }
    }

    return phoneRegex.test(cleanValue);
}

function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;

    // Validate on input with debounce
    let emailTimeout;
    emailInput.addEventListener('input', function (e) {
        clearTimeout(emailTimeout);
        emailTimeout = setTimeout(() => {
            validateEmail(e.target);
        }, 500);
    });

    // Validate on blur
    emailInput.addEventListener('blur', function (e) {
        validateEmail(e.target);
    });
}

function validateEmail(emailInput) {
    const value = emailInput.value.trim();

    // Professional email validation
    // - Must have @ and domain
    // - Must have proper domain extension
    // - No spaces allowed
    // - Reject common free email services for professional context (optional)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Common free email providers (for warning, not blocking)
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'free.fr', 'orange.fr', 'laposte.net'];
    const domain = value.split('@')[1]?.toLowerCase();

    if (value === '') {
        // Empty - neutral state
        emailInput.style.borderColor = '';
        return false;
    } else if (emailRegex.test(value)) {
        // Valid format
        if (freeProviders.includes(domain)) {
            // Valid but it's a free email (show warning color but accept it)
            emailInput.style.borderColor = 'var(--color-warning)';
        } else {
            // Valid professional email
            emailInput.style.borderColor = 'var(--color-success)';
        }
        return true;
    } else {
        // Invalid
        emailInput.style.borderColor = '#ef4444';
        return false;
    }
}

// ========================
// ENHANCED CONTACT FORM VALIDATION
// ========================

function handleContactSubmit(e) {
    e.preventDefault();

    // Collect form data
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();

    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
    const availability = Array.from(availabilityCheckboxes).map(cb => cb.value);

    const rgpd = document.getElementById('rgpd').checked;

    // Basic validation
    if (!lastName || !firstName || !email || !phone || !location) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (!validateEmail(emailInput)) {
        alert('Veuillez entrer une adresse email valide.');
        emailInput.focus();
        return;
    }

    // Phone validation
    const phoneGroup = document.getElementById('phone').closest('.phone-input-group');
    if (!validatePhone(phone, phoneGroup)) {
        alert('Veuillez entrer un numéro de téléphone français valide (9 chiffres sans le 0).');
        document.getElementById('phone').focus();
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

    // Format phone for storage (add +33 prefix)
    const cleanPhone = phone.replace(/\s/g, '');
    const formattedPhone = '+33' + cleanPhone;

    // Update state
    appState.contact = {
        lastName,
        firstName,
        email,
        phone: formattedPhone,
        location,
        availability
    };

    // Save to localStorage
    saveToLocalStorage();

    // Send email via EmailJS
    sendEmailNotification();
}


