// Constantes pour les calculs
const MOIS_PAR_AN = 12;
const JOURS_PAR_MOIS = 30;
const COMMISSION_FORMULE1 = 0.20;
const COMMISSION_FORMULE2 = 0.80;
const COMMISSION_FORMULE3 = 1.00;

// Coefficients saisonniers pour le taux d'occupation
const COEFF_HAUTE_SAISON = 1.2;    // +20% en haute saison
const COEFF_MOYENNE_SAISON = 1.0;  // Taux normal en moyenne saison
const COEFF_BASSE_SAISON = 0.8;    // -20% en basse saison

let currentStep = 1;
const totalSteps = 4;

// État global de la simulation
const simulationState = {
    categorie1: '',           // Type de formule (achat-tiny ou location)
    categorie2: '',           // Mode de gestion
    prixNuit: 90,            // Prix par nuit par défaut
    tauxOccupation: 50,      // Taux d'occupation par défaut
    nbTerrains: 1,           // Nombre de terrains par défaut
    optionMaintenance: false, // Option de maintenance
    mensualiteMaintenance: 50 // Mensualité de maintenance par défaut
};

function updateStepIndicators() {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index + 1 === currentStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function updateStepContent() {
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Mise à jour des boutons de navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
        nextBtn.innerHTML = 'Terminer <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepIndicators();
        updateStepContent();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicators();
        updateStepContent();
    }
}

function selectFormula(formula) {
    simulationState.categorie1 = formula;
    document.querySelectorAll('#step1 .formula-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Si c'est un achat de Tiny House, on passe directement aux paramètres
    if (formula === 'achat-tiny') {
        simulationState.categorie2 = 'proprietaire';  // Mode propriétaire par défaut
        currentStep = 3;  // On passe directement à l'étape des paramètres
        updateStepIndicators();
        updateStepContent();
    } else {
        nextStep();  // Sinon on va à l'étape de choix de gestion
    }
    updateResultatsSimulation();
    updateDetailsFormule();  // Mettre à jour les détails immédiatement
}

function selectManagement(management) {
    simulationState.categorie2 = management;
    document.querySelectorAll('#step2 .formula-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    updateResultatsSimulation();
    updateDetailsFormule();  // Mettre à jour les détails immédiatement
    nextStep();
}

// Validation des inputs généraux
function validateInput(inputId) {
    const input = document.getElementById(inputId);
    let value = parseFloat(input.value);
    
    if (isNaN(value) || value < 0) {
        alert('Veuillez entrer un nombre valide');
        return;
    }

    // Validation spécifique selon le champ
    switch (inputId) {
        case 'prix-nuit':
            if (value < 50) {
                alert('Le prix minimum est de 50€ par nuit');
                return;
            }
            simulationState.prixNuit = value;
            break;
        case 'taux-occupation':
            if (value > 100) {
                alert('Le taux d\'occupation ne peut pas dépasser 100%');
                return;
            }
            simulationState.tauxOccupation = value;
            break;
        case 'nb-terrains':
            if (value < 1) {
                alert('Le nombre de terrains doit être au moins 1');
                return;
            }
            simulationState.nbTerrains = value;
            break;
    }

    // Ajouter la classe validated au bouton
    const btn = input.nextElementSibling;
    btn.classList.add('validated');
    
    // Retirer la classe après 1 seconde
    setTimeout(() => {
        btn.classList.remove('validated');
    }, 1000);

    updateResultatsSimulation();
    updateDetailsFormule();  // Mettre à jour les détails après chaque validation
}

function calculRevenuBrut() {
    // Validation des valeurs
    const prixNuit = Math.max(0, simulationState.prixNuit || 0);
    const tauxOccupation = Math.min(100, Math.max(0, simulationState.tauxOccupation || 0));
    const nbTerrains = Math.max(1, simulationState.nbTerrains || 1);

    // Calcul des revenus de base pour la location par terrain
    // Location courte durée limitée à 3 mois par an par terrain (loi française)
    const revenusParTerrain = prixNuit * 30 * (tauxOccupation / 100) * 3;
    
    // Multiplication par le nombre de terrains
    const revenusBase = revenusParTerrain * nbTerrains;
    
    return revenusBase;
}

function updateResultatsSimulation() {
    try {
        const revenuBrut = calculRevenuBrut();
        let partProprietaire = 0;
        let partGestionnaire = 0;

        // Calcul selon le type de formule
        if (simulationState.categorie1 === 'achat-tiny') {
            // Pour l'achat, 100% des revenus vont au propriétaire
            partProprietaire = revenuBrut;
            // Déduire les frais de maintenance si l'option est choisie
            if (simulationState.optionMaintenance) {
                partProprietaire -= (simulationState.mensualiteMaintenance || 50) * 12;
            }
            partGestionnaire = 0;
        } else if (simulationState.categorie2 === 'clefs-en-main') {
            // 20% propriétaire, 80% gestionnaire
            partProprietaire = revenuBrut * COMMISSION_FORMULE1;
            partGestionnaire = revenuBrut * COMMISSION_FORMULE2;
        } else {
            // 40% propriétaire, 60% gestionnaire
            partProprietaire = revenuBrut * 0.4;
            partGestionnaire = revenuBrut * 0.6;
        }

        // S'assurer que les valeurs sont positives et arrondies
        partProprietaire = Math.max(0, Math.round(partProprietaire * 100) / 100);
        partGestionnaire = Math.max(0, Math.round(partGestionnaire * 100) / 100);
        const revenuBrutArrondi = Math.round(revenuBrut * 100) / 100;

        // Mise à jour de l'affichage seulement si les éléments existent
        const revenuBrutElement = document.getElementById('revenu-brut');
        const partProprietaireElement = document.getElementById('part-proprietaire');
        const partGestionnaireElement = document.getElementById('part-gestionnaire');

        if (revenuBrutElement) revenuBrutElement.textContent = revenuBrutArrondi.toFixed(2);
        if (partProprietaireElement) partProprietaireElement.textContent = partProprietaire.toFixed(2);
        if (partGestionnaireElement) partGestionnaireElement.textContent = partGestionnaire.toFixed(2);

    } catch (error) {
        console.error('Erreur dans le calcul des résultats:', error);
    }
}

function updateDetailsFormule() {
    const detailsContent = document.getElementById('details-formule-content');
    const maintenanceOption = document.getElementById('maintenance-option');
    
    // Afficher/cacher l'option de maintenance selon la formule
    if (simulationState.categorie1 === 'achat-tiny') {
        maintenanceOption.style.display = 'block';
    } else {
        maintenanceOption.style.display = 'none';
        simulationState.optionMaintenance = false;  // Désactiver l'option si on change de formule
    }

    // Mettre à jour le texte des détails
    let details = '<ul class="formule-details">';
    
    if (simulationState.categorie1 === 'achat-tiny') {
        details += `
            <li>✓ Achat de Tiny House</li>
            <li>✓ 100% des revenus locatifs pour vous</li>
            <li>✓ Prix par nuit : ${simulationState.prixNuit}€</li>
            <li>✓ Taux d'occupation : ${simulationState.tauxOccupation}%</li>
            <li>✓ Nombre de terrains : ${simulationState.nbTerrains}</li>
            ${simulationState.optionMaintenance ? '<li>✓ Services et maintenance inclus (150€/mois)</li>' : ''}
        `;
    } else {
        details += `
            <li>✓ Location courte durée (max 3 mois/an)</li>
            <li>✓ Mode de gestion : ${simulationState.categorie2 === 'clefs-en-main' ? 'Clefs en Main (20/80)' : 'Gestion Autonome (40/60)'}</li>
            <li>✓ Prix par nuit : ${simulationState.prixNuit}€</li>
            <li>✓ Taux d'occupation : ${simulationState.tauxOccupation}%</li>
            <li>✓ Nombre de terrains : ${simulationState.nbTerrains}</li>
        `;
    }
    
    details += '</ul>';
    detailsContent.innerHTML = details;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des valeurs par défaut
    document.getElementById('prix-nuit').value = simulationState.prixNuit;
    document.getElementById('taux-occupation').value = simulationState.tauxOccupation;
    document.getElementById('nb-terrains').value = simulationState.nbTerrains;
    
    // Mise à jour initiale des résultats et détails
    updateResultatsSimulation();
    updateDetailsFormule();
    updateStepIndicators();
    
    // Initialiser l'affichage de l'option maintenance
    const maintenanceOption = document.getElementById('maintenance-option');
    if (maintenanceOption) {
        maintenanceOption.style.display = simulationState.categorie1 === 'achat-tiny' ? 'block' : 'none';
    }
});
