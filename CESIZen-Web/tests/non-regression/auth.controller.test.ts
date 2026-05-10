import { connexion } from "../../controllers/auth.controller";
import { createBrowserClient } from "@supabase/ssr";

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(),
}));

describe("auth.controller - tests de non-régression", () => {
  test("connexion doit garder le format success/data", async () => {
    // Ce format est utilisé ensuite pour rediriger l'utilisateur.
    const eq = jest.fn().mockResolvedValue({ error: null });
    const update = jest.fn(() => ({ eq }));
    const insert = jest.fn().mockResolvedValue({ error: null });
    const data = { user: { id: "u1" } };

    (createBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ data, error: null }),
      },
      from: jest.fn(() => ({ update, insert })),
    });

    const resultat = await connexion("lea@mail.com", "Motdepasse123!");

    expect(resultat).toEqual({ success: true, data });
  });
});
