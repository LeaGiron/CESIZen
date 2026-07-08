// Ce fichier s'exécute après le framework Jest — beforeAll/afterAll sont disponibles ici

// Silence console.error pour les warnings React attendus dans les tests
const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('ReactDOM.render'))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});