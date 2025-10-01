import fallbackSkin from "/fallback-skin.png?url";

export default function SkinPreview({
  selection,
  chromaColor,
}: {
  selection: {
    championId: number;
    championAlias: string;
    skinId: number;
    chromaId: number;
  };
  chromaColor: string | null;
}) {
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";
  const displayedSkin = splashUrl || fallbackSkin;

  return (
    <div
      className="skin-wrapper"
      style={
        chromaColor
          ? { boxShadow: `1px 1px 111.3px 50px ${chromaColor}` }
          : undefined
      }
    >
      <img
        src={displayedSkin}
        alt="current skin"
        className="skin-img"
        width="660"
        height="371"
      />
    </div>
  );
}
