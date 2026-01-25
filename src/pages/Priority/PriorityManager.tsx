import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChampionPriorities } from "@/features/priority/usePriority";
import type { Priority } from "@/features/priority/priorityStore";

type FilterType = "all" | "favorites" | "deprioritized";

export default function PriorityManager() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection] = useSelection();

  const championId = selection.championId;
  const { priorities, setSkinPriority, favoriteAll, resetAll, loading } =
    useChampionPriorities(championId);

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredSkins = useMemo(() => {
    if (!skins.length) return [];

    return skins.filter((skin) => {
      const priority = priorities[skin.id] ?? null;
      if (filter === "favorites") return priority === "favorite";
      if (filter === "deprioritized") return priority === "deprioritized";
      return true;
    });
  }, [skins, priorities, filter]);

  const stats = useMemo(() => {
    const total = skins.length;
    const favorites = skins.filter((s) => priorities[s.id] === "favorite").length;
    const deprioritized = skins.filter((s) => priorities[s.id] === "deprioritized").length;
    return { total, favorites, deprioritized };
  }, [skins, priorities]);

  const handlePriorityChange = (skinId: number, priority: Priority) => {
    setSkinPriority(skinId, priority);
  };

  const handleFavoriteAll = () => {
    const skinIds = skins.map((s) => s.id);
    favoriteAll(skinIds);
  };

  const handleResetAll = () => {
    resetAll();
  };

  const hasChampion = championId > 0;

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main priority-main">
        <div className="page-shell priority-shell">
          <div className="priority-layout">
            {/* Header Section */}
            <section className="card priority-header-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">SKIN PRIORITY</p>
                  <h2 className="card-title">
                    {hasChampion
                      ? `${selection.championAlias || "Champion"} Skins`
                      : "Select a Champion"}
                  </h2>
                </div>
                {hasChampion && (
                  <div className="priority-stats">
                    <span className="stat-badge">
                      <span className="stat-icon favorite">&#9733;</span>
                      {stats.favorites}
                    </span>
                    <span className="stat-badge">
                      <span className="stat-icon deprioritized">&#8856;</span>
                      {stats.deprioritized}
                    </span>
                    <span className="stat-badge total">{stats.total} skins</span>
                  </div>
                )}
              </div>

              {!hasChampion && (
                <p className="priority-hint">
                  Lock in a champion in champ select to manage skin priorities.
                </p>
              )}

              {hasChampion && (
                <div className="priority-controls">
                  <div className="filter-group">
                    <button
                      className={`filter-btn ${filter === "all" ? "active" : ""}`}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={`filter-btn ${filter === "favorites" ? "active" : ""}`}
                      onClick={() => setFilter("favorites")}
                    >
                      Favorites
                    </button>
                    <button
                      className={`filter-btn ${filter === "deprioritized" ? "active" : ""}`}
                      onClick={() => setFilter("deprioritized")}
                    >
                      Deprioritized
                    </button>
                  </div>

                  <div className="bulk-actions">
                    <button
                      className="bulk-btn favorite-all"
                      onClick={handleFavoriteAll}
                      disabled={loading}
                    >
                      Favorite All
                    </button>
                    <button
                      className="bulk-btn reset-all"
                      onClick={handleResetAll}
                      disabled={loading}
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Skins List */}
            {hasChampion && (
              <section className="card priority-list-card">
                <div className="priority-skin-list">
                  {filteredSkins.length === 0 ? (
                    <p className="no-skins-msg">
                      {filter === "all"
                        ? "No owned skins for this champion."
                        : `No ${filter} skins.`}
                    </p>
                  ) : (
                    filteredSkins.map((skin) => {
                      const priority = priorities[skin.id] ?? null;
                      const skinNum = skin.id - championId * 1000;
                      const imgUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${selection.championAlias}_${skinNum}.jpg`;

                      return (
                        <div key={skin.id} className="priority-skin-item">
                          <div className="skin-thumb-wrapper">
                            <img
                              src={imgUrl}
                              alt={skin.name}
                              className="skin-thumb"
                              loading="lazy"
                            />
                          </div>
                          <div className="skin-info">
                            <span className="skin-name">{skin.name}</span>
                            {skin.chromas.length > 0 && (
                              <span className="chroma-count">
                                +{skin.chromas.length} chromas
                              </span>
                            )}
                          </div>
                          <div className="priority-toggles">
                            <button
                              className={`priority-toggle favorite ${
                                priority === "favorite" ? "active" : ""
                              }`}
                              onClick={() =>
                                handlePriorityChange(
                                  skin.id,
                                  priority === "favorite" ? null : "favorite"
                                )
                              }
                              title="Toggle favorite"
                            >
                              &#9733;
                            </button>
                            <button
                              className={`priority-toggle deprioritize ${
                                priority === "deprioritized" ? "active" : ""
                              }`}
                              onClick={() =>
                                handlePriorityChange(
                                  skin.id,
                                  priority === "deprioritized" ? null : "deprioritized"
                                )
                              }
                              title="Toggle deprioritized"
                            >
                              &#8856;
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
