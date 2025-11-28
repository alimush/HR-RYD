"use client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React from "react";
import { createRoot } from "react-dom/client";

/*******************************************************
 * 🌍 Elegant A4 PDF Layout — Compact & Polished Design
 *******************************************************/
export default async function generateApplicationPDF(data) {
  if (!data) {
    alert("❌ لا توجد بيانات للطباعة");
    return;
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "-");
  const isArabic = /[\u0600-\u06FF]/.test(data.fullName || "");
  const direction = isArabic ? "rtl" : "ltr";

  // 🧱 Temporary printable container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.background = "#f0f2f5";
  document.body.appendChild(container);

  /******** Printable Layout ********/
  const Printable = () => (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        id="pdf-content"
        dir={direction}
        style={{
          fontFamily: "'Cairo','Poppins',sans-serif",
          backgroundColor: "#f9fafb",
          color: "#111",
          width: "210mm",
          minHeight: "297mm",
          padding: "16mm 14mm",
          boxSizing: "border-box",
        }}
      >
        {/* 🔹 Header */}
        <Header isArabic={isArabic} />

        {/* 🔹 Main Content */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Section icon="👤" title={isArabic ? "البيانات الأساسية" : "Basic Info"}>
            <Grid>
              <Field label={isArabic ? "الاسم الكامل" : "Full Name"} value={data.fullName} />
              <Field label={isArabic ? "تاريخ التقديم" : "Application Date"} value={formatDate(data.applicationDate)} />
              <Field label={isArabic ? "الوظيفة المتقدم لها" : "Position"} value={data.position} />
              <Field label={isArabic ? "تاريخ البدء" : "Start Date"} value={formatDate(data.startDate)} />
            </Grid>
          </Section>

          <Section icon="ℹ️" title={isArabic ? "المعلومات الشخصية" : "Personal Info"}>
            <Grid>
              <Field label={isArabic ? "تاريخ الميلاد" : "Date of Birth"} value={formatDate(data.dob)} />
              <Field label={isArabic ? "الجنس" : "Gender"} value={data.gender} />
              <Field label={isArabic ? "الحالة الاجتماعية" : "Marital Status"} value={data.maritalStatus} />
              <Field label={isArabic ? "عدد الأطفال" : "Kids"} value={data.kids} />
              <Field label={isArabic ? "العنوان" : "Address"} value={data.address} full />
            </Grid>
          </Section>

          <Section icon="🌐" title={isArabic ? "اللغات" : "Languages"}>
            {data.languages?.length ? (
              data.languages.map((lang, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    border: "1px solid #e5e7eb",
                    marginBottom: "3px",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "8.5px" }}>{lang.name}</p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      fontSize: "7.8px",
                      marginTop: "3px",
                    }}
                  >
                    <LangItem label="Read" value={lang.read} />
                    <LangItem label="Write" value={lang.write} />
                    <LangItem label="Speak" value={lang.speak} />
                    <LangItem label="Understand" value={lang.understand} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "8px", color: "#777" }}>-</p>
            )}
          </Section>

          <Section icon="🎓" title={isArabic ? "المؤهلات الدراسية" : "Education"}>
            <Table
              headers={["From", "To", "Institution"]}
              rows={
                data.degrees?.map((d) => [
                  formatDate(d.from),
                  formatDate(d.to),
                  d.school || "-",
                ]) || []
              }
            />
          </Section>

          <Section icon="💼" title={isArabic ? "الخبرة العملية" : "Employment History"}>
            <Table
              headers={["From", "To", "Title", "Company", "Reason"]}
              rows={
                data.jobs?.map((j) => [
                  formatDate(j.from),
                  formatDate(j.to),
                  j.title || "-",
                  j.company || "-",
                  j.reason || "-",
                ]) || []
              }
            />
          </Section>

          <Section icon="📞" title={isArabic ? "المعرفين" : "References"}>
            <Table
              headers={["Name", "Occupation", "Location", "Contact"]}
              rows={
                data.references?.map((r) => [
                  r.name || "-",
                  r.occupation || "-",
                  r.location || "-",
                  r.contact || "-",
                ]) || []
              }
            />
          </Section>

          <Section icon="🧩" title={isArabic ? "معلومات إضافية" : "Other Info"}>
            <Grid>
              <Check label={isArabic ? "هل سبق التقديم؟" : "Applied Before"} val={data.otherInfo?.appliedBefore} />
              <Check label={isArabic ? "هل سبق العمل لدينا؟" : "Worked Before"} val={data.otherInfo?.workedBefore} />
              <Check label={isArabic ? "هل لديك أقارب في الشركة؟" : "Relatives in Company"} val={data.otherInfo?.relatives} />
              <Check label={isArabic ? "هل تمتلك سيارة؟" : "Car"} val={data.otherInfo?.car} />
              <Check label={isArabic ? "هل قدمت على هجرة؟" : "Immigrant App"} val={data.otherInfo?.immigrantApp} />
              <Field
                label={isArabic ? "الراتب المتوقع" : "Expected Salary"}
                value={
                  data.otherInfo?.expectedSalary
                    ? Number(data.otherInfo.expectedSalary).toLocaleString()
                    : "-"
                }
              />
            </Grid>
          </Section>
        </div>

        {/* 🔹 Footer */}
        <Footer isArabic={isArabic} />
      </div>
    </>
  );

  const root = createRoot(container);
  root.render(<Printable />);
  await new Promise((r) => setTimeout(r, 1000));

  const canvas = await html2canvas(container.querySelector("#pdf-content"), {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f9fafb",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${isArabic ? "نموذج_" : "Application_"}${data.fullName || "Candidate"}.pdf`);

  root.unmount();
  document.body.removeChild(container);
}

/*******************************************************
 * ✨ Sub Components — Clean & Compact
 *******************************************************/
const Header = ({ isArabic }) => (
  <header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #d1d5db",
      paddingBottom: "6px",
      marginBottom: "12px",
    }}
  >
    <div>
      <h1
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "#1e3a8a",
          margin: 0,
        }}
      >
        📄 {isArabic ? "نموذج تقديم وظيفة" : "Job Application Form"}
      </h1>
      <p style={{ fontSize: "8.5px", color: "#666", margin: "2px 0 0" }}>
        {isArabic ? "استمارة بيانات المتقدم" : "Applicant Information Summary"}
      </p>
    </div>
    <div style={{ fontSize: "8px", color: "#666" }}>
      {new Date().toLocaleDateString("en-GB")}
    </div>
  </header>
);

const Footer = ({ isArabic }) => (
  <footer
    style={{
      textAlign: "center",
      fontSize: "8px",
      color: "#555",
      marginTop: "12mm",
      borderTop: "1px solid #ddd",
      paddingTop: "4mm",
    }}
  >
    <img src="/SPC.png" style={{ width: "45px", opacity: 0.9 }} alt="SPC Logo" />
    <br />
    {isArabic
      ? "© 2025 بوابة الحلول لتكنولوجيا المعلومات - جميع الحقوق محفوظة"
      : "© 2025 Solution Portal Company – All Rights Reserved"}
  </footer>
);

function Section({ title, icon, children }) {
  return (
    <section
      style={{
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "6px",
        marginBottom: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "10px" }}>{icon}</span>
        <h3
          style={{
            fontSize: "9px",
            color: "#1e3a8a",
            margin: 0,
            fontWeight: "600",
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "3px 12px",
        fontSize: "8px",
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, full }) {
  return (
    <div
      style={{
        gridColumn: full ? "1 / span 2" : "auto",
        display: "flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "8px",
      }}
    >
      <b>{label}:</b> <span dir="auto">{value || "-"}</span>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "7.8px",
        marginTop: "3px",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#f3f4f6" }}>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                border: "1px solid #ddd",
                padding: "1.5px 3px",
                textAlign: "center",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((r, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 ? "#f9fafb" : "#fff",
              }}
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    border: "1px solid #eee",
                    padding: "1.5px 3px",
                    textAlign: "center",
                  }}
                >
                  {c || "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              style={{
                textAlign: "center",
                padding: "3px",
                color: "#777",
              }}
            >
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function Check({ label, val }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "8px",
      }}
    >
      <b>{label}:</b>
      <span>{val === "yes" ? "✅" : "❌"}</span>
    </div>
  );
}

function LangItem({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {label}: <span>{value ? "✅" : "❌"}</span>
    </div>
  );
}