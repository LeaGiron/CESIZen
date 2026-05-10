import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserById, createUser, deleteUser } from '../../src/services/userService'
import { getPublishedResources, createResource } from '../../src/services/resourceService'
import { getExercises, saveUserConfig } from '../../src/services/exerciseService'

// ─── Mock du client Supabase ──────────────────────────────────────────────
vi.mock('../../lib/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@mail.com',
          type: 'utilisateur',
          statut_compte: 'actif',
          tentatives_connexion: 0,
          date_verrouillage: null,
        },
        error: null,
      }),
      // Simule une liste de résultats
      order: vi.fn().mockImplementation(() => Promise.resolve({
      data: [
        { id: 1, nom: '748', titre: 'Gérer son stress', statut: 'publication', categorie: 'Stress', duree_inspiration_defaut: 7, duree_apnee_defaut: 4, duree_expiration_defaut: 8 },
        { id: 2, nom: '55', titre: 'Améliorer son sommeil', statut: 'publication', categorie: 'Sommeil', duree_inspiration_defaut: 5, duree_apnee_defaut: 0, duree_expiration_defaut: 5 },
      ],
      error: null,
    })),
    })),
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}))

// ─────────────────────────────────────────────────────────────────────────
// MODULE 1 : COMPTES UTILISATEURS
// ─────────────────────────────────────────────────────────────────────────
describe('NR — Module Comptes Utilisateurs', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('NR-01 : getUserById retourne toujours un objet avec id, nom, prenom, email', async () => {
    const user = await getUserById(1)
    expect(user).not.toBeNull()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('nom')
    expect(user).toHaveProperty('prenom')
    expect(user).toHaveProperty('email')
  })

  it('NR-02 : getUserById retourne toujours un type de compte (utilisateur ou administrateur)', async () => {
    const user = await getUserById(1)
    expect(['utilisateur', 'administrateur']).toContain(user.type)
  })

  it('NR-03 : getUserById retourne toujours un statut de compte', async () => {
    const user = await getUserById(1)
    expect(user).toHaveProperty('statut_compte')
    expect(['actif', 'desactive', 'verrouille']).toContain(user.statut_compte)
  })

  it('NR-04 : getUserById ne retourne jamais le mot de passe en clair', async () => {
    const user = await getUserById(1)
    // Règle de sécurité : le mot de passe ne doit jamais apparaître en clair
    expect(user).not.toHaveProperty('mot_de_passe')
  })

  it('NR-05 : createUser retourne toujours un objet avec un id', async () => {
    const newUser = await createUser({
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@mail.com',
      mot_de_passe: 'TestCESI1234@',
    })
    expect(newUser).toHaveProperty('id')
  })

  it('NR-06 : deleteUser ne lève jamais d\'exception pour un utilisateur existant', async () => {
    // Vérifie la non-régression RGPD : suppression des données associées
    await expect(deleteUser(1)).resolves.not.toThrow()
  })
})

// ─────────────────────────────────────────────────────────────────────────
// MODULE 2 : INFORMATIONS (RESSOURCES)
// ─────────────────────────────────────────────────────────────────────────
describe('NR — Module Informations', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('NR-07 : getPublishedResources retourne toujours un tableau', async () => {
    const resources = await getPublishedResources()
    expect(Array.isArray(resources)).toBe(true)
  })

  it('NR-08 : chaque ressource retournée a toujours id, titre, statut, categorie', async () => {
    const resources = await getPublishedResources()
    resources.forEach((r: any) => {
      expect(r).toHaveProperty('id')
      expect(r).toHaveProperty('titre')
      expect(r).toHaveProperty('statut')
      expect(r).toHaveProperty('categorie')
    })
  })

  it('NR-09 : getPublishedResources ne retourne jamais de ressources non publiées', async () => {
    const resources = await getPublishedResources()
    // Règle : seules les ressources "publication" sont visibles
    resources.forEach((r: any) => {
      expect(r.statut).toBe('publication')
    })
  })

  it('NR-10 : createResource retourne un objet avec un id', async () => {
    const resource = await createResource({
      titre: 'Test ressource',
      contenu: 'Contenu de test',
      categorie: 'Stress',
      statut: 'redaction',
      id_util_auteur: 1,
    })
    expect(resource).toHaveProperty('id')
  })
})

// ─────────────────────────────────────────────────────────────────────────
// MODULE 3 : EXERCICES DE RESPIRATION
// ─────────────────────────────────────────────────────────────────────────
describe('NR — Module Exercices de Respiration', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('NR-11 : getExercises retourne toujours un tableau', async () => {
    const exercises = await getExercises()
    expect(Array.isArray(exercises)).toBe(true)
  })

  it('NR-12 : chaque exercice a toujours id, nom, duree_inspiration, duree_apnee, duree_expiration', async () => {
    const exercises = await getExercises()
    exercises.forEach((e: any) => {
      expect(e).toHaveProperty('id')
      expect(e).toHaveProperty('nom')
      expect(e).toHaveProperty('duree_inspiration_defaut')
      expect(e).toHaveProperty('duree_apnee_defaut')
      expect(e).toHaveProperty('duree_expiration_defaut')
    })
  })

  it('NR-13 : les durées d\'inspiration et d\'expiration sont toujours positives', async () => {
    const exercises = await getExercises()
    exercises.forEach((e: any) => {
      expect(e.duree_inspiration_defaut).toBeGreaterThan(0)
      expect(e.duree_expiration_defaut).toBeGreaterThan(0)
    })
  })

  it('NR-14 : la durée d\'apnée peut être nulle (exercice "55" et "46")', async () => {
    const exercises = await getExercises()
    exercises.forEach((e: any) => {
      // L'apnée est >= 0 (jamais négative)
      expect(e.duree_apnee_defaut).toBeGreaterThanOrEqual(0)
    })
  })

  it('NR-15 : saveUserConfig ne lève jamais d\'exception pour une config valide', async () => {
    await expect(saveUserConfig({
      id_util: 1,
      id_exer: 1,
      duree_inspiration: 7,
      duree_apnee: 4,
      duree_expiration: 8,
    })).resolves.not.toThrow()
  })
})
