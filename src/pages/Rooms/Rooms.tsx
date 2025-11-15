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
  } = useRoom();

  const [codeInput, setCodeInput] = useState("");

  const { status, iconId } = useConnection();
  const phase = useGameflow();

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main">
        {!isInRoom && (
          <div>
            <button onClick={() => createRoom()}>
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
                />
                <button onClick={() => joinRoom(codeInput)}>Join</button>
              </div>
            </div>
          </div>
        )}

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
              {room.players.map((p) => (
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
