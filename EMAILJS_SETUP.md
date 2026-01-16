# Cash Admin - Configuration EmailJS

## Étape 1 : Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (200 emails/mois inclus)
3. Confirmez votre adresse email

## Étape 2 : Configurer le service email

1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** (ex: `service_abc1234`)

## Étape 3 : Créer le template d'email

1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Copiez-collez le template suivant :

### Template Name
`cash_admin_lead`

### Subject
```
Nouveau lead Cash Admin - {{firstName}}
```

### Content
```
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
```

4. Notez le **Template ID** (ex: `template_xyz5678`)

## Étape 4 : Obtenir votre Public Key

1. Allez dans **Account** > **General**
2. Trouvez votre **Public Key** (ex: `abc123XYZ456def789`)

## Étape 5 : Configurer l'application

Ouvrez le fichier `app.js` et remplacez les valeurs suivantes (lignes 23-27) :

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_abc1234',     // Votre Service ID
    templateId: 'template_xyz5678',   // Votre Template ID
    publicKey: 'abc123XYZ456def789'   // Votre Public Key
};
```

## Étape 6 : Tester

1. Ouvrez `index.html` dans votre navigateur
2. Complétez le formulaire
3. Vérifiez que vous recevez l'email avec toutes les informations

## Mode démo (sans EmailJS)

Si vous ne configurez pas EmailJS, l'application fonctionne quand même en mode démo :
- Les données sont sauvegardées dans `localStorage` sous la clé `cashAdminSubmissions`
- Vous pouvez les consulter via la console du navigateur :
  ```javascript
  JSON.parse(localStorage.getItem('cashAdminSubmissions'))
  ```

## Limites du plan gratuit

- 200 emails/mois
- 1 utilisateur
- 2 templates d'email

Pour plus de volume, passez au plan payant ou utilisez un backend personnalisé.
