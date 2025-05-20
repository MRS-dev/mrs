import { Suspense } from "react";
import NewSession from "./NewSession";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewSession />
    </Suspense>
  );
}
