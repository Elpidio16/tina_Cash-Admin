# Cash Admin - Simulateur de Coût Administratif

Application web complète permettant aux indépendants, TPE et professions libérales de mesurer le coût caché de leur administratif et d'identifier leurs besoins.

## 🎯 Fonctionnalités

### Phase 1 : Calcul du coût
- Saisie du temps administratif hebdomadaire
- Saisie de la valeur horaire
- Calcul automatique du coût mensuel et annuel
- Affichage d'un message de déclic économique

### Phase 2 : Qualification du besoin
- Formulaire de 3 questions rapides (< 30 secondes)
- Détection automatique du besoin selon 6 catégories :
  - Gestion administrative et financière
  - Gestion administrative courante
  - Organisation administrative
  - Assistance administrative / direction
  - Accompagnement administratif personnalisé
  - Besoin administratif général
- Message personnalisé basé sur les réponses
- Formulaire de contact conditionnel
- Conformité RGPD

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucun serveur requis pour le développement local

### Lancement en local

1. Clonez ou téléchargez ce dossier
2. Ouvrez `index.html` dans votre navigateur
3. C'est tout ! L'application fonctionne immédiatement

### Hébergement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```
3. Dans ce dossier, exécutez :
   ```bash
   vercel
   ```
4. Suivez les instructions pour déployer

## 📧 Configuration EmailJS

Pour recevoir les données du formulaire par email :

1. Suivez le guide complet dans [EMAILJS_SETUP.md](EMAILJS_SETUP.md)
2. Créez un compte gratuit sur [EmailJS](https://www.emailjs.com)
3. Configurez votre service et template
4. Ajoutez vos identifiants dans `app.js` (lignes 23-27)

**Mode démo** : Sans configuration EmailJS, les données sont stockées dans `localStorage` et consultables via la console.

## 📁 Structure des fichiers

```
V1/
├── index.html           # Structure HTML complète
├── styles.css           # Design system premium
├── app.js              # Logique applicative complète
├── EMAILJS_SETUP.md    # Guide de configuration EmailJS
└── README.md           # Ce fichier
```

## 🎨 Design

L'application utilise un design moderne avec :
- Palette de couleurs violet/rose dynamique
- Effets glassmorphism
- Animations fluides
- Responsive (mobile-first)
- Police Inter de Google Fonts

## 💾 Stockage des données

- **localStorage** : Sauvegarde automatique de la progression utilisateur
- **EmailJS** : Envoi des données de contact par email
- Aucune base de données requise

## 🔒 RGPD

- Checkbox de consentement obligatoire
- Message de transparence sur l'utilisation des données
- Aucun tracking ou cookies tiers

## 🧪 Test de l'application

1. **Phase 1** : Entrez des heures (ex: 5h/semaine) et un taux horaire (ex: 50€/h)
2. Vérifiez les calculs :
   - Mensuel : 5 × 4.33 × 50 = 1 082,50€
   - Annuel : 1 082,50 × 12 = 12 990€
3. **Phase 2** : Sélectionnez des tâches (ex: URSSAF + TVA)
4. Vérifiez la détection : devrait afficher "Gestion administrative et financière"
5. **Contact** : Remplissez le formulaire et vérifiez l'email reçu

## 📊 Détection des besoins

L'algorithme de détection fonctionne par priorité :

1. **Gestion financière** : URSSAF, TVA, comptable
2. **Gestion courante** : Devis, factures, relances
3. **Organisation** : Classement, reporting, échéances
4. **Assistance** : Emails, agenda, suivi clients
5. **Personnalisé** : Admin personnel, courriers
6. **Général** : Par défaut

## 🌐 Navigateurs supportés

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Personnalisation

### Modifier les couleurs
Éditez les variables CSS dans `styles.css` (lignes 1-20)

### Modifier les messages
Éditez `app.js` :
- Messages d'impact : fonction `generateImpactMessage()` (ligne 127)
- Catégories de besoins : fonction `detectNeed()` (ligne 245)

### Ajouter des tâches
1. Ajoutez l'option dans `index.html` (section Question 1)
2. Mettez à jour la logique dans `app.js` fonction `detectNeed()`

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la console du navigateur (F12)
2. Consultez [EMAILJS_SETUP.md](EMAILJS_SETUP.md) pour EmailJS
3. Vérifiez que tous les fichiers sont au même niveau

## 📄 Licence

© 2026 Cash Admin - Tous droits réservés
