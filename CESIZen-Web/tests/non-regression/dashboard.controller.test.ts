import { renderHook } from "@testing-library/react";
import { useDashboard } from "../../controllers/dashboard.controller";
import { createBrowserClient } from "@supabase/ssr";

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(),
}));

describe("dashboard.controller - tests de non-régression", () => {
  test("le dashboard doit démarrer avec un visiteur par défaut", () => {
    // Avant le chargement Supabase, l'écran doit avoir un état simple et stable.
    (createBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => ({ limit: jest.fn().mockResolvedValue({ data: [], error: null }) })),
        })),
      })),
    });

    const { result } = renderHook(() => useDashboard());

    expect(result.current.prenom_util).toBe("Visiteur");
    expect(result.current.estConnecte).toBe(false);
    expect(result.current.estAdmin).toBe(false);
  });
});
