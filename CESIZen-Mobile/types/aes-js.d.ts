// La librairie aes-js ne fournit pas ses propres types TypeScript.
// Cette déclaration minimale sert juste à dire à TypeScript "fais-moi confiance",
// sans avoir à installer un paquet de types séparé qui n'existe pas forcément.
declare module 'aes-js';
