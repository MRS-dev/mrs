// components/PickerModal.tsx
"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { Search, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModale";
import { MrsModal, MrsModalContent, MrsModalTitle } from "../mrs/MrsModal";
/**
 * Props génériques pour créer un Picker dans un Modal.
 * T représente le type de chaque élément (patient, user, produit, etc.).
 */
interface PickerModalProps<T> {
  value: string; // L'ID (ou tout identifiant) sélectionné
  title: string;
  placeholder: string;

  // Données
  items: T[]; // Les éléments à afficher
  isLoading: boolean; // Indique si on est en cours de chargement
  hasMore: boolean; // Indique s'il y a plus de pages à charger
  onLoadMore: () => void; // Fonction pour charger la page suivante

  // Fonctions de rendu
  renderItem: (item: T) => ReactNode; // Comment on affiche un item dans la liste
  renderValue: ({
    item,
    value,
  }: {
    item: T | null;
    value: string;
  }) => ReactNode; // Comment on affiche la valeur sélectionnée (ex: label)

  // Extracteurs
  keyExtractor: (item: T) => string; // Clé unique pour React
  valueExtractor: (item: T) => string; // Récupérer la "value" (ID) depuis l'item

  // Recherche
  search: string; // Valeur actuelle du champ de recherche
  onSearch: (search: string) => void; // Callback quand l'utilisateur tape dans le champ

  // Sélection
  onSelect: (value: string) => void; // Callback quand un item est sélectionné
  className?: string;
  totalCount?: number;
  resultsCount?: number;
}

export function PickerModal<T>({
  // Contrôle du formulaire
  value,
  title,
  placeholder,

  // Données
  items,
  isLoading,
  hasMore,
  onLoadMore,

  // Fonctions de rendu
  renderItem,
  renderValue,

  // Extracteurs
  keyExtractor,
  valueExtractor,

  // Recherche
  search,
  onSearch,

  // Sélection
  onSelect,
  className,
  totalCount,
  resultsCount,
}: PickerModalProps<T>) {
  const modal = useModal();
  const listboxId = "picker-modal-listbox";

  const handleItemSelect = (newValue: string) => {
    onSelect(newValue);
    modal.onClose();
  };
  const currentValue = useMemo(() => {
    return items.find((item) => valueExtractor(item) === value) || null;
  }, [items, value, valueExtractor]);

  console.log("CURRENT_VALUE", currentValue);
  return (
    <>
      {/* Bouton qui ouvre le modal */}
      <button
        onClick={modal.onOpen}
        className={cn(
          "flex items-center justify-center  rounded-xl flex-row h-11  bg-muted space-x-2 px-4 !border w-full",
          currentValue ? "text-foreground" : "text-muted-foreground",
          className
        )}
        aria-expanded={modal.open}
        role="combobox"
        aria-controls={listboxId}
      >
        <div className="flex flex-row items-center justify-start flex-1">
          {!!currentValue ? (
            renderValue({ item: currentValue, value })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="w-4 h-4 ml-2" />
      </button>

      <MrsModal open={modal.open} onOpenChange={modal.onOpenChange}>
        <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[80vh] min-h-[50vh] gap-0">
          {/* Header du modal */}
          <div className="p-4 shadow-sm z-10 ">
            {title && (
              <MrsModalTitle className="text-lg font-semibold mb-2">
                {title}
              </MrsModalTitle>
            )}

            {/* Champ de recherche */}
            <div className="relative">
              <Input
                className="pl-10"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute left-0 top-0 flex items-center h-full w-10 pointer-events-none justify-center">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Corps du modal : la liste */}
          <div className="flex flex-col flex-1 overflow-hidden rounded-b-xl bg-muted/50">
            <ScrollArea className="flex-1 overflow-auto" id={listboxId}>
              <div className="flex flex-col p-2 gap-2 ">
                {items.map((item) => (
                  <div
                    key={keyExtractor(item)}
                    className="cursor-pointer"
                    onClick={() => handleItemSelect(valueExtractor(item))}
                  >
                    {renderItem(item)}
                  </div>
                ))}
              </div>

              {/* Bouton "Voir plus" (pagination) */}
              {hasMore && (
                <div className="flex flex-row items-center justify-center mt-2">
                  <Button
                    variant="outline"
                    onClick={onLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Voir plus"
                    )}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
          <div className="flex flex-row items-center justify-center border rounded-xl p-2 bg-background text-muted-foreground text-xs">
            {resultsCount} sur {totalCount} résultats
          </div>
        </MrsModalContent>
      </MrsModal>
    </>
  );
}
