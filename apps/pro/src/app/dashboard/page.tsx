import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <SidebarLayout
      className="overflow-hidden h-screen"
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">Messagerie</h1>
            <div className="flex flex-row items-center space-x-3">
              <Button>
                <Plus /> Nouveau chat
              </Button>
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Messagerie</h1>
      </div>
    </SidebarLayout>
  );
}
