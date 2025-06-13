"use client";

import React, { useEffect, useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Plus,
  Search,
  MousePointerClick,
  EyeIcon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useModal } from "@/hooks/useModale";
import GridLayout from "@/components/mrs/GridLayout";
import { useAds } from "@/queries/ads/useAds";
import { useToggleAdEnabled } from "@/queries/ads/useAd";
import { CreateAdModal } from "@/components/modals/CreateAdModal";
import { ViewAdModal } from "@/components/modals/ViewAdModal";

const Ads: React.FC = () => {
  const [selectedAdId, setSelectedAdId] = useState<string>("");
  const createAdModal = useModal();
  const viewAdModal = useModal();
  const adsQuery = useAds();
  const toggleAdEnabled = useToggleAdEnabled();

  const clickOnAd = (ad: { id: string }) => {
    setSelectedAdId(ad.id);
  };

  useEffect(() => {
    if (selectedAdId) {
      viewAdModal.onOpen();
    }
  }, [selectedAdId, viewAdModal]);

  const ads = useMemo(() => {
    return adsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  }, [adsQuery.data]);

  const handleCloseModal = () => {
    setSelectedAdId("");
    viewAdModal.onClose();
  };

  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Publicités</h1>
              <div className="flex flex-row items-center space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher"
                    className="pl-10"
                  />
                  <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <Button variant="default" onClick={createAdModal.onOpen}>
                  <Plus className="w-4 h-4" />
                  <span>Créer</span>
                </Button>
              </div>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="h-full flex-1 p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
          <GridLayout
            items={ads}
            renderGridItem={(ad) => (
              <div
                key={ad.id}
                onClick={() => clickOnAd(ad)}
                className="bg-background rounded-xl border shadow-sm p-4 flex flex-row items-start gap-2 hover:shadow-md cursor-pointer w-full overflow-hidden group"
              >
                <div
                  className="w-14 min-w-14 aspect-square rounded-xl bg-muted"
                  style={{
                    backgroundImage: `url(${ad.photoUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex flex-row items-center justify-between truncate w-full">
                    <h3 className="text-base font-semibold truncate">
                      {ad.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* Activer/Désactiver */}

                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 w-full">
                    {ad.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                      {ad.views}
                      <EyeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                      {ad.clicks}
                      <MousePointerClick className="w-4 h-4" />
                    </div>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="transition-colors p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAdEnabled.mutate({
                          id: ad.id,
                          enable: !ad.enable,
                        });
                      }}
                      disabled={toggleAdEnabled.isPending}
                      title={ad.enable ? "Désactiver" : "Activer"}
                    >
                      {ad.enable ? (
                        <ToggleRight className="w-30 h-30 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-30 h-30 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            keyExtractor={(ad) => ad.id}
            isLoading={adsQuery.isLoading}
            hasMore={adsQuery.hasNextPage}
            onLoadMore={() => adsQuery.fetchNextPage()}
            isLoadingMore={adsQuery.isFetchingNextPage}
          />
        </div>
      </SidebarLayout>

      <CreateAdModal {...createAdModal} />
      <ViewAdModal
        {...viewAdModal}
        adId={selectedAdId}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Ads;
