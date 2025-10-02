"use client";

import dynamic from "next/dynamic";

const FinancingForm = dynamic(
  () => import("@/components/FinancingForm/FinancingForm"),
  { ssr: false }
);

export default function FinancingFormPage() {
  return <FinancingForm />;
}
