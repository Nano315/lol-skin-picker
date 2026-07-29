import { describe, it, expect } from "vitest";
import { toUrlId, tryUrlId, encodeSegment } from "../../utils/urlSafety";

/**
 * Vague 3 de l'audit : les identifiants interpoles dans les URLs LCU
 * (authentifiees en Basic) et CommunityDragon doivent etre contraints avant
 * d'atteindre le chemin.
 */
describe("urlSafety — non-regression vague 3", () => {
  describe("tryUrlId", () => {
    it("accepte les entiers positifs bornes", () => {
      expect(tryUrlId(0)).toBe(0);
      expect(tryUrlId(266)).toBe(266);
      expect(tryUrlId(1_000_000_000)).toBe(1_000_000_000);
    });

    it("accepte une chaine purement numerique", () => {
      expect(tryUrlId("266")).toBe(266);
    });

    it.each([
      ["1/../../riotclient/kill", "traversee de chemin"],
      ["266/../../../lol-login/v1/session", "traversee profonde"],
      ["1?redirect=http://evil", "injection de query"],
      ["1#frag", "fragment"],
      ["1%2f..%2f..", "separateur encode"],
      ["../1", "prefixe de traversee"],
      ["1 2", "espace"],
      ["", "chaine vide"],
      ["abc", "non numerique"],
      ["1e3", "notation scientifique"],
      ["0x10", "hexadecimal"],
    ])("rejette %j — %s", (value) => {
      expect(tryUrlId(value)).toBeNull();
    });

    const badNumbers: Array<[number, string]> = [
      [-1, "negatif"],
      [1.5, "non entier"],
      [NaN, "NaN"],
      [Infinity, "Infinity"],
      [1_000_000_001, "hors borne"],
    ];

    it.each(badNumbers)("rejette la valeur numerique %p — %s", (value) => {
      expect(tryUrlId(value)).toBeNull();
    });

    // Ces valeurs sont le piege principal : `Number(null)`, `Number([])` et
    // `Number("")` valent 0, `Number(true)` vaut 1. Une implementation basee sur
    // `Number()` les acceptait toutes comme identifiants valides.
    const badTypes: Array<[unknown, string]> = [
      [null, "null"],
      [undefined, "undefined"],
      [{}, "objet"],
      [[], "tableau"],
      [true, "booleen"],
      [false, "booleen false"],
    ];

    it.each(badTypes)("rejette %p — %s", (value) => {
      expect(tryUrlId(value)).toBeNull();
    });

    it("une valeur rejetee ne peut pas composer un chemin", () => {
      const hostile = "1/../../riotclient/kill";
      const id = tryUrlId(hostile);
      expect(id).toBeNull();
      // Le code appelant s'arrete avant de construire l'URL ; on verifie ici
      // qu'interpoler la valeur BRUTE aurait bien change le endpoint.
      const url = `https://127.0.0.1:1234/lol-champions/v1/inventories/42/champions/${hostile}/skins`;
      expect(new URL(url).pathname).not.toContain("/lol-champions/v1/inventories/42/champions/1/");
      expect(new URL(url).pathname).toContain("/riotclient/kill");
    });
  });

  describe("toUrlId", () => {
    it("renvoie l'entier pour une valeur valide", () => {
      expect(toUrlId(42, "championId")).toBe(42);
    });

    it("leve avec le libelle du champ pour une valeur invalide", () => {
      expect(() => toUrlId("1/../x", "championId")).toThrow(/championId/);
    });
  });

  describe("encodeSegment", () => {
    it("echappe les separateurs de chemin", () => {
      expect(encodeSegment("a/b")).toBe("a%2Fb");
      expect(encodeSegment("a?b")).toBe("a%3Fb");
      expect(encodeSegment("a#b")).toBe("a%23b");
      expect(encodeSegment("..")).toBe("..");
    });

    it("neutralise une traversee : les separateurs encodes ne coupent plus le chemin", () => {
      const encoded = encodeSegment("../../riotclient");
      const url = new URL(`https://127.0.0.1:1/base/${encoded}/end`);
      expect(url.pathname).not.toContain("/riotclient/end");
      expect(url.pathname).toContain("%2F");
    });

    it("rejette une valeur non exploitable", () => {
      expect(() => encodeSegment("")).toThrow();
      expect(() => encodeSegment("x".repeat(129))).toThrow();
      expect(() => encodeSegment(42)).toThrow();
      expect(() => encodeSegment(null)).toThrow();
    });
  });
});
