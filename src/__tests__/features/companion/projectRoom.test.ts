import { describe, expect, it } from "vitest";
import { projectRoomForCompanion } from "@/features/companion/projectRoom";
import type { RoomMember, RoomState } from "@/features/roomsClient";

const member = (over: Partial<RoomMember> & { id: string }): RoomMember => ({
  name: `player-${over.id}`,
  championId: 0,
  championAlias: "",
  skinId: 0,
  chromaId: 0,
  ...over,
});

const room = (over: Partial<RoomState> = {}): RoomState => ({
  id: "room-1",
  code: "ABCD1234",
  ownerId: "m1",
  members: [member({ id: "m1" }), member({ id: "m2" })],
  ...over,
});

describe("projectRoomForCompanion", () => {
  it("renvoie null hors room", () => {
    expect(projectRoomForCompanion(null, "m1")).toBeNull();
    expect(projectRoomForCompanion(undefined, "m1")).toBeNull();
  });

  it("marque owner et self sur le bon membre", () => {
    const state = projectRoomForCompanion(room(), "m2");
    expect(state?.isOwner).toBe(false);
    expect(state?.members.find((m) => m.id === "m2")?.isSelf).toBe(true);
    expect(state?.members.find((m) => m.id === "m1")?.isSelf).toBe(false);
    expect(state?.members.find((m) => m.id === "m1")?.isOwner).toBe(true);
  });

  it("borne les pseudos avant qu'ils traversent le relais IPC", () => {
    const state = projectRoomForCompanion(
      room({ members: [member({ id: "m1", name: "x".repeat(200) })] }),
      "m1"
    );
    const name = state?.members[0]?.name ?? "";
    // 24 caracteres + l'ellipse ajoutee par `displayName`.
    expect(name.length).toBeLessThanOrEqual(25);
    expect(name.endsWith("…")).toBe(true);
  });

  it("reconnait l'owner quand c'est nous", () => {
    expect(projectRoomForCompanion(room(), "m1")?.isOwner).toBe(true);
  });

  it("ne declare personne owner quand l'identite est inconnue", () => {
    // getMemberId() est null avant l'attribution du token : sans le garde
    // `!!selfId`, un ownerId lui aussi vide aurait rendu tout le monde owner.
    const state = projectRoomForCompanion(
      room({ ownerId: "" }),
      null
    );
    expect(state?.isOwner).toBe(false);
    expect(state?.members.every((m) => !m.isSelf)).toBe(true);
  });

  describe("synergie", () => {
    const withSynergy = room({
      members: [
        member({ id: "m1", isReady: true }),
        member({ id: "m2", isReady: true }),
        member({ id: "m3", isReady: false }),
      ],
      synergy: {
        colors: [
          {
            type: "sameColor",
            color: "#22d3ee",
            members: ["m1", "m2"],
            coverage: 2,
            combinationCount: 4,
          },
          {
            type: "sameColor",
            color: "#f472b6",
            members: ["m1"],
            coverage: 1,
            combinationCount: 1,
          },
        ],
        skinLines: [],
      },
    });

    it("retient la premiere couleur — le serveur trie par taille decroissante", () => {
      const state = projectRoomForCompanion(withSynergy, "m1");
      expect(state?.synergyColor).toBe("#22d3ee");
      expect(state?.synergyCount).toBe(2);
    });

    it("marque inSynergy uniquement sur les membres de la couleur dominante", () => {
      const state = projectRoomForCompanion(withSynergy, "m1");
      expect(state?.members.find((m) => m.id === "m1")?.inSynergy).toBe(true);
      expect(state?.members.find((m) => m.id === "m2")?.inSynergy).toBe(true);
      expect(state?.members.find((m) => m.id === "m3")?.inSynergy).toBe(false);
    });

    it("compte comme prets les seuls membres ayant soumis leurs options", () => {
      expect(projectRoomForCompanion(withSynergy, "m1")?.readyCount).toBe(2);
    });

    it("reste neutre quand aucune synergie n'est trouvee", () => {
      const state = projectRoomForCompanion(room(), "m1");
      expect(state?.synergyColor).toBeNull();
      expect(state?.synergyCount).toBe(0);
      expect(state?.members.every((m) => !m.inSynergy)).toBe(true);
    });
  });

  it("reporte le match lock de chaque membre", () => {
    const state = projectRoomForCompanion(
      room({
        members: [
          member({ id: "m1", lockedSkin: true }),
          member({ id: "m2" }),
        ],
      }),
      "m1"
    );
    expect(state?.members.find((m) => m.id === "m1")?.lockedSkin).toBe(true);
    // `lockedSkin` est optionnel (absent des payloads V1/V2) : son absence doit
    // se lire "non verrouille", pas "undefined".
    expect(state?.members.find((m) => m.id === "m2")?.lockedSkin).toBe(false);
  });
});
