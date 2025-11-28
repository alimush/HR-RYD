"use client";
import Image from "next/image";
import {
  FaFileAlt,
  FaUser,
  FaLanguage,
  FaGraduationCap,
  FaBriefcase,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaAddressBook,
} from "react-icons/fa";
import { useRef } from "react";

export default function PrintForm({ data }) {
  const ref = useRef(null);

  const companyLogos = {
    RYD: "/ryd.png",
    SV: "/sv.png",
    SVC: "/svc.png",
  };

  if (!data)
    return <p className="text-center mt-10 text-gray-500">No data to print</p>;

  return (
    <div
      ref={ref}
      id="printable-form"
      className="w-[210mm] h-[297mm] bg-white text-black text-[12px] leading-[1.4] flex flex-col justify-between"
    >
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-gray-300 pb-2 px-10 pt-8 text-left">
        <div className="flex items-center gap-3">
          <FaFileAlt className="text-gray-700 text-xl" />
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            تفاصيل الطلب – {data.fullName}
          </h2>
        </div>
        {data.company && companyLogos[data.company] && (
         <Image
         src={companyLogos[data.company]}
         alt={`${data.company} logo`}
         width={130}   // 👈 كان 85
         height={70}   // 👈 كان 45
         className="object-contain"
       />
        )}
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-10 py-4 text-left">
        {/* Application Info */}
        <section className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaFileAlt className="text-gray-600" /> Application Info
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
            <p>
              <b>Application Date:</b>{" "}
              {data.applicationDate
                ? new Date(data.applicationDate).toLocaleDateString()
                : "-"}
            </p>
            <p>
              <b>Full Name:</b> {data.fullName || "-"}
            </p>
            <p>
              <b>Position:</b> {data.position || "-"}
            </p>
            <p>
              <b>Start Date:</b> {data.startDate || "-"}
            </p>
          </div>
        </section>

        {/* Personal Info */}
        <section className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaUser className="text-gray-600" /> Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
            <p>
              <b>Date of Birth:</b>{" "}
              {data.dob ? new Date(data.dob).toLocaleDateString() : "-"}
            </p>
            <p>
              <b>Gender:</b> {data.gender || "-"}
            </p>
            <p>
              <b>Marital Status:</b> {data.maritalStatus || "-"}
            </p>
            <p>
              <b>Kids:</b> {data.kids ?? "-"}
            </p>
            <p className="col-span-2">
              <b>Address:</b> {data.address || "-"}
            </p>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaLanguage className="text-gray-600" /> Languages
          </h3>
          <p className="mb-3 text-[12px]">
            <b>Mother Tongue:</b> {data.motherTongue || "-"}
          </p>
          {data.languages?.map((lang, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-md p-2 mb-2 bg-gray-50"
            >
              <p className="font-semibold text-gray-800">{lang.name}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-1 text-gray-700 text-[11px]">
                {["read", "write", "speak", "understand"].map((key) => (
                  <span key={key} className="flex items-center gap-2 capitalize">
                    <span className="text-gray-600">{key}:</span>
                    {lang[key] ? (
                      <FaCheckCircle className="text-green-600 text-[12px]" />
                    ) : (
                      <FaTimesCircle className="text-red-600 text-[12px]" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaGraduationCap className="text-gray-600" /> Education
          </h3>
          {data.degrees?.length ? (
            <table className="w-full border text-[11px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 text-left">From</th>
                  <th className="border p-1 text-left">To</th>
                  <th className="border p-1 text-left">School</th>
                </tr>
              </thead>
              <tbody>
                {data.degrees.map((deg, i) => (
                  <tr key={i}>
                    <td className="border p-1">
                      {deg.from
                        ? new Date(deg.from).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border p-1">
                      {deg.to
                        ? new Date(deg.to).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border p-1">{deg.school || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>-</p>
          )}
        </section>

        {/* Employment */}
        <section className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaBriefcase className="text-gray-600" /> Employment
          </h3>
          {data.jobs?.length ? (
            <table className="w-full border text-[11px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 text-left">From</th>
                  <th className="border p-1 text-left">To</th>
                  <th className="border p-1 text-left">Title</th>
                  <th className="border p-1 text-left">Company</th>
                  <th className="border p-1 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.map((job, i) => (
                  <tr key={i}>
                    <td className="border p-1">
                      {job.from
                        ? new Date(job.from).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border p-1">
                      {job.to
                        ? new Date(job.to).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border p-1">{job.title || "-"}</td>
                    <td className="border p-1">{job.company || "-"}</td>
                    <td className="border p-1">{job.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>-</p>
          )}
        </section>

        {/* References */}
        {data.references?.length ? (
          <section className="mb-4 border-b border-gray-200 pb-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
              <FaAddressBook className="text-gray-600" /> References
            </h3>
            <table className="w-full border text-[11px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 text-left">Name</th>
                  <th className="border p-1 text-left">Occupation</th>
                  <th className="border p-1 text-left">Location</th>
                  <th className="border p-1 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {data.references.map((ref, i) => (
                  <tr key={i}>
                    <td className="border p-1">{ref.name || "-"}</td>
                    <td className="border p-1">{ref.occupation || "-"}</td>
                    <td className="border p-1">{ref.location || "-"}</td>
                    <td className="border p-1">{ref.contact || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {/* Other Info */}
        <section className="text-left mb-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
            <FaInfoCircle className="text-gray-600" /> Other Info
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
            {[
              { label: "Applied Before", value: data.otherInfo?.appliedBefore },
              { label: "Worked Before", value: data.otherInfo?.workedBefore },
              { label: "Relatives in Company", value: data.otherInfo?.relatives },
              { label: "Car", value: data.otherInfo?.car },
              { label: "Immigrant App", value: data.otherInfo?.immigrantApp },
            ].map((item, i) => (
              <p key={i} className="flex items-center gap-2">
                <b className="min-w-[140px]">{item.label}:</b>
                {item.value === "yes" ? (
                  <FaCheckCircle className="text-green-600 text-[13px]" />
                ) : (
                  <FaTimesCircle className="text-red-600 text-[13px]" />
                )}
              </p>
            ))}

<p>
  <b>Expected Salary:</b>{" "}
  {data.otherInfo?.expectedSalary
    ? Number(data.otherInfo.expectedSalary).toLocaleString()
    : "-"}{" "}
  <span className="text-gray-600">
    {data.otherInfo?.currency ? `${data.otherInfo.currency}` : ""}
  </span>
</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-300 text-center py-3 text-gray-600 text-[10px] mt-auto">
        <span>© 2025</span>
        <img
          src="/SPC.png"
          alt="SPC Logo"
          className="w-4 h-4 inline-block mx-1 align-middle"
        />
        <span>All Rights Reserved</span>
      </footer>

      {/* 🖨️ PRINT STYLING */}
      <style jsx global>{`
     @page {
  size: A4;
  margin: -12mm 0 0 0; /* top right bottom left */
}
        @media print {
          html,
          body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: #fff;
          }

          body > *:not(#printable-form) {
            display: none !important;
          }

          #printable-form {
            width: 200mm !important;
            height: 281mm !important;
            margin-left: 0 !important;
            margin-top: 8mm !important;
            margin-bottom: 8mm !important;
            padding: 0 6mm !important;
            transform: scale(0.96);
            transform-origin: top left;
            background: #fff !important;
            overflow: visible !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

         @media print {
  table {
    border-collapse: collapse !important;
    width: 100% !important;
    font-size: 9px !important;        /* 👈 حجم خط أصغر */
    transform: scale(0.9);            /* 👈 تصغير الجدول نفسه */
    transform-origin: top left;
  }

  th,
  td {
    padding: 1px 2px !important;      /* 👈 تقليل الحشوة أكثر */
    font-size: 9px !important;        /* 👈 حجم خط أصغر داخل الخلايا */
    line-height: 1.1 !important;      /* 👈 تقليل المسافة بين الأسطر */
  }
}

          .no-print,
          button {
            display: none !important;
          }

          footer {
            position: relative !important;
            bottom: 0 !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}