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
  FaPrint
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { useRouter } from "next/navigation";
import generatePDF from "@/app/utils/generatePDF";
import Image from "next/image";
import PrintForm from "@/app/print/PrintForm";
import { createRoot } from "react-dom/client";



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
        if (!r) {
          console.warn("⚠️ No role found for current user");
          return;
        }
  
        setRole(r); // 🟢 نخزن الشركة بالـ state
  
        // 🟢 نبعث role بالـ query للـ API
        const res = await fetch(`/api/reports?role=${r}`);
        const data = await res.json();
        if (data.success) {
          setInterviews(data.data);
          setFiltered(data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
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
    <h1 className="text-3xl font-bold mb-6">
  📋 Job Applications Report{" "}
  {role && (
    <span className="text-gray-600">
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

      {/* جدول */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700 text-lg">
            <tr>
              <th className="p-3 border">Application Date</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">Position</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">Marital Status</th>
              <th className="p-3 border">Kids</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Expected Salary</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {filtered.map((app) => (
              <tr
                key={app._id}
                onClick={() => setSelected(app)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="p-2 border">
                  {app.applicationDate
                    ? new Date(app.applicationDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border">{app.fullName || "-"}</td>
                <td className="p-2 border">{app.gender || "-"}</td>
                <td className="p-2 border">{app.position || "-"}</td>
                <td className="p-2 border">
  {app.startDate || "-"}
</td>
                <td className="p-2 border">{app.maritalStatus || "-"}</td>
                <td className="p-2 border">{app.kids ?? "-"}</td>
                <td className="p-2 border">{app.address || "-"}</td>
                <td className="p-2 border">
                  {app.otherInfo?.expectedSalary
                    ? app.otherInfo.expectedSalary.toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  className="no-print flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
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
    : "-"}
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