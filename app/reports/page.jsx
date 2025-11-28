"use client";
import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaUser,
  FaLanguage,
  FaGraduationCap,
  FaBriefcase,
  FaAddressBook,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,FaInbox, FaSearchMinus, FaClipboardList
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { useRouter } from "next/navigation";

import Image from "next/image";
import PrintForm from "@/app/print/PrintForm";
import { createRoot } from "react-dom/client";

import generateApplicationPDF from "@/app/utils/generateApplicationPDF";

export default function ReportsPage() {
  const [interviews, setInterviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState(""); // 🟢 الشركة (من localStorage)
  const router = useRouter();

  // فلاتر
  const [filterName, setFilterName] = useState(null);
  const [filterGender, setFilterGender] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCompany, setFilterCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  if (typeof window !== "undefined") {
    const r = localStorage.getItem("role");
    setRole(r);

    // 🛑 إذا مو admin رجعه للهوم
    if (r !== "admin") {
      router.replace("/home");
    }
  }
}, [router]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const r = localStorage.getItem("role");
      if (!r) return;

      setRole(r);
      const res = await fetch(`/api/reports?role=${r}`);
      const data = await res.json();

      if (data.success) {
        setInterviews(data.data);
        setFiltered(data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
    } finally {
      setLoading(false); // 🟢 توقف اللودينغ بعد الانتهاء
    }
  };

  fetchData();
}, []);
  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...interviews];
  
    if (filterName) {
      result = result.filter((app) =>
        app.fullName?.toLowerCase().includes(filterName.value.toLowerCase())
      );
    }
  
    if (filterGender) {
      result = result.filter(
        (app) => app.gender?.toLowerCase() === filterGender.value.toLowerCase()
      );
    }
  
    if (filterDateFrom) {
      result = result.filter(
        (app) =>
          app.applicationDate &&
          new Date(app.applicationDate) >= new Date(filterDateFrom)
      );
    }
  
    if (filterDateTo) {
      result = result.filter(
        (app) =>
          app.applicationDate &&
          new Date(app.applicationDate) <= new Date(filterDateTo)
      );
    }
  
    if (filterCompany) {
      result = result.filter((app) => app.companyKey === filterCompany.value);
    }
  
    setFiltered(result);
  }, [filterName, filterGender, filterDateFrom, filterDateTo, filterCompany, interviews]);
  // Reset
  const resetFilters = () => {
    setFilterName(null);
    setFilterGender(null);
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCompany(null);
    setFiltered(interviews);
  };

  // خيارات الأسماء
  const nameOptions = [
    ...new Set(interviews.map((app) => app.fullName).filter(Boolean)),
  ].map((n) => ({ value: n, label: n }));

  // خيارات الجندر
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
// 🟢 خيارات الشركات (لما يكون admin)
const companyOptions = [
  { value: "RYD", label: "RYD" },
  { value: "SV", label: "SV" },
  { value: "SVC", label: "SVC" },
];

const handlePrint = () => {
  if (!selected) return alert("❌ لا يوجد طلب محدد للطباعة");

  // إنشاء div مؤقت للطباعة
  const printContainer = document.createElement("div");
  printContainer.id = "printable-form"; // ✅ نستخدم نفس الـ id
  document.body.appendChild(printContainer);

  const root = createRoot(printContainer);
  root.render(<PrintForm data={selected} />);

  setTimeout(() => {
    window.print();
    root.unmount();
    document.body.removeChild(printContainer);
  }, 500);
};
const companyLogos = {
  RYD: "/ryd.png",
  SV: "/sv.png",
  SVC: "/svc.png",
};
  return (
    <div className="p-6 min-h-screen bg-gray-100">
 <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
  {/* Icon */}
  <FaClipboardList className="text-gray-700 text-4xl" />

  {/* Title */}
  <span>Job Applications Report</span>

  {/* Role Text */}
  {role && (
    <span className="text-gray-600 text-xl mt-1">
      – {role === "admin" ? "All Companies" : role.toUpperCase()}
    </span>
  )}
</h1>
      {/* 🔎 الفلاتر */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
      {/* {role === "admin" && (
  <button
    onClick={async () => {
      if (confirm("⚠️ هل أنت متأكد من حذف كل الـ Interviews لجميع الشركات؟")) {
        const res = await fetch("/api/reports/deleteAll", { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          alert("✅ تم مسح كل الـ Interviews");
          setInterviews([]);
          setFiltered([]);
        } else {
          alert("❌ فشل المسح: " + data.error);
        }
      }
    }}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
     Delete All Interviews
  </button>
)} */}
        <div className="w-64">
          <label className="block text-sm font-medium mb-1">Filter by Name</label>
          <Select
          instanceId="name-filter"
            options={nameOptions}
            isClearable
            value={filterName}
            onChange={setFilterName}
            placeholder="Select Name..."
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium mb-1">Filter by Gender</label>
          <Select
          instanceId="gender-filter"
            options={genderOptions}
            isClearable
            value={filterGender}
            onChange={setFilterGender}
            placeholder="Select Gender..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date From</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date To</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
          />
        </div>
        {role === "admin" && (
  <div className="w-48">
    <label className="block text-sm font-medium mb-1">Filter by Company</label>
    <Select
      instanceId="company-filter"
      options={companyOptions}
      isClearable
      value={filterCompany}
      onChange={setFilterCompany}
      placeholder="Select Company..."
    />
  </div>
)}

        <button
          onClick={resetFilters}
          className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>
      {loading ? (
  // 🌀 Loader
  <motion.div
    className="flex flex-col items-center justify-center py-20 bg-white shadow-xl rounded-2xl border border-gray-200"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="relative w-14 h-14 mb-5">
      <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
    <p className="text-gray-600 text-lg font-semibold tracking-wide">
      Loading applications...
    </p>
  </motion.div>
) : interviews.length === 0 ? (
  // ❌ لا توجد بيانات
  <motion.div
    className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <FaInbox className="text-gray-500 text-5xl mb-4" />
    <p className="text-gray-700 text-2xl font-semibold">
      لا توجد بيانات
    </p>
    <p className="text-gray-500 mt-2">
      لم يتم العثور على أي طلبات لغاية الآن
    </p>
  </motion.div>
) : filtered.length === 0 ? (
  // ⚠️ الفلاتر ما جابت نتيجة
  <motion.div
    className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <FaSearchMinus className="text-gray-500 text-5xl mb-4" />
    <p className="text-gray-700 text-2xl font-semibold">
      لا توجد نتائج مطابقة
    </p>
    <p className="text-gray-500 mt-2">
      حاول تعديل الفلاتر للحصول على نتائج
    </p>
  </motion.div>
) : (
  // ✅ جدول البيانات
  <motion.div
    className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-gray-200"
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
  >
    <motion.table
      className="w-full border-collapse text-gray-800"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 text-gray-700 text-lg border-b border-gray-300">
        <tr>
          {[
            "Application Date",
            "Full Name",
            "Gender",
            "Position",
            "Start Date",
            "Marital Status",
            "Kids",
            "Address",
            "Expected Salary",
            "Currency",
          ].map((head, i) => (
            <th
              key={i}
              className="p-4 font-semibold text-left border-x border-gray-200 first:rounded-tl-2xl last:rounded-tr-2xl"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>

      <motion.tbody
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.04 },
          },
        }}
        className="text-base divide-y divide-gray-100"
      >
        {filtered.map((app, index) => (
          <motion.tr
            key={app._id || index}
            onClick={() => setSelected(app)}
            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <td className="p-4 border-x border-gray-100 text-gray-700">
              {app.applicationDate
                ? new Date(app.applicationDate).toLocaleDateString()
                : "-"}
            </td>
            <td className="p-4 border-x border-gray-100 font-semibold text-gray-800">
              {app.fullName || "-"}
            </td>
            <td className="p-4 border-x border-gray-100">{app.gender || "-"}</td>
            <td className="p-4 border-x border-gray-100">{app.position || "-"}</td>
            <td className="p-4 border-x border-gray-100">{app.startDate || "-"}</td>
            <td className="p-4 border-x border-gray-100">{app.maritalStatus || "-"}</td>
            <td className="p-4 border-x border-gray-100 text-center">{app.kids ?? "-"}</td>
            <td className="p-4 border-x border-gray-100">{app.address || "-"}</td>
            <td className="p-4 border-x border-gray-100 font-semibold text-gray-700 text-right">
              {app.otherInfo?.expectedSalary
                ? app.otherInfo.expectedSalary.toLocaleString()
                : "-"}
            </td>
            <td className="p-4 border-x border-gray-100 font-semibold text-gray-700">
  {app.otherInfo?.currency || "-"}
</td>
          </motion.tr>
        ))}
      </motion.tbody>
    </motion.table>

    {/* 🧭 أسفل الجدول */}
    <div className="p-4 bg-gray-50 border-t border-gray-200 text-gray-600 text-sm flex justify-between items-center rounded-b-2xl">
      <span>
        Showing <b>{filtered.length}</b> row
      </span>
      <span className="text-gray-400">Updated automatically</span>
    </div>
  </motion.div>
)}
      {/* Popup */}
      <AnimatePresence>
        {selected && (
          <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              id="printable-popup"
              
            >
              {/* Close */}
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
                onClick={() => setSelected(null)}
              >
                ✖
              </button>
              <div className="absolute top-4 left-4 flex gap-2 no-print">
  {/* زر الطباعة */}
   <button
  onClick={handlePrint}
  className="no-print flex items-center gap-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
>
  <FaPrint className="text-white text-lg" />
  <span className="font-medium">Print</span>
</button> 

  {/* زر تحميل PDF */}
  {/* <button
    onClick={() =>
      generatePDF("printable-popup", `${selected?.fullName || "document"}.pdf`)
    }
    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
  >
    تحميل PDF
  </button> */}
</div>
<h2 className="text-2xl font-bold mb-32 text-center border-b pb-3 flex items-center justify-center gap-4">
  {/* أيقونة الملف */}
  <FaFileAlt className="text-gray-700 text-2xl" />

  {/* النص */}
  <span>تفاصيل الطلب – {selected.fullName}</span>

  {/* لوغو الشركة */}
  {selected.company && companyLogos[selected.company] && (
    <Image
      src={companyLogos[selected.company]}
      alt={`${selected.company} logo`}
      width={100}   // 🔹 عرض أكبر
      height={80}  // 🔹 ارتفاع أكبر
      className="inline-block"
    />
  )}
</h2>

              {/* Application Info */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-gray-600" /> Application Info
                </h3>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <p>
                    <b>Application Date:</b>{" "}
                    {selected.applicationDate
                      ? new Date(selected.applicationDate).toLocaleDateString()
                      : "-"}
                  </p>
                  <p>
                    <b>Full Name:</b> {selected.fullName || "-"}
                  </p>
                  <p>
                    <b>Position:</b> {selected.position || "-"}
                  </p>
                  <p>
  <b>Start Date:</b> {selected.startDate || "-"}
</p>
                </div>
              </section>

              {/* Personal Info */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaUser className="text-gray-600" /> Personal Info
                </h3>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <p>
                    <b>Date of Birth:</b>{" "}
                    {selected.dob
                      ? new Date(selected.dob).toLocaleDateString()
                      : "-"}
                  </p>
                  <p>
                    <b>Gender:</b> {selected.gender || "-"}
                  </p>
                  <p>
                    <b>Marital Status:</b> {selected.maritalStatus || "-"}
                  </p>
                  <p>
                    <b>Kids:</b> {selected.kids ?? "-"}
                  </p>
                  <p className="col-span-2">
                    <b>Address:</b> {selected.address || "-"}
                  </p>
                </div>
              </section>

              {/* Languages */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaLanguage className="text-gray-600" /> Languages
                </h3>
                <p className="mb-2">
                  <b>Mother Tongue:</b> {selected.motherTongue || "-"}
                </p>
                {selected.languages?.map((lang, i) => (
                  <div key={i} className="border rounded-md p-3 mb-2">
                    <p className="font-semibold">{lang.name}</p>
                    <div className="flex gap-6 mt-2 text-gray-700">
                      <span className="flex items-center gap-1">
                        Read:{" "}
                        {lang.read ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        Write:{" "}
                        {lang.write ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        Speak:{" "}
                        {lang.speak ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        Understand:{" "}
                        {lang.understand ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </section>

              {/* Education */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaGraduationCap className="text-gray-600" /> Education
                </h3>
                {selected.degrees?.length ? (
                  <table className="w-full border text-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">From</th>
                        <th className="p-2 border">To</th>
                        <th className="p-2 border">School</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.degrees.map((deg, i) => (
                        <tr key={i}>
                          <td className="p-2 border">
                            {deg.from
                              ? new Date(deg.from).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2 border">
                            {deg.to
                              ? new Date(deg.to).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2 border">{deg.school || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>-</p>
                )}
              </section>

              {/* Employment */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaBriefcase className="text-gray-600" /> Employment
                </h3>
                {selected.jobs?.length ? (
                  <table className="w-full border text-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">From</th>
                        <th className="p-2 border">To</th>
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Company</th>
                        <th className="p-2 border">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.jobs.map((job, i) => (
                        <tr key={i}>
                          <td className="p-2 border">
                            {job.from
                              ? new Date(job.from).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2 border">
                            {job.to
                              ? new Date(job.to).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2 border">{job.title || "-"}</td>
                          <td className="p-2 border">{job.company || "-"}</td>
                          <td className="p-2 border">{job.reason || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>-</p>
                )}
              </section>

              {/* References */}
              <section className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaAddressBook className="text-gray-600" /> References
                </h3>
                {selected.references?.length ? (
                  <table className="w-full border text-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Occupation</th>
                        <th className="p-2 border">Location</th>
                        <th className="p-2 border">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.references.map((ref, i) => (
                        <tr key={i}>
                          <td className="p-2 border">{ref.name || "-"}</td>
                          <td className="p-2 border">
                            {ref.occupation || "-"}
                          </td>
                          <td className="p-2 border">{ref.location || "-"}</td>
                          <td className="p-2 border">{ref.contact || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>-</p>
                )}
              </section>

              {/* Other Info */}
              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaInfoCircle className="text-gray-600" /> Other Info
                </h3>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <p className="flex items-center gap-2">
                    <b>Applied Before:</b>
                    {selected.otherInfo?.appliedBefore === "yes" ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <b>Worked Before:</b>
                    {selected.otherInfo?.workedBefore === "yes" ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <b>Relatives in Company:</b>
                    {selected.otherInfo?.relatives === "yes" ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <b>Car:</b>
                    {selected.otherInfo?.car === "yes" ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <b>Immigrant App:</b>
                    {selected.otherInfo?.immigrantApp === "yes" ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                  </p>
                  <p>
  <b>Expected Salary:</b>{" "}
  {selected.otherInfo?.expectedSalary
    ? Number(selected.otherInfo.expectedSalary).toLocaleString()
    : "-"}{" "}
  <span className="text-gray-600">
    {selected.otherInfo?.currency ? `${selected.otherInfo.currency}` : ""}
  </span>
</p>
                </div>
              
              </section>

              <div
  id="print-footer"
  className="flex items-center justify-center gap-2 text-gray-600 mt-32 text-sm"
>
  <span>© 2025</span>
  <img
    src="/SPC.png"
    alt="SPC Logo"
    className="w-10 h-5 inline-block"   // ← حجم صغير (20px × 20px)
  />
  <span>– All Rights Reserved</span>
</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}