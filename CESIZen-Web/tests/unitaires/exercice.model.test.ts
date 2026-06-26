import { supabaseMock } from "../mocks/supabase.mock";

jest.mock("@/lib/supabase/supabase", () => ({
  supabase: supabaseMock,
}));

import { saveExercice, deleteExercice } from "../../models/exercice.model";
import { mockUpsert, mockDelete } from "../mocks/supabase.mock";

describe("exercice.model - tests unitaires", () => {

  test("doit enregistrer et supprimer un exercice", async () => {

    // Simulation d'un enregistrement d'exercice dans la base
    mockUpsert([{ id_exer: "e1", nom_exer: "Relaxation" }]);

    // Vérifie que la fonction retourne bien l'exercice enregistré
    const result = await saveExercice({ id_exer: "e1", nom_exer: "Relaxation" });
    expect(result).toEqual({ id_exer: "e1", nom_exer: "Relaxation" });

    // Simulation d'une suppression en base
    mockDelete();

    // Vérifie que la suppression ne renvoie pas d'erreur
    const deleted = await deleteExercice("e1");
    expect(deleted).toBeNull();
  });

});
