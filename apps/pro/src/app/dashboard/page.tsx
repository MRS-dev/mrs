"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import { useUser } from "@/queries/user/useUser";
import Link from "next/link";

const Home: React.FC = () => {
  const userQuery = useUser();
  // const { isSubscribed } = useSubscription();
  const router = useRouter();

  const handleClick = () => {
    router.push("/account/billing");
  };

  const isSubscribed = true;
  return (
    <SidebarLayout className="max-h-screen h-screen bg-muted/50 overflow-auto">
      <div className="p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full flex flex-col gap-5">
        <div className="min-h-32 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2 items-">
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">
                Bonjour,{" "}
                <span className="text-primary">
                  {userQuery.data?.data?.user.name}{" "}
                  {userQuery.data?.data?.user?.lastName}
                </span>{" "}
                ! 👋
              </h1>
            </div>
            <p className="text-muted-foreground">
              {`Vous pouvez commencer à utiliser l'application en cliquant sur
              l'onglet "Exercices"`}
            </p>
          </div>
          <Button
            variant="secondary"
            className="border bg-background"
            size="icon"
          >
            <Bell />
          </Button>
        </div>
        <div className="bg-primary/10 rounded-xl p-4 text-primary max-w-2xl w-full flex flex-row gap-4 items-start justify-start">
          <div className="h-20 aspect-square rounded-xl bg-primary/20"></div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold ">Nouveautés</h2>
            <p className="text-base">
              Vous pouvez maintenant ajouter des patients à votre liste de
              patients. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos.
            </p>
          </div>
        </div>
        {!isSubscribed && (
          <div
            className="bg-red-50 rounded-xl p-4 text-red-600 w-full flex flex-row gap-4 items-start justify-start cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold ">
                /!\ Attention, vous n&apos;êtes pas encore abonné
              </h2>
              <p className="text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-foreground">
            {" "}
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Nouveau patient"
              description="Ajouter un nouveau patient"
              buttonLabel="Ajouter"
              to={ROUTES.newPatient}
            />
            <QuickActionCard
              title="Nouvelle séance"
              description="Créer une nouvelle séance"
              buttonLabel="Créer"
              to={ROUTES.newSession}
            />
            <QuickActionCard
              title="Nouvelle modèle de séance"
              description="Créer une nouvelle modèle de séance"
              buttonLabel="Créer"
              to={ROUTES.workoutTemplate("new")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-foreground">
            Derniers patients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="min-h-44 bg-background rounded-xl border"></div>
            <div className="min-h-44 bg-background rounded-xl border"></div>
            <div className="min-h-44 bg-background rounded-xl border"></div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

interface QuickActionCard {
  title: string;
  description: string;
  buttonLabel: string;
  to: string;
}

const QuickActionCard = ({
  title,
  description,
  buttonLabel,
  to,
}: QuickActionCard) => {
  return (
    <div className=" bg-background rounded-xl border flex flex-row overflow-hidden">
      <div className="flex flex-col flex-1 p-4 max-w-full overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground line-clamp-1 w-full max-w-full">
          {title}
        </h2>
        <p className="text-base text-muted-foreground line-clamp-2  w-full max-w-full">
          {description}
        </p>
        <div className="mt-4 flex flex-row justify-end items-end">
          <Button className="mt-auto" variant="primary-light" asChild>
            <Link href={to}>{buttonLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Home;
