# OpenBusser Web 🚌

Une plateforme web moderne et sécurisée pour gérer et contrôler les appareils IoT OpenBusser avec détection automatique des appareils et partage d'accès transparent.

## ✨ Fonctionnalités

- 🔐 **Détection Automatique d'Appareils** - Connexion automatique lorsque votre appareil est détecté sur le réseau
- 🎨 **Interface Moderne Sombre** - Interface belle et responsive avec animations fluides
- 🔗 **Partage d'Accès** - Génération de liens d'invitation sécurisés pour partager le contrôle des appareils
- 📊 **Tableau de Bord Temps Réel** - Surveillance du statut des appareils, connexions et statistiques
- 🔒 **Sessions Sécurisées** - Sessions liées à l'IP avec empreinte digitale du navigateur
- 👥 **Support Multi-utilisateurs** - Partage d'accès avec plusieurs utilisateurs en toute sécurité
- 📱 **Design Responsive** - Fonctionne parfaitement sur bureau et mobile

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn comme gestionnaire de packages
- API OpenBusser en cours d'exécution sur localhost:8000

### Installation

1. **Cloner le dépôt :**
```bash
git clone <repository-url>
cd ob.skraog.dev-web
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Démarrer le serveur de développement :**
```bash
npm run dev
```

4. **Ouvrir votre navigateur :**
Naviguer vers [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

### Connexion de Votre Appareil

1. Allumez votre appareil OpenBusser
2. Assurez-vous qu'il est connecté au même réseau que votre ordinateur
3. Ouvrez l'application web - elle détectera et se connectera automatiquement à votre appareil
4. Vous serez redirigé vers le tableau de bord une fois authentifié

### Partage d'Accès

1. Aller au Tableau de Bord
2. Sélectionner un appareil dans le menu déroulant
3. Cliquer sur "Générer un Lien d'Invitation"
4. Partager le lien avec d'autres pour leur accorder l'accès
5. Les invitations expirent après 24 heures par défaut

### Gestion des Sessions

- Voir toutes les sessions actives dans la page **Tableau de Bord**
- Révoquer des sessions individuelles ou toutes les autres sessions
- Les sessions sont automatiquement protégées par liaison IP et empreinte digitale du navigateur

## 🏗️ Structure du Projet

```
ob.skraog.dev-web/
├── src/
│   ├── app/                    # Répertoire d'application Next.js
│   │   ├── api/               # Routes API (proxy vers localhost:8000)
│   │   ├── dashboard/         # Pages du tableau de bord
│   │   ├── invite/            # Pages d'acceptation d'invitation
│   │   └── page.tsx           # Page d'accueil
│   ├── lib/                   # Utilitaires et clients API
│   │   ├── api.ts            # Client API OpenBusser
│   │   ├── types.ts          # Définitions TypeScript
│   │   └── utils.ts          # Fonctions utilitaires
├── public/                    # Assets statiques
└── package.json
```

## 🔒 Fonctionnalités de Sécurité

- **Liaison IP** : Sessions liées à votre adresse IP
- **Empreinte Digitale du Navigateur** : Sessions liées à votre navigateur spécifique
- **Timeout d'Inactivité** : Déconnexion automatique après 30 minutes d'inactivité
- **Protection contre la Force Brute** : Protection contre les attaques par force brute
- **Invitations Sécurisées** : Codes d'accès à durée limitée avec jetons à usage unique

## 🛠️ Développement

### Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Démarrer le serveur de production
- `npm run lint` - Exécuter ESLint

### Stack Technologique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Gestion d'État** : React Hooks
- **API** : REST (proxy vers localhost:8000)

## 📋 Points d'Accès API

Toutes les routes API sont des proxies vers `http://localhost:8000/api/` :

### Bussers (Applications de Bureau)
- `POST /api/busser/register` - Enregistrer un nouveau busser
- `GET /api/busser/list` - Lister les bussers du même IP

### Sessions (Clients Navigateur)  
- `POST /api/session/register` - Enregistrer une nouvelle session
- `POST /api/session/heartbeat` - Envoyer un heartbeat de session
- `POST /api/session/assign` - Assigner un busser à une session
- `POST /api/session/match` - **Trouver les bussers disponibles** (point d'accès clé)
- `GET /api/session/list` - Lister les sessions du même IP

### Invitations
- `POST /api/invite/create` - Créer une invitation de tâche
- `GET /api/invite/list` - Lister les invitations du même IP

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

## 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

## 💡 Conseils

- Gardez votre firmware d'appareil à jour
- Vérifiez régulièrement les sessions actives pour la sécurité
- Utilisez des codes d'invitation forts et uniques lors du partage d'accès
- Surveillez le statut de l'appareil depuis le tableau de bord

---

**Fait avec ❤️ par l'équipe OpenBusser**
