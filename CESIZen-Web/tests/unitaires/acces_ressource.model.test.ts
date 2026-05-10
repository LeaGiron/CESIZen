import { supabaseMock, resetSupabaseMock, mockSelectByTwoEq, mockSelectAll, mockInsert, mockUpdate, mockDelete } from "../mocks/supabase.mock";
import { getAccesRessourceById, getAllAccesRessource, createAccesRessource, updateAccesRessource, deleteAccesRessource } from "../../models/acces_ressource.model";

// Remplace le vrai Supabase par une version simulée (mock)
// Cela évite d'appeler la vraie base de données pendant les tests
jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("acces_ressource.model - tests unitaires", () => {

  // Avant chaque test, remise à zéro du mock pour éviter les effets entre les tests
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer un accès avec l'utilisateur et la ressource", async () => {
    // Simulation d'une réponse Supabase avec 2 conditions (id_util + id_ress)
    // Cela correspond à une recherche spécifique dans la base
    mockSelectByTwoEq({ id_acc: "acc-1", id_util: "u1", id_ress: "r1" });

    // Appel de la fonction à tester
    const result = await getAccesRessourceById("u1", "r1");

    // Vérifie que le bon accès est retourné
    expect(result.id_acc).toBe("acc-1");

    // Vérifie que la bonne table est utilisée dans Supabase
    expect(supabaseMock.from).toHaveBeenCalledWith("acces_ressource");
  });

  test("doit gérer les actions principales d'un accès", async () => {
    // Test de la création d'un accès
    // Simulation d'un insert réussi
    mockInsert([{ id_acc: "acc-1" }]);

    // Vérifie que la fonction retourne bien le résultat attendu
    await expect(createAccesRessource({ id_util: "u1", id_ress: "r1" }))
      .resolves.toEqual([{ id_acc: "acc-1" }]);

    // Test de la modification d'un accès
    // Simulation d'un update réussi
    mockUpdate([{ id_acc: "acc-1" }]);

    // Vérifie que la modification retourne bien le bon résultat
    await expect(updateAccesRessource("u1", "r1", { id_ress: "r2" } as any))
      .resolves.toEqual([{ id_acc: "acc-1" }]);

    // Test de la suppression d'un accès
    // Simulation d'une suppression sans erreur
    mockDelete();

    // Vérifie que la fonction retourne null (suppression OK)
    await expect(deleteAccesRessource("u1", "r1"))
      .resolves.toBeNull();
  });
});