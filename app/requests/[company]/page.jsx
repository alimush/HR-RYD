"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import InterviewForm from "@/components/InterviewForm";

export default function CompanyPage({ params }) {
  // ✅ نستخدم React.use() حتى نفك الـ params
  const { company } = React.use(params);

  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const r = localStorage.getItem("role"); // role مال اليوزر
      setRole(r);

      if (r !== "admin" && r !== company) {
        router.replace("/home"); // 🚫 يمنع غير شركته
      } else {
        setLoading(false);
      }
    }
  }, [company, router]);

  if (loading) {
    return <p className="text-center mt-20">⏳ Loading...</p>;
  }

  return (
    <div className="p-6">
      <InterviewForm company={company} />
    </div>
  );
}