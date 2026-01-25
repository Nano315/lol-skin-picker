import fallbackSkin from "/fallback-skin.png?url";
import PriorityButtons from "./PriorityButtons";

export default function SkinPreview({
  selection,
  showPriorityButtons = true,
}: {
  selection: {
    championId: number;
    championAlias: string;
    skinId: number;
    chromaId: number;
  };
  showPriorityButtons?: boolean;
}) {
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";
  const displayedSkin = splashUrl || fallbackSkin;

  const hasSkin = selection.skinId > 0 && selection.championId > 0;

  return (
    <div className="skin-wrapper">
      <img src={displayedSkin} alt="current skin" className="skin-img" />
      {showPriorityButtons && hasSkin && (
        <div className="skin-priority-overlay">
          <PriorityButtons
            championId={selection.championId}
            skinId={selection.skinId}
          />
        </div>
      )}
    </div>
  );
}
