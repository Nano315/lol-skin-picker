import { useState } from "react";
import { useRoom } from "@/features/hooks/useRoom";

import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";

export default function RoomsPage() {
  const {
    room,
    isInRoom,
    isOwner,
    createRoom,
    joinRoom,
    leaveRoom,
    ownerReroll,
    seedRoomDev,
  } = useRoom();

  const [codeInput, setCodeInput] = useState("");

  const { status, iconId } = useConnection();
  const phase = useGameflow();

  // connecté au LCU ?
  const isConnected =
    typeof status === "string" && status.toLowerCase() === "connected";

  // dériver owner + autres joueurs quand on a une room
  const ownerPlayer = room
    ? room.players.find((p) => p.socketId === room.ownerId)
    : null;
  const otherPlayers = room
    ? room.players.filter((p) => p.socketId !== room.ownerId)
    : [];

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main">
        {/* Pas encore dans une room */}
        {!isInRoom && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!isConnected && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#151925",
                  fontSize: "0.9rem",
                  opacity: 0.9,
                }}
              >
                Tu dois être connecté au client League of Legends pour créer ou
                rejoindre une room.
              </div>
            )}

            <button
              onClick={() => {
                if (!isConnected) return;
                createRoom();
              }}
              disabled={!isConnected}
            >
              <span /> <span>Créer une room</span>
            </button>

            <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <span>Rejoindre une room</span>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  maxLength={4}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                  }}
                  disabled={!isConnected}
                />
                <button
                  onClick={() => {
                    if (!isConnected) return;
                    joinRoom(codeInput);
                  }}
                  disabled={!isConnected || codeInput.length !== 4}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dans une room */}
        {isInRoom && room && (
          <div style={{ gap: 16 }}>
            <div>
              <span />
              <div>
                <div>
                  Room ID : <strong>{room.id}</strong>
                </div>
                <div>Owner : {isOwner ? "Vous" : "Un autre joueur"}</div>
              </div>
            </div>

            <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ marginBottom: 8 }}>Joueurs :</div>

              {/* Card pour le owner */}
              {ownerPlayer && (
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "#151925",
                    marginBottom: 6,
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span>
                    {isOwner ? "Vous" : ownerPlayer.name}
                    <span
                      style={{
                        opacity: 0.7,
                        fontSize: "0.8rem",
                        marginLeft: 4,
                      }}
                    >
                      (owner)
                    </span>
                  </span>
                  <span>
                    {ownerPlayer.championId
                      ? `Champ: ${ownerPlayer.championId} – Skin: ${
                          ownerPlayer.currentSelection.skinId ?? "?"
                        }`
                      : "En attente de votre pick..."}
                  </span>
                </div>
              )}

              {/* Autres joueurs */}
              {otherPlayers.length === 0 && (
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "#0f1218",
                    marginBottom: 6,
                    width: "100%",
                    opacity: 0.8,
                    fontStyle: "italic",
                  }}
                >
                  En attente d&apos;autres joueurs...
                </div>
              )}

              {otherPlayers.map((p) => (
                <div
                  key={p.socketId}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "#0f1218",
                    marginBottom: 6,
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{p.name}</span>
                  <span>
                    {p.championId
                      ? `Champ: ${p.championId} – Skin: ${
                          p.currentSelection.skinId ?? "?"
                        }`
                      : "En attente..."}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={leaveRoom}>Quitter la room</button>
              {isOwner && (
                <button onClick={ownerReroll}>Reroll pour tout le monde</button>
              )}

              {isOwner && import.meta.env.DEV && (
                <button onClick={seedRoomDev}>[DEV] Ajouter des bots</button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
