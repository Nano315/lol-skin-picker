// src/features/hooks/useRooms.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import {
  roomsClient,
  type RoomState,
  type SynergyResult,
} from "../roomsClient";
import type { Selection } from "../types";
import { useOwnedSkins } from "./useOwnedSkins";

// Helper pour l'application via API Electron
const { api } = window as any;

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State pour stocker le résultat de l'algo (Owner only)
  const [synergyResult, setSynergyResult] = useState<SynergyResult | null>(
    null
  );

  // Récupération des skins locaux
  const skins = useOwnedSkins();

  // --- 1. Abonnement Room State & Synergy ---
  useEffect(() => {
    const unsubRoom = roomsClient.subscribe((nextRoom) => {
      setRoom(nextRoom);
      setJoined(roomsClient.isJoined());
    });

    const unsubSynergy = roomsClient.subscribeSynergy((res) => {
      setSynergyResult(res);
    });

    const unsubForce = roomsClient.subscribeForceApply((skinId, chromaId) => {
      // C'est ici qu'on appelle l'API Electron pour forcer le changement
      // On suppose que api.gameflow.selectSkin existe (ou méthode équivalente)
      console.log(`[Rooms] Force apply: Skin ${skinId}, Chroma ${chromaId}`);
      if (api?.gameflow?.selectSkin) {
        // Note: L'API attend souvent juste le skinId final (qui peut être un chroma ID)
        // Si chromaId != 0, c'est lui qu'on envoie généralement.
        const targetId = chromaId !== 0 ? chromaId : skinId;
        api.gameflow.selectSkin(targetId);
      }
    });

    if (roomsClient.isJoined()) {
      roomsClient.connect();
    }

    return () => {
      unsubRoom();
      unsubSynergy();
      unsubForce();
    };
  }, []);

  // --- 2. Auto-Send Inventory ---
  // Dès que l'utilisateur est dans une room et que ses skins sont chargés
  useEffect(() => {
    if (joined && skins.length > 0) {
      // On mappe pour correspondre au format OwnedSkinShort
      const payload = skins.map((s) => ({
        id: s.id,
        name: s.name,
        chromas: s.chromas,
      }));
      roomsClient.sendInventory(payload);
    }
  }, [joined, skins]);

  async function create(name: string) {
    try {
      const { room } = await roomsClient.createRoom(name);
      setRoom(room);
      setJoined(true);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function join(code: string, name: string) {
    try {
      const { room } = await roomsClient.joinRoom(code, name);
      setRoom(room);
      setJoined(true);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  function leave() {
    roomsClient.leaveRoom();
    setJoined(false);
    setRoom(null);
    setSynergyResult(null);
  }

  // Update selection standard
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  }, [
    joined,
    selection.championId,
    selection.skinId,
    selection.chromaId,
    selection.championAlias,
    selection,
  ]);

  // --- 3. Méthodes Synergy ---
  const requestSynergy = useCallback(() => {
    roomsClient.requestSynergy();
  }, []);

  const applySynergy = useCallback(
    (selectionMap: Record<string, { skinId: number; chromaId: number }>) => {
      roomsClient.applySynergy(selectionMap);
      // On vide le résultat pour fermer le panneau ou donner un feedback visuel
      setSynergyResult(null);
    },
    []
  );

  const clearSynergy = useCallback(() => setSynergyResult(null), []);

  return {
    room,
    joined,
    error,
    create,
    join,
    leave,
    synergyResult,
    requestSynergy,
    applySynergy,
    clearSynergy,
  };
}
