// utils/generatePDF.js
export default async function generatePDF(elementId, fileName = "document.pdf") {
    if (typeof window === "undefined") return; // 🛑 تأكد إنه بس بالمتصفح
  
    const html2pdf = (await import("html2pdf.js")).default;
  
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("❌ Element not found:", elementId);
      return;
    }
  
    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: fileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
  
    html2pdf().set(opt).from(element).save();
  }