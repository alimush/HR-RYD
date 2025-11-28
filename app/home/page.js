"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// كل الشركات
const cards = [
  { key: "RYD", name: " AlRiyad", logo: "/ryd.png" },
  { key: "SV", name: " AlMehwar", logo: "/SV.png" },
  { key: "SVC", name: " SVC", logo: "/svc.png" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { y: 20, scale: 0.95 },
  show: { y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const r = localStorage.getItem("role"); // 🟢 نجيب role من localStorage
      setRole(r);
    }
  }, []);

  // إذا بعده ما جاب role
  if (!role) {
    return <p className="text-center mt-20">⏳ Loading...</p>;
  }

  // 🟢 فلترة الشركات حسب role
  const visibleCards =
    role === "admin" ? cards : cards.filter((c) => c.key === role);

  return (
    <div className="min-h-screen relative p-6 md:p-10 overflow-hidden 
                    bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* الهيدر */}
      <div className="max-w-6xl mx-auto mb-10 text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold 
                     bg-gradient-to-r from-gray-400 via-gray-600 to-slate-800
                     text-transparent bg-clip-text"
        >
          Companies Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="mt-2 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800 
                     text-transparent bg-clip-text"
        >
          اختر الشركة لعرض تفاصيل الطلبات
        </motion.p>
      </div>

      <motion.div
  className={`max-w-4xl mx-auto gap-6 ${
    visibleCards.length === 1
      ? "flex justify-center items-center min-h-[50vh]" // 🟢 حالة كارت واحد بالنص
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
  }`}
  variants={container}
  initial="hidden"
  animate="show"
>
{visibleCards.map((c, idx) => (
  <Link key={idx} href={`/requests/${c.key}`} passHref>
    <motion.div
      variants={item}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative cursor-pointer rounded-2xl
                 border border-gray-200 bg-white/70
                 backdrop-blur-md shadow-md hover:shadow-xl
                 ring-1 ring-gray-200/50 hover:ring-2 hover:ring-gray-300/70
                 transition-all duration-300 text-center flex flex-col items-center
                 w-56 h-56 sm:w-60 sm:h-60 m-6"
    >
      {/* 🔹 اللوغو داخل المربع الكبير مباشرة */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src={c.logo}
          alt={`${c.name} logo`}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 🔹 اسم الشركة */}
      <h2 className="absolute bottom-4 text-lg font-semibold tracking-tight text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-1 rounded-lg shadow-sm">
        {c.name}
      </h2>
    </motion.div>
  </Link>
))}
</motion.div>
    </div>
  );
}