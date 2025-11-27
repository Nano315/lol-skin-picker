import fallbackSkin from "/fallback-skin.png?url";

export default function SkinPreview({
  selection,
}: {
  selection: {
    championId: number;
    championAlias: string;
    skinId: number;
    chromaId: number;
  };
}) {
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";
  const displayedSkin = splashUrl || fallbackSkin;

  return (
    <div className="skin-wrapper">
      <img src={displayedSkin} alt="current skin" className="skin-img" />
    </div>
  );
}
