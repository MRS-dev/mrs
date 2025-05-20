import { Suspense } from "react";
import PatientInvitation from "./PatientInvitation";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientInvitation />
    </Suspense>
  );
}
