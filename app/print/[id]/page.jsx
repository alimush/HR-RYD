"use client";
import PrintForm from "@/app/print/PrintForm";
import { useSearchParams } from "next/navigation";

export default function PrintPage() {
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data") || "{}");

  return (
    <div className="p-8">
      <PrintForm data={data} />
    </div>
  );
}