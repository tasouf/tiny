// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Modal functionality
const modals = document.querySelectorAll('.modal');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const closeButtons = document.querySelectorAll('.close');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item h4');

accordionItems.forEach(item => {
    item.addEventListener('click', () => {
        const content = item.nextElementSibling;
        content.classList.toggle('active');
    });
});

// Validation des formulaires
function validateForm(form) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

    // Vérifier les champs requis
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showError(field, 'Ce champ est requis');
        } else {
            field.classList.remove('error');
        }

        // Validation spécifique selon le type
        if (field.type === 'email' && !emailRegex.test(field.value)) {
            isValid = false;
            showError(field, 'Email invalide');
        }
        if (field.type === 'tel' && !phoneRegex.test(field.value)) {
            isValid = false;
            showError(field, 'Numéro de téléphone invalide');
        }
    });

    return isValid;
}

function showError(field, message) {
    // Supprimer l'ancien message d'erreur s'il existe
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Créer et ajouter le nouveau message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// Form submissions
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            alert('Merci pour votre message ! Nous vous recontacterons rapidement.');
            form.reset();
            
            // Si le formulaire est dans une modal, la fermer
            const modal = form.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
});

// Dynamic house cards
const houses = [
    {
        name: 'Tiny House Nature',
        description: 'Vue imprenable sur la vallée',
        price: '90€ / nuit',
        image: 'images/tiny-houses/TI1.jpg'
    },
    {
        name: 'Tiny House Forest',
        description: 'Au cœur de la forêt corrézienne',
        price: '85€ / nuit',
        image: 'images/tiny-houses/20240717-IMG_7182-scaled.webp'
    },
    {
        name: 'Tiny House Lake',
        description: 'En bordure du lac de Vassivière',
        price: '95€ / nuit',
        image: 'images/tiny-houses/365546978.jpg'
    },
    {
        name: 'Tiny House Mountain',
        description: 'Panorama sur les monts de Corrèze',
        price: '92€ / nuit',
        image: 'images/tiny-houses/TI4.jpg'
    }
];

const housesGrid = document.querySelector('.houses-grid');

// Gestion des erreurs de chargement d'images
function handleImageError(img) {
    img.onerror = () => {
        img.src = 'images/tiny-houses/default.jpg';  // Image par défaut
        console.warn(`Impossible de charger l'image: ${img.src}`);
    };
}

// Populate houses grid
function populateHousesGrid() {
    if (!housesGrid) return;  // Vérification que housesGrid existe
    
    housesGrid.innerHTML = '';
    houses.forEach(house => {
        const houseCard = document.createElement('div');
        houseCard.className = 'house-card fade-in';
        
        // Créer l'image et ajouter la gestion d'erreur
        const img = new Image();
        handleImageError(img);
        img.src = house.image;
        
        houseCard.innerHTML = `
            <div class="house-image" style="background-image: url('${house.image}')"></div>
            <div class="house-info">
                <h3>${house.name}</h3>
                <p>${house.description}</p>
                <p class="price">${house.price}</p>
                <button class="modal-trigger" data-modal="bookingModal">Voir les disponibilités</button>
            </div>
        `;
        housesGrid.appendChild(houseCard);
    });
}

// Background image rotation for hero section
const landscapes = [
    'images/landscapes/turenne_cpenngraphics.jpg',
    'images/landscapes/beaulieu-sur-dordogne_csebastien_brunie.jpg',
    'images/landscapes/parc-naturel-grandes-causses.jpg',
    'images/landscapes/paysages-correze-1.webp',
    'images/landscapes/paysages-correze.webp'
];

// Change hero background periodically
function rotateHeroBackground() {
    const hero = document.querySelector('.hero');
    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % landscapes.length;
        hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${landscapes[currentIndex]}')`;
    }, 5000); // Change every 5 seconds
}

// Carrousel du hero
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (!slides.length) return;

    let currentSlide = 0;
    const slideInterval = 5000; // Change d'image toutes les 5 secondes

    function nextSlide() {
        // Retire la classe active de la slide courante
        slides[currentSlide].classList.remove('active');
        
        // Passe à la slide suivante (ou revient à la première)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Ajoute la classe active à la nouvelle slide
        slides[currentSlide].classList.add('active');
    }

    // Lance le carrousel automatique
    setInterval(nextSlide, slideInterval);

    // Log pour le débogage
    console.log('Carrousel initialisé avec', slides.length, 'slides');
}

// Initialise le carrousel au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation du carrousel...');
    initHeroSlider();
    if (housesGrid) {
        populateHousesGrid();
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Renommer en scrollObserver pour éviter le conflit
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    scrollObserver.observe(section);
});

// Navigation et Header
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const indicator = document.querySelector('.nav-indicator');

    // Gestion du menu fixe au scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Ajout/suppression de la classe scrolled
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Cache/montre le menu selon la direction du scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Gestion du menu mobile
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Gestion de l'indicateur de navigation
    function updateIndicator(link) {
        const rect = link.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left}px`;
        indicator.style.opacity = '1';
    }

    // Mise à jour de l'indicateur au survol
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => updateIndicator(link));
    });

    navLinksContainer.addEventListener('mouseleave', () => {
        indicator.style.opacity = '0';
    });

    // Mise à jour de la section active au scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
                updateIndicator(link);
            }
        });
    });

    // Animation de défilement fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Ferme le menu mobile si ouvert
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    });
});

// Price calculator for customization
const customizeForm = document.getElementById('customizeForm');
if (customizeForm) {
    const baseModels = {
        'essential': 40000,
        'premium': 75000,
        'luxe': 110000
    };

    const options = {
        'terrasse': 5000,
        'panneaux': 8000,
        'domotique': 3000,
        'cuisine': 4000
    };

    customizeForm.addEventListener('change', () => {
        const selectedModel = customizeForm.querySelector('select').value;
        let totalPrice = baseModels[selectedModel] || 0;

        customizeForm.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const optionName = checkbox.parentElement.textContent.toLowerCase();
            Object.entries(options).forEach(([key, value]) => {
                if (optionName.includes(key)) {
                    totalPrice += value;
                }
            });
        });

        const priceDisplay = customizeForm.querySelector('button');
        priceDisplay.textContent = `Obtenir un devis (${totalPrice.toLocaleString()}€)`;
    });
}

// Tiny Houses Carousel
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.tiny-house-card');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.indicator');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.querySelector('.tiny-house-modal');
    const modalClose = document.querySelector('.modal-close');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap
    
    // Initialisation du carrousel
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Mise à jour des indicateurs
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Gestion des boutons prev/next
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= cards.length - 3 ? '0.5' : '1';
    }
    
    // Navigation
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 3) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Navigation par indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Mise à jour des boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrage des cartes
            cards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Reset du carrousel
            currentIndex = 0;
            updateCarousel();
        });
    });
    
    // Modal
    cards.forEach(card => {
        const detailsButton = card.querySelector('.btn-details');
        detailsButton.addEventListener('click', () => {
            const modalGallery = modal.querySelector('.modal-gallery');
            const modalInfo = modal.querySelector('.modal-info');
            
            // Injection du contenu
            modalGallery.innerHTML = card.querySelector('.card-image').innerHTML;
            modalInfo.innerHTML = `
                <h2>${card.querySelector('h3').textContent}</h2>
                <div class="features">${card.querySelector('.features').innerHTML}</div>
                <p>${card.querySelector('p').textContent}</p>
                <div class="modal-details">
                    <h3>Équipements</h3>
                    <ul>
                        <li>Cuisine équipée</li>
                        <li>Salle de bain avec douche</li>
                        <li>Chambre avec rangements</li>
                        <li>Espace salon convertible</li>
                    </ul>
                    <h3>Caractéristiques techniques</h3>
                    <ul>
                        <li>Structure en bois certifié</li>
                        <li>Isolation haute performance</li>
                        <li>Système de ventilation</li>
                        <li>Chauffage électrique</li>
                    </ul>
                </div>
                <button class="btn-reserve">Réserver maintenant</button>
            `;
            
            modal.classList.add('active');
        });
    });
    
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Fermeture du modal en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Initialisation
    updateCarousel();
});

// Animation des compteurs
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Animation de la timeline
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', () => {
    animateTimeline();
    animateCounters();
});

// Réinitialiser les compteurs quand la section devient visible
const partnerSection = document.querySelector('.partner');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => counter.innerText = '0');
            animateCounters();
        }
    });
}, { threshold: 0.5 });

observer.observe(partnerSection);

// Animation des éléments au scroll
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Effet de parallaxe
function initParallax() {
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallax();
    rotateHeroBackground();
    if (housesGrid) {
        populateHousesGrid();
    }
    animateTimeline();
    animateCounters();
});
