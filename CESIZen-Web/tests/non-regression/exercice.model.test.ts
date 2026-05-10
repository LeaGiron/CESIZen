import { supabaseMock, resetSupabaseMock, mockOrder } from "../mocks/supabase.mock";
import { getAllExercices } from "../../models/exercice.model";

jest.mock("@/lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("exercice.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la liste des exercices doit rester disponible", async () => {
    // Ce test vérifie que le chargement des exercices ne régresse pas.
    const exercices = [{ id_exer: "e1", nom_exer: "Relaxation" }];
    mockOrder(exercices);

    await expect(getAllExercices()).resolves.toEqual(exercices);
  });
});
