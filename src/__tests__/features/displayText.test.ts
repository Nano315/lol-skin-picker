import { describe, it, expect } from "vitest";
import {
  truncateForDisplay,
  displayName,
  displaySkinLineName,
  MAX_DISPLAY_NAME,
  MAX_DISPLAY_SKIN_LINE,
} from "@/features/utils/displayText";
import { redactPuuid, redactName } from "@/features/utils/redact";

/**
 * Vague 3 de l'audit : bornage des textes venant d'un pair avant affichage, et
 * masquage des identifiants avant ecriture dans les logs disque.
 */
describe("displayText — non-regression vague 3", () => {
  it("laisse passer un pseudo normal sans le modifier", () => {
    expect(displayName("Faker")).toBe("Faker");
  });

  it("tronque un pseudo demesure (defiguration de la room)", () => {
    const out = displayName("A".repeat(100_000));
    expect(out.length).toBeLessThanOrEqual(MAX_DISPLAY_NAME + 1);
    expect(out.endsWith("…")).toBe(true);
  });

  it("tronque un nom de skin line demesure", () => {
    const out = displaySkinLineName("B".repeat(500));
    expect(out.length).toBeLessThanOrEqual(MAX_DISPLAY_SKIN_LINE + 1);
    expect(out.endsWith("…")).toBe(true);
  });

  it("ne coupe pas au milieu d'une paire de substitution", () => {
    // 30 emojis : chacun compte 2 unites UTF-16, 1 point de code.
    const out = truncateForDisplay("🎮".repeat(30), 10);
    expect(Array.from(out.replace("…", ""))).toHaveLength(10);
    expect(out).not.toContain("�");
  });

  it("retombe sur la valeur par defaut pour une entree vide ou invalide", () => {
    expect(displayName("")).toBe("Joueur");
    expect(displayName(null)).toBe("Joueur");
    expect(displayName(undefined)).toBe("Joueur");
    expect(displayName(42)).toBe("Joueur");
    expect(displaySkinLineName({})).toBe("Skin line");
  });

  it("respecte exactement la limite sans ellipse superflue", () => {
    const exact = "C".repeat(MAX_DISPLAY_NAME);
    expect(displayName(exact)).toBe(exact);
    expect(displayName(exact)).not.toContain("…");
  });
});

describe("redact — non-regression vague 3", () => {
  const PUUID = "5f9b1c2d-3e4a-4b5c-8d9e-0f1a2b3c4d5e-suite-longue-pour-un-puuid-riot";

  it("ne laisse pas fuiter le puuid complet dans les logs", () => {
    const out = redactPuuid(PUUID);
    expect(out).not.toBe(PUUID);
    expect(out).not.toContain("3e4a");
    expect(out.length).toBeLessThan(20);
  });

  it("garde de quoi correler deux lignes de log", () => {
    expect(redactPuuid(PUUID)).toBe(redactPuuid(PUUID));
    expect(redactPuuid(PUUID)).not.toBe(redactPuuid("autre" + PUUID));
  });

  it("gere les valeurs absentes", () => {
    expect(redactPuuid(null)).toBe("(absent)");
    expect(redactPuuid(undefined)).toBe("(absent)");
    expect(redactPuuid("")).toBe("(absent)");
    expect(redactName(null)).toBe("(absent)");
  });

  it("masque un pseudo sans le rendre meconnaissable pour le debug", () => {
    expect(redactName("Faker")).toBe("F…(5)");
  });
});
