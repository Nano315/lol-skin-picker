import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";

/**
 * Les deux fenetres chargent le MEME bundle ; c'est le hash qui decide de
 * l'arbre monte. Le branchement se fait ici et pas dans le router : passer par
 * une route de `createHashRouter` ferait passer le companion par `Layout`
 * (Background, WindowTitleBar, InvitationHandler) et surtout par `AppShell`,
 * qui monte les connectors sockets. Deux fenetres = deux sockets identity pour
 * le meme puuid.
 *
 * L'import est DYNAMIQUE des deux cotes pour que Vite decoupe reellement les
 * deux arbres. En statique, le sidecar evaluait aussi `AppShell` — donc
 * `routes.tsx`, ses quatre pages, socket.io-client et framer-motion — a
 * l'ouverture, c'est-a-dire en pleine champ select. Rien de tout ca n'est
 * rendu dans une fenetre de 300 px.
 */
const isCompanion = window.location.hash.startsWith("#/companion");

const shell = isCompanion
  ? import("./app/CompanionShell")
  : import("./app/AppShell");

// `.then` et non un `await` de haut niveau : la cible de build
// (chrome87/es2020) ne l'accepte pas.
void shell.then(({ default: Shell }) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Shell />
    </React.StrictMode>
  );
});
