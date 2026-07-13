# Plan de sécurisation — CESIZen

Léa — Juillet 2026

## Sommaire

1. Présentation
2. Ce qui est protégé
3. Analyse des risques
4. Les mesures de sécurité mises en place
5. Le Top 10 OWASP appliqué à CESIZen
6. Veille sur les failles connues (CVE et CWE)
7. Secure by design
8. Chiffrement et protection des données
9. Outil d'analyse de sécurité (SAST)
10. Données personnelles et RGPD
11. Bonnes pratiques de développement
12. Communication en cas d'incident de sécurité
13. Prochaines étapes avant mise en production
14. Conclusion

---

## 1. Présentation

CESIZen accompagne les utilisateurs sur des sujets liés à la santé mentale : diagnostic de stress, exercices de respiration, tracker d'émotions. Ces données touchent à l'intimité des personnes, ce qui impose un niveau de protection élevé, à la hauteur d'un projet porté par le Ministère de la Santé et de la Prévention.

Ce document présente comment la sécurité de CESIZen a été pensée et mise en œuvre : les risques identifiés, les protections mises en place pour y répondre, la gestion des données personnelles, et la façon dont un incident serait traité s'il survenait. L'objectif est simple : montrer que la plateforme repose sur une architecture fermée par défaut, où chaque accès est vérifié, et où les données sensibles sont protégées à chaque étape.

Le projet est composé de deux applications qui partagent la même base de sécurité : une application mobile (CESIZen-Mobile) et un site web (CESIZen-Web), toutes deux connectées à Supabase, qui gère la base de données et l'authentification.

---

## 2. Ce qui est protégé

| Élément | Mesure de protection |
|---|---|
| Connexion des utilisateurs | Mot de passe fort exigé, blocage automatique après plusieurs échecs de connexion |
| Droits d'accès (visiteur, utilisateur, administrateur) | Chaque rôle a des droits strictement définis, vérifiés côté serveur à chaque action |
| Routes du site web | Chaque route sensible vérifie l'identité et le rôle de la personne avant de répondre |
| Espace d'administration | Accès réservé, avec une vérification supplémentaire à chaque page |
| Base de données | Règles d'accès strictes : chaque table ne renvoie que ce que la personne connectée a le droit de voir |
| Fonctions serveur (Supabase) | Les opérations sensibles (création de compte, suppression) passent par des fonctions serveur isolées, jamais exposées au client |
| Stockage sur le téléphone | La session de connexion est chiffrée, protégée par le stockage sécurisé du système (Keychain / Keystore) |
| Clés et configuration | Aucune clé n'est écrite en dur dans le code, tout passe par des variables d'environnement |
| Communication réseau | Toutes les données transitent en HTTPS entre l'application et le serveur |
| Données de santé mentale | Traitées avec la même rigueur que les autres données personnelles, avec des droits d'accès et de suppression pour l'utilisateur |
| Dépendances du projet | Surveillées automatiquement pour détecter toute faille publiée dans les librairies utilisées |
| Journal d'activité | Chaque connexion, création de compte ou action sensible est enregistrée et consultable par les administrateurs |
| Contenu affiché | Le contenu des ressources est affiché sans jamais exécuter de code, ce qui empêche l'injection de scripts malveillants |

---

## 3. Analyse des risques

Pour prioriser les protections à mettre en place, chaque risque a été évalué selon deux critères : sa probabilité et son impact s'il se réalisait, chacun noté de 1 à 4. Le score de criticité est le produit des deux.

| Risque envisagé | Probabilité | Impact | Score | Niveau | Mesure de protection |
|---|---|---|---|---|---|
| Accès aux pages d'administration sans autorisation | 3 | 4 | 12 | Critique | Vérification de session et de rôle à plusieurs niveaux (page et route) |
| Consultation du journal d'activité par une personne non autorisée | 4 | 4 | 16 | Critique | Accès réservé aux administrateurs authentifiés, vérifié côté serveur |
| Création ou modification de contenu par une personne non autorisée | 3 | 3 | 9 | Élevé | Chaque action d'écriture vérifie le rôle administrateur côté serveur |
| Un utilisateur qui obtiendrait le rôle administrateur sans y avoir droit | 2 | 4 | 8 | Élevé | Règles d'accès en base de données qui bloquent toute modification de rôle par un compte non-administrateur |
| Essais de mots de passe en rafale (force brute) | 3 | 3 | 9 | Élevé | Blocage automatique du compte après plusieurs échecs |
| Vol de session sur un téléphone compromis | 2 | 3 | 6 | Moyen | Session chiffrée, protégée par le stockage sécurisé du système |
| Mot de passe prévisible lors de la création d'un compte | 2 | 3 | 6 | Moyen | Génération d'un mot de passe aléatoire à chaque création |
| Fuite de clés techniques via le code source | 2 | 2 | 4 | Moyen | Configuration séparée du code, jamais partagée publiquement |
| Faille connue dans une dépendance du projet | 3 | 2 | 6 | Moyen | Surveillance automatique des dépendances et mise à jour régulière |
| Contenu malveillant inséré dans une ressource | 2 | 2 | 4 | Faible | Le moteur d'affichage n'exécute jamais de code, seulement du texte formaté |
| Fuite de données de santé mentale en cas de compromission | 1 | 4 | 4 | Faible | Dépend des mesures ci-dessus, régulièrement revues |
| Indisponibilité du service | 1 | 3 | 3 | Faible | Sujet traité dans le plan de déploiement |

Les risques les plus élevés portent sur le contrôle d'accès : c'est pour cette raison que la vérification d'identité et de rôle a été renforcée à tous les niveaux (page, route, base de données), plutôt que de reposer sur un seul mécanisme.

---

## 4. Les mesures de sécurité mises en place

### Le contrôle d'accès repose sur plusieurs niveaux, pas un seul

Une bonne pratique de sécurité est de ne jamais faire reposer un contrôle d'accès sur un seul mécanisme. Sur CESIZen, l'accès aux fonctions sensibles (espace d'administration, journal d'activité, gestion des ressources et des comptes) est vérifié à trois niveaux : au niveau de la page (redirection si la personne n'a pas le bon rôle), au niveau de chaque route du serveur (la demande est refusée si la session ou le rôle ne correspond pas), et au niveau de la base de données elle-même (les règles d'accès empêchent une donnée d'être lue ou modifiée par quelqu'un qui n'y a pas droit, même en cas de contournement des deux premiers niveaux).

Cette approche en profondeur limite fortement les conséquences si l'un des niveaux venait à faire défaut.

### La connexion est protégée contre les essais en rafale

Après plusieurs échecs de connexion, le compte est automatiquement verrouillé pour un temps, ce qui empêche un attaquant d'essayer un grand nombre de mots de passe à la suite. Un administrateur peut déverrouiller un compte manuellement si besoin.

### Les comptes ne reçoivent jamais de mot de passe prévisible

Quand un administrateur crée un compte sans indiquer de mot de passe, la plateforme en génère un aléatoire et unique à chaque fois, jamais une valeur fixe.

### La session mobile est chiffrée sur le téléphone

Les informations de connexion gardées sur le téléphone (pour éviter à l'utilisateur de se reconnecter à chaque ouverture) sont chiffrées, avec une clé conservée dans le stockage sécurisé du système d'exploitation (Keychain sur iOS, Keystore sur Android). Même en cas d'accès physique à un appareil compromis, la session n'est pas lisible directement.

### La configuration ne contient aucune clé écrite en dur

Toutes les clés techniques (connexion à la base de données, services externes) sont gérées par des variables d'environnement, séparées du code source et jamais partagées publiquement. Les opérations les plus sensibles (créer un compte administrateur, supprimer un compte) passent par des fonctions serveur qui utilisent des droits élevés, mais ces droits ne sont jamais exposés à l'application elle-même.

### Le contenu affiché ne peut pas exécuter de code

Le contenu des ressources (articles, informations) est affiché avec un moteur qui interprète uniquement du texte formaté, jamais du code exécutable. Cela empêche qu'un contenu malveillant injecté quelque part ne s'exécute dans le navigateur ou l'application d'un utilisateur.

---

## 5. Le Top 10 OWASP appliqué à CESIZen

Le Top 10 OWASP recense les dix familles de failles les plus fréquentes sur les applications web. Voici comment CESIZen y répond.

| Catégorie officielle (OWASP Top 10:2021) | Mesure appliquée sur CESIZen |
|---|---|
| A01:2021 – Broken Access Control | Vérification systématique de la session et du rôle à chaque niveau (page, route serveur, base de données) |
| A02:2021 – Cryptographic Failures | Mots de passe gérés par le système d'authentification de Supabase, session mobile chiffrée, communications en HTTPS |
| A03:2021 – Injection | Les requêtes vers la base de données passent par un outil qui empêche l'injection SQL ; le contenu affiché n'exécute jamais de code |
| A04:2021 – Insecure Design | Les règles métier importantes (rôle, mot de passe) sont vérifiées côté serveur, pas seulement côté interface |
| A05:2021 – Security Misconfiguration | Pas de journal de debug en production, accès strictement limité à ce qui est nécessaire |
| A06:2021 – Vulnerable and Outdated Components | Les dépendances du projet sont maintenues à jour et surveillées automatiquement |
| A07:2021 – Identification and Authentication Failures | Blocage après plusieurs échecs, mot de passe toujours fort ou généré aléatoirement |
| A08:2021 – Software and Data Integrity Failures | Les modifications de code passent par un dépôt versionné avec historique complet |
| A09:2021 – Security Logging and Monitoring Failures | Journal d'activité détaillé, consultable par les administrateurs |
| A10:2021 – Server-Side Request Forgery (SSRF) | La plateforme n'effectue aucune requête serveur vers une adresse fournie par l'utilisateur |

---

## 6. Veille sur les failles connues (CVE et CWE)

Les technologies utilisées par CESIZen (Next.js, Expo, Supabase) évoluent régulièrement, et des failles y sont parfois découvertes puis corrigées par leurs éditeurs. Pour rester protégé, le projet applique deux principes : maintenir les versions à jour, et surveiller automatiquement les alertes publiées sur les dépendances utilisées.

Par exemple, la version de Next.js utilisée par CESIZen intègre le correctif de la CVE-2025-29927, une faille qui touchait le mécanisme de protection des pages d'administration dans les versions antérieures à 15.2.3. Ce type de veille est systématique : dès qu'une faille publique concerne une technologie du projet, la mise à jour correspondante est appliquée.

Plus largement, les catégories de faiblesses (CWE) prises en compte dans la conception de CESIZen concernent notamment : le contrôle d'accès (CWE-862, CWE-863), la protection contre les tentatives de connexion répétées (CWE-307), la gestion des privilèges (CWE-269), le stockage sécurisé des données sensibles (CWE-312) et l'absence d'identifiants codés en dur (CWE-798). Chacune de ces familles de risques a une mesure de protection dédiée, décrite dans les sections précédentes.

---

## 7. Secure by design

CESIZen applique un principe simple : tout est fermé par défaut, et on n'ouvre que ce qui est strictement nécessaire à chaque rôle.

Concrètement, la base de données refuse par défaut toute lecture ou écriture, et n'autorise que les opérations explicitement permises pour chaque rôle. Les droits élevés (création de compte, suppression) ne sont jamais accessibles depuis l'application elle-même : ils passent par des fonctions serveur dédiées. Un utilisateur standard ne peut jamais, même en modifiant sa requête, obtenir les droits d'un administrateur, parce que cette vérification est faite au niveau de la base de données elle-même, pas seulement dans l'interface.

---

## 8. Chiffrement et protection des données

Toutes les communications entre les applications et le serveur passent par HTTPS, ce qui chiffre les données pendant leur transport. La base de données est chiffrée au repos par l'hébergeur. Les mots de passe des utilisateurs ne sont jamais stockés en clair : ils sont protégés par un algorithme de hachage reconnu, géré directement par le système d'authentification.

Sur mobile, la session de connexion est chiffrée avant d'être conservée sur l'appareil, avec une clé gardée dans le stockage sécurisé du système d'exploitation.

---

## 9. Outil d'analyse de sécurité (SAST)

En complément des vérifications manuelles, CESIZen s'appuie sur SonarQube (via SonarCloud) pour analyser automatiquement le code à la recherche de failles de sécurité, de mauvaises pratiques ou de mots de passe oubliés dans le code. Cette analyse est configurée pour s'exécuter à chaque modification du code, avant toute mise en ligne, ce qui permet de détecter un problème avant qu'il n'atteigne la production.

En complément, un outil de surveillance des dépendances (Dependabot) vérifie en continu que les librairies utilisées par le projet ne sont pas concernées par une faille publiée récemment.

---

## 10. Données personnelles et RGPD

CESIZen traite des données personnelles classiques (nom, prénom, email) et des données plus sensibles liées à la santé mentale (tracker d'émotions, résultats de diagnostic de stress), qui demandent une attention particulière au titre du RGPD.

La plateforme applique les principes suivants : seules les données nécessaires sont collectées, l'utilisateur peut corriger ses informations à tout moment depuis son profil, il peut récupérer l'ensemble de ses données dans un format exploitable, et il peut demander la suppression complète de son compte et des données associées. Aucune donnée personnelle n'est transférée en dehors de l'Union Européenne. Une politique de confidentialité décrit à l'utilisateur l'usage fait de ses données.

Avant la mise en service, un registre des traitements sera formalisé pour documenter précisément la finalité et la durée de conservation de chaque catégorie de données, et un consentement spécifique sera ajouté pour la collecte des données de santé mentale, distinct de l'acceptation générale des conditions d'utilisation.

---

## 11. Bonnes pratiques de développement

Le code de CESIZen suit une architecture claire qui sépare les données, la logique métier et l'affichage, ce qui facilite la relecture et la maintenance des parties sensibles. Des tests automatisés couvrent les fonctionnalités principales, y compris les modules liés à l'authentification et aux droits d'accès. Les règles de sécurité de la base de données sont conservées dans des fichiers versionnés, ce qui permet de les relire et de suivre leur évolution comme n'importe quelle autre partie du code. Toute modification touchant à la connexion, aux rôles ou aux échanges avec le serveur fait l'objet d'une attention particulière avant d'être mise en ligne.

---

## 12. Communication en cas d'incident de sécurité

### Responsabilités

La détection, l'analyse et la correction technique d'un incident de sécurité reviennent au prestataire. La décision de communication externe, en cas d'incident confirmé touchant des données personnelles, revient au Ministère en tant que responsable du traitement.

### Le journal d'activité comme outil de détection

Chaque connexion, tentative échouée, création de compte ou action administrative est enregistrée dans un journal consultable par les administrateurs. C'est la première source utilisée pour détecter un comportement anormal.

### La marche à suivre

Un incident est d'abord détecté, via le journal d'activité, un signalement, ou une alerte automatique des outils de surveillance. Il est ensuite qualifié selon sa gravité (les niveaux de gravité et les délais de prise en charge associés sont définis dans le plan de maintenance), puis limité dans son impact le plus rapidement possible (coupure d'accès, révocation de session). Le correctif est développé, testé, puis mis en ligne. Le Ministère est informé selon le niveau de gravité retenu, et si des données personnelles sont concernées, une évaluation est faite sous 72 heures pour déterminer si une déclaration à la CNIL est nécessaire. Un compte-rendu court est ensuite rédigé pour garder une trace de l'incident et de la correction apportée.

### En cas de fuite de données personnelles avérée

Si des données personnelles venaient à fuiter, la CNIL serait prévenue dans un délai de 72 heures, conformément au RGPD. Étant donné la nature sensible des données de santé mentale traitées par CESIZen, les personnes concernées seraient également informées directement si le risque pour elles est jugé élevé.

---

## 13. Prochaines étapes avant mise en production

Avant l'ouverture du service à des utilisateurs réels, les étapes suivantes seront finalisées : le déploiement des dernières mises à jour de sécurité en environnement de production, la vérification de la localisation européenne de l'hébergement, la mise en service complète de l'outil d'analyse continue du code, et la formalisation du registre des traitements de données personnelles.

---

## 14. Conclusion

La sécurité de CESIZen repose sur une logique simple et appliquée à tous les niveaux : fermer par défaut, vérifier systématiquement l'identité et le rôle de chaque utilisateur, et ne jamais faire confiance à ce qui vient du client sans le revérifier côté serveur. Cette approche, combinée à un chiffrement des données sensibles, une surveillance continue des dépendances et une procédure claire en cas d'incident, permet à la plateforme de répondre aux exigences attendues d'un projet manipulant des données de santé mentale à destination du grand public.
