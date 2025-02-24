# Site Vitrine Tiny Houses Corrèze

Une page web de démonstration pour un projet de tiny houses en Corrèze, mettant en avant la location saisonnière, le partenariat avec les propriétaires terriens, et la vente de tiny houses sur mesure.

## Structure du Projet

```
personal-website/
├── index.html      # Page principale
├── styles.css      # Styles CSS
├── script.js       # JavaScript pour l'interactivité
└── images/
    ├── landscapes/     # Photos de paysages corréziens
    └── tiny-houses/    # Photos des différentes tiny houses
```

## Configuration Requise

Pour que le site fonctionne correctement, vous devez ajouter les images suivantes :

Dans le dossier `images/landscapes/` :
- `hero-bg.jpg` : Image de fond du header (paysage corrézien avec tiny house)
- `landscape-1.jpg` à `landscape-5.jpg` : Différentes vues de paysages corréziens

Dans le dossier `images/tiny-houses/` :
- `tiny-nature.jpg` : Photo de la Tiny House Nature
- `tiny-forest.jpg` : Photo de la Tiny House Forest
- `tiny-lake.jpg` : Photo de la Tiny House Lake
- `tiny-house-1.jpg` à `tiny-house-10.jpg` : Photos additionnelles de tiny houses (différents angles, intérieur/extérieur)

### Recommandations pour les Images

- Format recommandé : JPG
- Résolution minimale : 1920x1080px pour hero-bg.jpg
- Résolution minimale : 800x600px pour les autres images
- Taille maximale : 2MB par image

## Fonctionnalités

- Design responsive
- Animations au scroll
- Modals interactifs pour les formulaires
- Calculateur de prix pour la personnalisation
- FAQ avec accordéon
- Formulaires de contact et de réservation

## Personnalisation

Le site utilise une palette de couleurs naturelles que vous pouvez modifier dans le fichier `styles.css` :

```css
:root {
    --color-primary: #2C5530;    /* Vert forêt */
    --color-secondary: #8B7355;  /* Marron */
    --color-accent: #D4B483;     /* Beige */
    --color-background: #F5F5F5; /* Gris clair */
    --color-text: #333333;       /* Texte foncé */
}
```

## Démarrage

1. Clonez ce dépôt
2. Ajoutez vos images dans le dossier `images/`
3. Ouvrez `index.html` dans votre navigateur

## Personnalisation du Contenu

Pour modifier le contenu du site :

1. Textes et descriptions : Modifiez directement dans `index.html`
2. Prix et options : Modifiez les variables dans `script.js`
3. Style et mise en page : Ajustez les styles dans `styles.css`

## Notes

- Le site est uniquement une démonstration statique
- Les formulaires ne sont pas connectés à un backend
- Les réservations et paiements sont simulés
