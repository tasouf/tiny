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
    prixNuit: 150,
    tauxOccupation: 50,
    nbTerrains: 1,
    categorie1: 'location-courte',
    categorie2: 'clefs-en-main',
    mensualiteMaintenance: 150
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
    updateResultatsSimulation();
    nextStep();
}

function selectManagement(management) {
    simulationState.categorie2 = management;
    document.querySelectorAll('#step2 .formula-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    updateResultatsSimulation();
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

    // Validation spécifique selon le type d'input
    switch (inputId) {
        case 'prix-nuit':
            if (value < 10) {
                alert('Le prix par nuit doit être d\'au moins 10€');
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
                alert('Le nombre de terrains doit être d\'au moins 1');
                return;
            }
            simulationState.nbTerrains = value;
            break;
        case 'mensualite':
            if (value < 50) {
                alert('La mensualité de maintenance doit être d\'au moins 50€');
                return;
            }
            simulationState.mensualiteMaintenance = value;
            break;
    }

    // Feedback visuel pour les boutons
    const button = input.nextElementSibling;
    if (button && button.classList.contains('validate-btn')) {
        button.classList.add('validated');
        setTimeout(() => button.classList.remove('validated'), 1000);
    }

    updateResultatsSimulation();
    updateDetailsFormule();
}

// Calcul et mise à jour des résultats de simulation
function updateResultatsSimulation() {
    let revenusEstimes = 0;
    let partPartenaire = 0;
    let notrePart = 0;

    // Calcul des revenus de base pour la location par terrain
    // Location courte durée limitée à 3 mois par an par terrain (loi française)
    const revenusParTerrain = simulationState.prixNuit * 30 * (simulationState.tauxOccupation / 100) * 3;
    // Multiplication par le nombre de terrains
    const revenusBase = revenusParTerrain * simulationState.nbTerrains;
    
    console.log('Revenus par terrain (3 mois):', revenusParTerrain);
    console.log('Revenus totaux calculés:', revenusBase);

    if (simulationState.categorie1 === 'location-courte') {
        revenusEstimes = revenusBase;
        
        if (simulationState.categorie2 === 'clefs-en-main') {
            notrePart = revenusEstimes * 0.8;
            partPartenaire = revenusEstimes * 0.2;
        } else {
            notrePart = revenusEstimes * 0.6;
            partPartenaire = revenusEstimes * 0.4;
        }
    } else {
        revenusEstimes = revenusBase;
        notrePart = simulationState.mensualiteMaintenance * 12 * simulationState.nbTerrains;
        partPartenaire = revenusEstimes;
    }

    // Mise à jour de l'affichage
    document.getElementById('revenus-estimes-value').textContent = Math.round(revenusEstimes).toLocaleString('fr-FR');
    document.getElementById('part-partenaire-value').textContent = Math.round(partPartenaire).toLocaleString('fr-FR');
    document.getElementById('notre-part-value').textContent = Math.round(notrePart).toLocaleString('fr-FR');
    
    updateDetailsFormule();
}

function updateDetailsFormule() {
    const detailsContent = document.getElementById('details-formule-content');
    let html = '<ul class="formule-details">';

    if (simulationState.categorie1 === 'location-courte') {
        html += `<li>✓ Location courte durée (< 3 mois)</li>`;
        if (simulationState.categorie2 === 'clefs-en-main') {
            html += `
                <li>✓ Nous gérons tout :</li>
                <li class="sub-item">- Entretien de la Tiny House</li>
                <li class="sub-item">- Gestion des locations</li>
                <li class="sub-item">- Service client</li>
                <li>✓ Répartition des revenus :</li>
                <li class="sub-item">- 80% pour nous</li>
                <li class="sub-item">- 20% pour vous</li>
            `;
        } else {
            html += `
                <li>✓ Gestion autonome</li>
                <li>✓ Répartition des revenus :</li>
                <li class="sub-item">- 60% pour nous</li>
                <li class="sub-item">- 40% pour vous</li>
            `;
        }
    } else {
        html += `
            <li>✓ Achat de Tiny House</li>
            <li>✓ 100% des revenus locatifs pour vous</li>
            <li>✓ Forfait maintenance mensuel : ${simulationState.mensualiteMaintenance}€</li>
        `;
    }

    html += '</ul>';
    detailsContent.innerHTML = html;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des valeurs par défaut
    document.getElementById('prix-nuit').value = simulationState.prixNuit;
    document.getElementById('taux-occupation').value = simulationState.tauxOccupation;
    document.getElementById('nb-terrains').value = simulationState.nbTerrains;
    
    // Calcul initial
    updateResultatsSimulation();
    updateDetailsFormule();
    updateStepIndicators();
    updateStepContent();
});
