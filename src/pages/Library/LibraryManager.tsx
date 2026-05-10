import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedChampions } from "@/features/championLibrary/useChampionLibrary";
import { useAllExclusions } from "@/features/exclusions/useExclusions";
import { GradientText } from "@/components/ui";
import { EmptyState } from "@/components/empty/EmptyState";
import { BookOpen } from "lucide-react";
import { ChampionList } from "./ChampionList";
import { ChampionDetail } from "./ChampionDetail";

// Module-level memo so leaving and re-entering the Library page keeps the
// previously-selected champion. Survives navigation, resets on app restart.
let lastSelectedChampionId: number | null = null;

export default function LibraryManager() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const {
    champions,
    loading: loadingChampions,
    refresh: refreshChampions,
  } = useOwnedChampions();
  const { all: allExclusions, refresh: refreshExclusions } = useAllExclusions();

  const [selectedId, setSelectedId] = useState<number | null>(
    lastSelectedChampionId
  );

  useEffect(() => {
    lastSelectedChampionId = selectedId;
  }, [selectedId]);

  // If the persisted selection no longer matches an owned champion (skins
  // re-fetched, champ no longer owned, etc.), drop it so ChampionList's
  // auto-select kicks back in.
  useEffect(() => {
    if (
      selectedId !== null &&
      champions.length > 0 &&
      !champions.some((c) => c.id === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [selectedId, champions]);

  const selectedChampion =
    selectedId !== null ? champions.find((c) => c.id === selectedId) ?? null : null;

  const isReady = status === "connected";

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[1120px] px-2 sm:px-4">
          {!isReady ? (
            <div className="mx-auto max-w-[720px]">
              <EmptyState
                icon={<BookOpen className="h-6 w-6" aria-hidden />}
                eyebrow="Library"
                title={
                  <>
                    Connect your <GradientText>Client</GradientText>
                  </>
                }
                description="Your owned champions and skins load in as soon as the League client is detected — then you can curate which skins the random pool can pick from."
                status={{
                  label:
                    status === "checking"
                      ? "Looking for the client…"
                      : "Client not detected",
                  tone: "warning",
                }}
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
              <ChampionList
                champions={champions}
                exclusionsByChampion={allExclusions}
                selectedId={selectedId}
                onSelect={setSelectedId}
                loading={loadingChampions}
                onRefresh={refreshChampions}
              />
              <ChampionDetail
                champion={selectedChampion}
                onExclusionsChange={refreshExclusions}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
