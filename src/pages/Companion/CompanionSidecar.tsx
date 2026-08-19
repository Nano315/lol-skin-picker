import { useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dices,
  Hourglass,
  Lock,
  Palette,
  RefreshCw,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";

import ChromaBalls from "@/components/skin/ChromaBalls";
import TitleBarButton from "@/components/layout/TitleBarButton";
import { GlassCard } from "@/components/ui";
import { api, companionApi } from "@/features/api";
import { useCompanionHotkeys } from "@/features/companion/useCompanionHotkeys";
import { useCompanionRoom } from "@/features/companion/useCompanionRoom";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useMatchLock } from "@/features/matchLock/useMatchLock";
import {
  useRerollAction,
  type RerollKind,
} from "@/features/hooks/useRerollAction";
import { extractChromaColor } from "@/features/utils/displayText";
import { championArtUrl, skinIndexOf } from "@/features/utils/championArt";
import { cn } from "@/lib/utils";

/**
 * Draft Companion — le sidecar, docke a cote du client League.
 *
 * Il s'ouvre des l'entree en champ select, AVANT le pick : attendre que la
 * fenetre apparaisse au moment ou on verrouille couterait les quelques
 * secondes qui comptent. Il traverse donc trois etats, du plus vide au plus
 * complet : pas encore de champion -> champion pick mais pas verrouille ->
 * verrouille, tout est actionnable.
 *
 * Les trois etats vivent dans UNE carte, jamais dans une zone a bords flous :
 * un bloc pleine largeur qui se fond dans le fond n'a pas de contour, et un
 * etat vide sans contour ressemble a un chargement rate. La carte est celle de
 * l'app (`GlassCard`), pas une imitation.
 *
 * Largeur 260-400 px : chaque bloc doit tenir a 260. La carte est le seul
 * element elastique, elle absorbe la hauteur donnee a la fenetre.
 */

export default function CompanionSidecar() {
  const { status } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection, setSelection] = useSelection();
  const { locked: matchLocked, setLocked: setMatchLocked } = useMatchLock();
  const room = useCompanionRoom();
  const hotkeys = useCompanionHotkeys();
  const reduced = useReducedMotion();

  const hasChampion = selection.championId !== 0;
  const championLocked = hasChampion && selection.locked;

  const activeSkin = skins.find((s) => s.id === selection.skinId);
  const chromas = activeSkin?.chromas ?? [];
  const activeChroma = chromas.find((c) => c.id === selection.chromaId);
  const hasChromas = chromas.length > 0;

  const refreshSelection = useCallback(async () => {
    setSelection(await api.getSelection());
  }, [setSelection]);

  const { pending, run: runAction } = useRerollAction({
    canAct: status === "connected" && championLocked && !matchLocked,
    hasChromas,
    onChanged: refreshSelection,
  });

  // Le `!pending` n'entre pas dans la garde du hook (il porte deja son propre
  // verrou) mais bien dans l'affichage : pendant un reroll, les boutons sont
  // grises.
  const canAct =
    status === "connected" && championLocked && !matchLocked && !pending;

  async function selectChroma(variantId: number) {
    // variantId = skinId (base) OU chromaId — meme IPC dans les deux cas.
    await api.applySkinId(variantId);
    setSelection(await api.getSelection());
  }

  return (
    // `bg-glow-radial` par-dessus `bg-bg` : c'est le meme halo violet que
    // `Background` pose en haut de la fenetre principale.
    <div className="flex h-screen w-screen flex-col overflow-hidden border-l border-accent/30 bg-bg bg-glow-radial text-ink">
      <TitleBar />

      {/* min-h-0 : sans ca, un enfant en flex-1 refuse de descendre sous sa
          hauteur de contenu et la carte deborde au lieu de se comprimer.
          Rythme vertical : chaque bloc porte sa propre marge HAUTE, jamais
          basse — les blocs qui suivent sont conditionnels (chromas, equipe) et
          des marges basses cumuleraient des trous variables. */}
      <div className="flex min-h-0 flex-1 px-3">
        <PreviewCard
          selection={selection}
          championLocked={championLocked}
          hasChampion={hasChampion}
          skinName={activeSkin?.name}
          chromaLabel={
            activeChroma ? extractChromaColor(activeChroma.name) : "Default"
          }
          reduced={!!reduced}
        />
      </div>

      {/* Rangee de chromas. Reservee au champion verrouille : avant ca le LCU
          ne donne pas de skin exploitable, et une rangee qui apparait puis
          disparait ferait sauter la mise en page en pleine draft. */}
      {championLocked && hasChromas && (
        <div className="shrink-0 px-3 pt-3">
          <ChromaBalls
            championId={selection.championId}
            skinId={selection.skinId}
            chromas={chromas}
            currentChromaId={selection.chromaId}
            onSelect={(id) => void selectChroma(id)}
            disabled={matchLocked || !!pending}
          />
        </div>
      )}

      {room?.inRoom && <TeamStrip room={room} />}

      <Actions
        canAct={!!canAct}
        pending={pending}
        hasChromas={hasChromas}
        onAction={(kind) => void runAction(kind)}
        hotkeys={hotkeys}
        // Le CTA de groupe n'a de sens que pour l'owner, et seulement quand le
        // serveur a effectivement trouve une couleur commune.
        matchTeamColor={
          room?.inRoom && room.isOwner ? room.synergyColor : null
        }
        onMatchTeam={() => void companionApi.sendAction({ type: "matchTeam" })}
      />

      <Footer
        phase={phase}
        matchLocked={matchLocked}
        onToggleLock={() => setMatchLocked(!matchLocked)}
      />
    </div>
  );
}

/* ---------- Barre de titre ---------- */

/**
 * Exactement la barre de titre de la fenetre principale : meme hauteur (h-8),
 * meme zone de drag pleine largeur, memes boutons — `TitleBarButton` est le
 * composant partage. Pas de libelle ni de poignee : la fenetre principale n'en
 * a pas non plus, et deux barres qui se ressemblent "presque" se remarquent
 * plus que deux barres identiques.
 *
 * Une seule commande. Ni reduire ni agrandir n'ont de sens pour un sidecar
 * dimensionne a la main, et la croix veut dire "pas cette draft" : elle masque
 * sans toucher a l'option.
 */
function TitleBar() {
  return (
    <div className="drag-region flex h-8 shrink-0 items-center justify-end">
      <div className="no-drag flex h-full items-center">
        <TitleBarButton
          onClick={() => void companionApi.hide()}
          aria-label="Close"
          variant="danger"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </TitleBarButton>
      </div>
    </div>
  );
}

/* ---------- Carte preview ---------- */

function PreviewCard({
  selection,
  championLocked,
  hasChampion,
  skinName,
  chromaLabel,
  reduced,
}: {
  selection: { championId: number; championAlias: string; skinId: number };
  championLocked: boolean;
  hasChampion: boolean;
  skinName?: string;
  chromaLabel: string;
  reduced: boolean;
}) {
  /**
   * `loading` et non `splash`.
   *
   * Le splash art fait 1215x717 et le champion n'y est pas place au meme
   * endroit d'un skin a l'autre : dans une colonne verticale on n'en garde
   * qu'un tiers de la largeur, et aucune `object-position` fixe ne peut tomber
   * juste pour tous les skins — d'ou le Nami dont on ne voyait que le baton.
   *
   * La loading art est le meme visuel deja recadre par Riot en 308x560
   * portrait, centre sur le champion. Meme host (deja autorise par la CSP),
   * meme numerotation de skin, et beaucoup plus leger. Le ratio de la carte
   * (~0.6) est proche du sien (0.55) : le recadrage restant est marginal.
   */
  const artUrl =
    championLocked && selection.skinId && selection.championAlias
      ? championArtUrl(
          "loading",
          selection.championAlias,
          skinIndexOf(selection.championId, selection.skinId)
        )
      : null;

  return (
    // `p-0` et `rounded-2xl` ecrasent le `p-6 rounded-3xl` de GlassCard via
    // twMerge : on garde son contour, son highlight de bord haut et son ombre,
    // mais le splash doit aller jusqu'aux bords. `hover={false}` parce que la
    // carte n'est pas cliquable ici.
    <GlassCard
      hover={false}
      className="flex min-h-[150px] flex-1 rounded-2xl bg-white/[0.015] p-0"
    >
      <AnimatePresence mode="wait" initial={false}>
        {artUrl ? (
          <motion.img
            key={`${selection.championId}-${selection.skinId}`}
            src={artUrl}
            alt=""
            // Leger biais vers le haut : quand la fenetre est plus allongee que
            // l'image, le rognage se fait en hauteur, et mieux vaut mordre sur
            // les pieds que sur le visage.
            className="absolute inset-0 h-full w-full object-cover object-[50%_38%]"
            initial={reduced ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <motion.div
            key={hasChampion ? "locking" : "picking"}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45">
              <Hourglass className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="m-0 text-[12.5px] font-semibold text-white/80">
                {hasChampion ? "Lock in your pick" : "Waiting for your pick"}
              </p>
              <p className="m-0 mt-1.5 text-[11px] leading-relaxed text-white/35">
                {hasChampion
                  ? "Rerolls unlock once your champion is locked."
                  : "Your skin shows up here as soon as you lock in."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legende posee SUR le splash plutot qu'en dessous : ca rend la hauteur
          gagnee au splash, et ca evite de dupliquer le message d'attente une
          seconde fois hors de la carte. */}
      {artUrl && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-2.5 pt-12">
          <p className="m-0 truncate text-[14.5px] font-extrabold leading-tight tracking-[-0.015em] text-white">
            {skinName ?? "Loading…"}
          </p>
          <p className="m-0 mt-1 truncate text-[11px] text-white/60">
            {selection.championAlias} · {chromaLabel}
          </p>
        </div>
      )}
    </GlassCard>
  );
}

/* ---------- Bande d'equipe (premade) ---------- */

/**
 * Liste verticale plutot qu'une rangee d'avatars : a 300 px de large, cinq
 * pastilles cote a cote ne laissaient pas la place aux pseudos, et savoir QUI
 * n'a pas encore verrouille vaut mieux que savoir combien.
 *
 * Lecture seule. Kick, invitations et selecteurs de synergie restent dans la
 * grande fenetre : le sidecar n'est pas une seconde app.
 */
function TeamStrip({ room }: { room: CompanionRoomState }) {
  return (
    <div className="mt-3 shrink-0 border-y border-white/[0.06] bg-white/[0.012]">
      <div className="flex items-center gap-2 px-3 pb-1 pt-2">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/35">
          Team
        </span>
        {room.synergyColor && (
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-bold">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/40"
              style={{ background: room.synergyColor }}
              aria-hidden
            />
            <span className="text-white/70">
              {room.synergyCount}/{room.readyCount}
            </span>
          </span>
        )}
      </div>

      <ul className="m-0 list-none p-0 pb-2">
        {room.members.map((m) => (
          <li
            key={m.id}
            className={cn(
              "flex items-center gap-2.5 px-3 py-[3px]",
              !m.ready && "opacity-45"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase",
                m.ready
                  ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                  : "border-white/12 bg-white/[0.04] text-white/50"
              )}
              aria-hidden
            >
              {m.name.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-white/85">
              {m.name}
            </span>
            {m.isSelf && (
              <span className="shrink-0 rounded-full border border-accent/35 bg-accent/15 px-1.5 py-px text-[8.5px] font-extrabold tracking-[0.1em] text-accent">
                YOU
              </span>
            )}
            {m.lockedSkin && (
              <Lock className="h-3 w-3 shrink-0 text-accent" aria-hidden />
            )}
            {m.inSynergy && room.synergyColor ? (
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/35"
                style={{ background: room.synergyColor }}
                aria-hidden
              />
            ) : (
              <span className="h-2.5 w-2.5 shrink-0" aria-hidden />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Actions ---------- */

function Actions({
  canAct,
  pending,
  hasChromas,
  onAction,
  hotkeys,
  matchTeamColor,
  onMatchTeam,
}: {
  canAct: boolean;
  pending: RerollKind | null;
  hasChromas: boolean;
  onAction: (kind: RerollKind) => void;
  /** Accelerateurs actifs. Une entree nulle = pas de pastille affichee. */
  hotkeys: CompanionHotkeyMap;
  /** Couleur dominante si l'utilisateur est owner d'une room, sinon null. */
  matchTeamColor: string | null;
  onMatchTeam: () => void;
}) {
  return (
    <div className="shrink-0 px-3 pb-3 pt-3">
      {matchTeamColor && (
        <button
          type="button"
          onClick={onMatchTeam}
          aria-label="Match the team color"
          className={cn(
            "mb-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl",
            "border border-white/15 bg-white/[0.05] text-[13px] font-bold text-white",
            "transition-colors duration-150 hover:border-white/25 hover:bg-white/[0.09]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/80"
          )}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Match Team
          <span
            className="h-2.5 w-2.5 rounded-full ring-1 ring-white/50"
            style={{ background: matchTeamColor }}
            aria-hidden
          />
        </button>
      )}

      <button
        type="button"
        onClick={() => onAction("both")}
        disabled={!canAct}
        aria-label="Reroll skin and chroma"
        className={cn(
          "flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl",
          "border border-white/20 bg-gradient-to-b from-accent-strong to-accent",
          "text-[15px] font-extrabold tracking-[-0.01em] text-white shadow-accent-glow",
          "transition-shadow duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
          canAct
            ? "hover:shadow-accent-glow-strong"
            : "cursor-not-allowed opacity-45 shadow-none"
        )}
      >
        <Dices
          className={cn("h-5 w-5", pending === "both" && "animate-spin")}
          aria-hidden
        />
        Reroll
        {hotkeys.both && (
          <span className="rounded-full border border-white/25 bg-white/20 px-2 py-0.5 text-[9.5px] font-bold text-white/95">
            {hotkeys.both}
          </span>
        )}
      </button>

      <div className="mt-2 flex gap-2">
        <SecondaryAction
          label="Skin"
          icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />}
          shortcut={hotkeys.skin}
          spinning={pending === "skin"}
          disabled={!canAct}
          onClick={() => onAction("skin")}
        />
        <SecondaryAction
          label="Chroma"
          icon={<Palette className="h-3.5 w-3.5" aria-hidden />}
          shortcut={hotkeys.chroma}
          spinning={pending === "chroma"}
          disabled={!canAct || !hasChromas}
          onClick={() => onAction("chroma")}
        />
      </div>
    </div>
  );
}

function SecondaryAction({
  label,
  icon,
  shortcut,
  spinning,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  /** Accelerateur global, ou null s'il n'a pas pu etre enregistre. */
  shortcut: string | null;
  spinning: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Reroll ${label.toLowerCase()}`}
      aria-keyshortcuts={shortcut ?? undefined}
      className={cn(
        "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl",
        "border border-white/10 bg-white/[0.04] text-[12px] font-semibold text-white/85",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/80",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <span className={cn(spinning && "animate-spin")}>{icon}</span>
      {label}
      {shortcut && (
        <span className="rounded border border-white/10 bg-white/[0.06] px-1 py-px text-[9px] font-bold text-white/50">
          {shortcut}
        </span>
      )}
    </button>
  );
}

/* ---------- Pied ---------- */

function Footer({
  phase,
  matchLocked,
  onToggleLock,
}: {
  phase: string;
  matchLocked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.06] bg-white/[0.012] px-3 py-2">
      <span className="truncate text-[10.5px] text-white/45">
        {phase === "ChampSelect" ? "Champ Select" : phase}
      </span>
      <button
        type="button"
        onClick={onToggleLock}
        aria-pressed={matchLocked}
        aria-label="Lock skin this match"
        title="Lock skin this match"
        className={cn(
          "ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
          "text-[10.5px] font-semibold transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/80",
          matchLocked
            ? "border-accent/45 bg-accent/20 text-accent"
            : "border-white/10 bg-white/[0.04] text-white/55 hover:border-white/20 hover:text-white"
        )}
      >
        {matchLocked ? (
          <Lock className="h-3 w-3" aria-hidden />
        ) : (
          <Unlock className="h-3 w-3" aria-hidden />
        )}
        {matchLocked ? "Locked" : "Unlocked"}
      </button>
    </div>
  );
}
