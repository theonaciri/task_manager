# Gestionnaire de Tâches - Laravel & React

Une application de gestion de tâches complète avec backend Laravel 9 et frontend React 17 utilisant Redux pour la gestion d'état.

## 🚀 Fonctionnalités

### Backend (Laravel 9)

- ✅ API REST complète pour les projets et tâches
- ✅ Validation des données avec Form Requests
- ✅ Relations Eloquent entre projets et tâches
- ✅ Ressources API pour formater les réponses JSON
- ✅ Tâche planifiée pour les rappels de tâches anciennes
- ✅ Configuration CORS pour le frontend
- ✅ Base de données SQLite pour la simplicité

### Frontend (React 17 + Redux)

- ✅ Redux Toolkit pour la gestion d'état
- ✅ React Router pour la navigation
- ✅ Pages complètes : liste des projets, détails, formulaires
- ✅ Gestion des états de chargement, succès et erreur
- ✅ Filtrage des tâches par statut
- ✅ Confirmation avant suppression
- ✅ Interface utilisateur moderne et responsive

### Fonctionnalités Métier

- ✅ Gestion des projets (CRUD complet)
- ✅ Gestion des tâches associées aux projets (CRUD complet)
- ✅ Statuts de tâches : 'pending', 'in_progress', 'completed'
- ✅ Rappels automatiques pour tâches anciennes (>7 jours)
- ✅ Interface de filtrage et recherche
- ✅ **Pagination** pour projets et tâches
- ✅ **Recherche textuelle** dans les projets et tâches
- ✅ **Filtres combinés** (statut, projet, recherche) pour les tâches
- ✅ Navigation intuitive avec contrôles de pagination

## 📁 Structure du Projet

```
tasks_manager/
├── backend/                 # API Laravel 9
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/
│   │   │       └── SendTaskReminders.php
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── ProjectController.php
│   │   │   │   └── TaskController.php
│   │   │   ├── Requests/
│   │   │   │   ├── StoreProjectRequest.php
│   │   │   │   ├── UpdateProjectRequest.php
│   │   │   │   ├── StoreTaskRequest.php
│   │   │   │   └── UpdateTaskRequest.php
│   │   │   └── Resources/
│   │   │       ├── ProjectResource.php
│   │   │       ├── ProjectWithTasksResource.php
│   │   │       └── TaskResource.php
│   │   └── Models/
│   │       ├── Project.php
│   │       └── Task.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── frontend/                # Application React
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   │   ├── Layout.jsx
    │   │   ├── Button.jsx
    │   │   ├── Loading.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   └── Modal.jsx
    │   ├── pages/          # Pages principales
    │   │   ├── ProjectsList.jsx
    │   │   ├── ProjectDetails.jsx
    │   │   ├── ProjectForm.jsx
    │   │   └── TaskForm.jsx
    │   ├── services/       # Services API
    │   │   ├── api.js
    │   │   ├── projectService.js
    │   │   └── taskService.js
    │   ├── store/          # Redux Store
    │   │   ├── index.js
    │   │   └── slices/
    │   │       ├── projectsSlice.js
    │   │       └── tasksSlice.js
    │   └── App.jsx
    └── package.json
```

## 🛠️ Installation et Configuration

### Prérequis

- PHP 8.1 ou supérieur
- Composer
- Node.js 16+ et npm
- SQLite (ou autre base de données supportée par Laravel)

### Installation du Backend (Laravel)

1. **Naviguer vers le dossier backend**

   ```bash
   cd backend
   ```

2. **Installer les dépendances PHP**

   ```bash
   composer install
   ```

3. **Configurer l'environnement**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configurer la base de données** (déjà configuré pour SQLite)

   ```bash
   # Le fichier .env est déjà configuré pour SQLite
   # DB_CONNECTION=sqlite
   # DB_DATABASE=/chemin/vers/database.sqlite
   ```

5. **Créer la base de données et exécuter les migrations**

   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

6. **Démarrer le serveur**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

### Installation du Frontend (React)

1. **Naviguer vers le dossier frontend**

   ```bash
   cd frontend
   ```

2. **Installer les dépendances Node.js**

   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible sur :

- **Backend API** : http://localhost:8000/api
- **Frontend** : http://localhost:5173 (ou 5174 si 5173 est occupé)

## 📋 Utilisation

### Accès à l'application

1. Ouvrir http://localhost:5173 dans votre navigateur
2. Vous arriverez sur la liste des projets
3. Cliquer sur "Nouveau projet" pour créer un projet
4. Cliquer sur "Voir détails" pour voir les tâches d'un projet
5. Ajouter des tâches depuis la page de détails d'un projet

### Tâche planifiée

La tâche planifiée s'exécute automatiquement chaque jour à 9h00 pour envoyer des rappels pour les tâches en attente créées depuis plus de 7 jours.

**Test manuel :**

```bash
cd backend
php artisan tasks:send-reminders
```

Les rappels sont simulés avec `Log::info()` et visibles dans `storage/logs/laravel.log`.

## 🧪 Tests

### Test de l'API

- **Projets** : GET http://localhost:8000/api/projects
- **Tâches** : GET http://localhost:8000/api/tasks
- **Projet spécifique** : GET http://localhost:8000/api/projects/1

### Test de la tâche planifiée

```bash
php artisan tasks:send-reminders
```

## 🎨 Interface Utilisateur

L'interface utilise CSS moderne avec :

- Design responsive
- Gradients colorés
- Animations fluides
- États de chargement visuels
- Messages d'erreur clairs
- Modales de confirmation

## 🔧 Technologies Utilisées

### Backend

- **Laravel 9** - Framework PHP
- **Eloquent ORM** - Relations entre modèles
- **API Resources** - Formatage des réponses JSON
- **Form Requests** - Validation des données
- **Task Scheduling** - Tâches planifiées
- **SQLite** - Base de données

### Frontend

- **React 17** - Interface utilisateur
- **Redux Toolkit** - Gestion d'état
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Vite** - Build tool moderne
- **CSS Modules** - Styles scopés

## 🚦 Statuts des Tâches

- **pending** : Tâche en attente
- **in_progress** : Tâche en cours
- **completed** : Tâche terminée

## 📝 API Endpoints

### Projets

- `GET /api/projects` - Liste des projets
  - **Paramètres** :
    - `page` : Numéro de page (défaut: 1)
    - `per_page` : Nombre d'éléments par page (défaut: 10)
    - `search` : Recherche par nom de projet
  - **Exemple** : `/api/projects?page=2&per_page=5&search=web`
- `POST /api/projects` - Créer un projet
- `GET /api/projects/{id}` - Détails d'un projet avec tâches
- `PUT /api/projects/{id}` - Modifier un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Tâches

- `GET /api/tasks` - Liste des tâches (avec filtres et pagination)
  - **Paramètres** :
    - `page` : Numéro de page (défaut: 1)
    - `per_page` : Nombre d'éléments par page (défaut: 10)
    - `search` : Recherche par titre de tâche
    - `status` : Filtrer par statut (pending, in_progress, completed)
    - `project_id` : Filtrer par projet
  - **Exemple** : `/api/tasks?page=1&per_page=5&search=homepage&status=pending&project_id=1`
- `POST /api/tasks` - Créer une tâche
- `GET /api/tasks/{id}` - Détails d'une tâche
- `PUT /api/tasks/{id}` - Modifier une tâche
- `DELETE /api/tasks/{id}` - Supprimer une tâche

### Formats de réponse

**Réponse paginée :**

```json
{
  "data": [...],
  "links": {
    "first": "url",
    "last": "url",
    "prev": "url",
    "next": "url"
  },
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

## 🎯 Fonctionnalités Avancées

### Pagination

- **Contrôles intuitifs** : Boutons précédent/suivant, numéros de page
- **Informations contextuelles** : "Affichage de X à Y sur Z éléments"
- **Navigation intelligente** : Ellipses pour les grandes listes de pages
- **Responsive** : Adapté aux écrans mobiles et desktop

### Recherche et Filtres

- **Recherche en temps réel** : Recherche instantanée dans les projets et tâches
- **Filtres combinés** : Statut + projet + recherche textuelle
- **Interface claire** : Boutons pour effacer les filtres
- **États de chargement** : Indicateurs visuels pendant les requêtes

### Interface Utilisateur

- **Page dédiée aux tâches** : Liste complète avec navigation `/tasks`
- **Cartes visuelles** : Design moderne avec badges de statut colorés
- **Modales de confirmation** : Sécurité avant suppression
- **Messages d'état** : Feedback clair pour toutes les actions

## 👥 Développement

### Structure des commits

Le projet utilise des commits conventionnels :

- `feat:` - Nouvelles fonctionnalités
- `fix:` - Corrections de bugs
- `docs:` - Documentation
- `style:` - Formatage
- `refactor:` - Refactoring

### Qualité du code

- Code PSR-12 compliant (PHP)
- ESLint configuration (JavaScript)
- Validation stricte des données
- Gestion d'erreurs complète

## 🐛 Dépannage

### Avertissements connus

**PHP Deprecation Warning (Laravel 9 + PHP 8.1+)**
```
PHP Deprecated: Illuminate\Log\Logger::__construct(): Implicitly marking parameter $dispatcher as nullable is deprecated
```
**Solution** : Cette dépréciation est liée à Laravel 9.x avec PHP 8.1+. Elle n'affecte pas le fonctionnement de l'application et sera corrigée dans Laravel 10. Pour supprimer l'avertissement :
- Mettre à jour vers Laravel 10+ (recommandé)
- Ou ignorer l'avertissement qui n'affecte pas les fonctionnalités

**Erreurs de développement courantes**
- **Port 5173 occupé** : Vite utilisera automatiquement 5174 ou un autre port disponible
- **CORS errors** : Vérifier que l'API backend fonctionne sur http://localhost:8000
- **Database errors** : Vérifier que `database/database.sqlite` existe et que les migrations ont été exécutées

## 🔮 Améliorations Possibles

- [ ] Tests unitaires (PHPUnit + Jest)
- [ ] Pagination des listes
- [ ] Recherche avancée
- [ ] Authentification utilisateur
- [ ] Notifications en temps réel
- [ ] Export des données
- [ ] Tableau de bord avec statistiques

## 📄 Licence

Ce projet est développé comme test technique. Tous droits réservés.

---

**Développé avec ❤️ en Laravel 9 & React 17**
