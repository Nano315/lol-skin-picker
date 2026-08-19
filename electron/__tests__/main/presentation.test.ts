import { describe, expect, it } from "vitest";
import {
  computePresentation,
  type PresentationInput,
} from "../../main/windows/presentation";

/**
 * `computePresentation` est pure : pas de mock Electron ici, on decrit
 * directement la table de verite attendue.
 */

const base: PresentationInput = {
  companionEnabled: false,
  lcuConnected: true,
  phase: "Unknown",
  companionDismissed: false,
};

const input = (over: Partial<PresentationInput> = {}): PresentationInput => ({
  ...base,
  ...over,
});

describe("computePresentation", () => {
  describe("client League ferme", () => {
    it("masque tout, quelle que soit la phase memorisee", () => {
      expect(computePresentation(input({ lcuConnected: false }))).toEqual({
        main: "hidden",
        companion: "hidden",
      });
    });

    it("masque le sidecar meme s'il est active et qu'on etait en draft", () => {
      const state = computePresentation(
        input({ lcuConnected: false, companionEnabled: true, phase: "ChampSelect" })
      );
      expect(state.companion).toBe("hidden");
      expect(state.main).toBe("hidden");
    });
  });

  describe("en partie (InProgress)", () => {
    it("masque la fenetre principale", () => {
      expect(computePresentation(input({ phase: "InProgress" })).main).toBe(
        "hidden"
      );
    });

    it("masque AUSSI le sidecar quand il est active", () => {
      // Regle non negociable : on ne dessine jamais par-dessus le jeu.
      const state = computePresentation(
        input({ phase: "InProgress", companionEnabled: true })
      );
      expect(state).toEqual({
        main: "hidden",
        companion: "hidden",
      });
    });
  });

  describe("champ select", () => {
    it("montre le sidecar et masque la principale quand il est active", () => {
      expect(
        computePresentation(
          input({ phase: "ChampSelect", companionEnabled: true })
        )
      ).toEqual({
        main: "hidden",
        companion: "shown",
      });
    });

    it("garde le comportement historique quand il est desactive", () => {
      expect(
        computePresentation(
          input({ phase: "ChampSelect", companionEnabled: false })
        )
      ).toEqual({
        main: "shown",
        companion: "hidden",
      });
    });
  });

  describe("hors draft et hors partie", () => {
    // Le sidecar n'est pas une extension permanente du client : il n'apparait
    // qu'en draft, y compris quand il est active.
    it.each(["Lobby", "Matchmaking", "ReadyCheck", "EndOfGame", "None"])(
      "montre la principale en grand et pas le sidecar (%s)",
      (phase) => {
        expect(
          computePresentation(input({ phase, companionEnabled: true }))
        ).toEqual({
          main: "shown",
          companion: "hidden",
        });
      }
    );

    it("montre la principale sur la phase Unknown du demarrage", () => {
      const state = computePresentation(input({ phase: "Unknown" }));
      expect(state.main).toBe("shown");
    });
  });

  describe("croix du sidecar", () => {
    const draft = { companionEnabled: true, phase: "ChampSelect" };

    it("retire le sidecar sans faire remonter la fenetre principale", () => {
      // La principale est maximisee : la rouvrir recouvrirait la draft que
      // l'utilisateur vient de demander a degager.
      expect(
        computePresentation(input({ ...draft, companionDismissed: true }))
      ).toEqual({ main: "hidden", companion: "hidden" });
    });

    it("reste stable si la presentation est recalculee pendant la draft", () => {
      const once = computePresentation(
        input({ ...draft, companionDismissed: true })
      );
      const twice = computePresentation(
        input({ ...draft, companionDismissed: true })
      );
      expect(twice).toEqual(once);
    });

    it("n'a aucun effet hors champ select", () => {
      expect(
        computePresentation(
          input({
            companionEnabled: true,
            phase: "Lobby",
            companionDismissed: true,
          })
        )
      ).toEqual({ main: "shown", companion: "hidden" });
    });
  });

  it("n'affiche jamais les deux fenetres en meme temps", () => {
    const phases = [
      "Unknown",
      "None",
      "Lobby",
      "Matchmaking",
      "ReadyCheck",
      "ChampSelect",
      "InProgress",
      "WaitingForStats",
      "PreEndOfGame",
      "EndOfGame",
    ];

    for (const phase of phases) {
      for (const companionEnabled of [true, false]) {
        for (const lcuConnected of [true, false]) {
          for (const companionDismissed of [true, false]) {
            const state = computePresentation({
              phase,
              companionEnabled,
              lcuConnected,
              companionDismissed,
            });
            expect(state.main === "shown" && state.companion === "shown").toBe(
              false
            );
          }
        }
      }
    }
  });
});
