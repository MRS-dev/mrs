"use client";
import { useParams } from "next/navigation";
import React from "react";
import { usePatient } from "@/queries/patients/usePatient";
const PatientHome: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const patient = usePatient(patientId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* <SessionCalendarCard />
      <SessionProgressCard />
      <PainProgressCard />
      <LastSessionPainCard patientId={patientId} />
      <div className="aspect-video rounded-xl border bg-green-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/4 h-full">
          <svg
            className="triangle-svg h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="0,0 100,100 0,100" fill="yellow" />

            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="green"
              stroke-width="2"
            />
          </svg>
        </div>
        <div className="flex flex-row px-6 py-4 absolute top-0 left-0 w-full h-full ">
          <div className="flex flex-col flex-1 h-full">
            <span className="text-4xl leading-tight font-bold text-yellow-300 block w-full leadin">
              Vitale
            </span>
            <div className="flex flex-row gap-2 flex-1 ">
              <div className="bg-yellow-600 w-10 h-10 rounded-xl"></div>
              <div className="flex flex-col h-full items-start justify-between ">
                <div className="text-xs text-white font-medium">
                  carte d'assurance maladie
                </div>
                <div className="flex flex-col items-start justify-end flex-1">
                  <span className="text-sm font-normal  leading-none">
                    {patientQuery.data?.firstName}
                  </span>
                  <span className="text-sm font-normal  leading-none">
                    {patientQuery.data?.lastName}
                  </span>
                  <span className="text-sm font-normal mt-2 leading-none">
                    {patientQuery.data?.socialSecurityNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/5 min-w-1/5">
            <div className="aspect-[2/3] rounded-sm bg-white w-full relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full bg-neutral-800 rounded-full aspect-square">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1/2 bg-neutral-800 rounded-full aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <h1>Bonjour {patient.data?.firstName}</h1>
    </div>
  );
};

export default PatientHome;
