# AirMentorBug

## Description
AirMentor est une application éducative qui permet aux utilisateurs de créer des cours et d'interagir avec des mentors ou professeurs en temps réel. Pour démontrer l'importance de la sécurité applicative, nous avons volontairement intégré des failles de sécurité dans cette version spéciale nommée AirMentorBug. Ces failles sont analysées et corrigées pour servir d'exemple éducatif sur les bonnes pratiques de sécurité dans le développement des applications web.

L'objectif est de montrer aux développeurs comment identifier, exploiter, et corriger des vulnérabilités critiques, particulièrement dans la logique d'autorisation, afin de rendre les applications plus robustes.

## Setup and Installation
1. Clone the repository
2. docker-compose up

## Failles

### 1. Logique d'Autorisation Permissive (Authorization Bypass)

#### Description

- Une **faille de logique d'autorisation** survient lorsque le mécanisme de contrôle d'accès est mal implémenté, permettant à des utilisateurs non autorisés d'accéder à des ressources ou d'exécuter des actions normalement interdites.
- Dans ce cas précis, la condition permissive permet à un utilisateur d'accéder à une ressource dès qu'il a un rôle quelconque, même si ce rôle n'est pas autorisé pour la ressource ou l'action demandée.

### **Description** :

- Une **faille de logique d'autorisation** survient lorsque le mécanisme de contrôle d'accès est mal implémenté, permettant à des utilisateurs non autorisés d'accéder à des ressources ou d'exécuter des actions normalement interdites.
- Dans ce cas précis, la condition permissive permet à un utilisateur d'accéder à une ressource dès qu'il a un rôle quelconque, même si ce rôle n'est pas autorisé pour la ressource ou l'action demandée.

### **Exploitation** :

- Un attaquant peut manipuler un token JWT pour inclure un rôle minimal valide (ex. : "USER").
- La logique permissive permet d'accéder à des fonctionnalités ou des ressources destinées à des rôles supérieurs (ex. : "ADMIN").
- Par exemple :Résultat : L'accès est autorisé à l'utilisateur ayant le rôle "USER".

```jsx
    GET /api/admin/dashboard
    Authorization: Bearer [token_with_role_user]
```

Faille :

```jsx
const matchingRule = rules.find(
  (rule) => path.startsWith(rule.path) && rule.methods.includes(method) && rule.roles.includes(role)
);

// Faille : Permet l'accès si aucune règle stricte ne correspond mais que l'utilisateur a au moins un rôle
if (!matchingRule) {
  console.log("! No strict matching rule found, allowing access based on role fallback.");
  if (role) { // Permissivité : n'importe quel rôle permet d'accéder
    return next();
  }
}

```


### **Impact** :

- Accès non autorisé à des données sensibles.
- Possibilité d'exécuter des actions réservées aux administrateurs ou autres rôles privilégiés.

### **Prévention et correction** :

1. **Renforcer la logique de contrôle des rôles** :
    - Rejeter toutes les requêtes où le rôle ne correspond pas explicitement à une règle définie.
2. **Auditer les règles d'autorisation** :
    - S'assurer que chaque chemin et méthode a des règles clairement définies.
3. **Tests de sécurité** :
    - Effectuer des tests manuels et automatisés pour détecter des failles dans la logique d'autorisation.
4. **Logs détaillés** :
    - Ajouter des logs indiquant pourquoi une requête est bloquée ou autorisée pour faciliter le diagnostic des problèmes d'autorisation.

Cette faille est souvent classifiée comme une **vulnérabilité critique**, car elle peut compromettre des données ou des fonctionnalités sensibles dans une application.

**Solution :**

```jsx
const matchingRule = rules.find(
  (rule) => path.startsWith(rule.path) && rule.methods.includes(method) && rule.roles.includes(role)
);

// Bloquer l'accès si aucune règle ne correspond exactement
if (!matchingRule) {
  console.log("! No matching rule found, denying access.");
  return context.json({ message: "Forbidden" }, 403);
}
```