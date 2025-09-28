import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (!role) {
      return new Response(
        JSON.stringify({ success: false, error: "❌ No role provided" }),
        { status: 400 }
      );
    }

    // 🟢 سكيمة مرنة
    const ReportSchema = new mongoose.Schema({}, { strict: false });

    let reports = [];

    if (role === "admin") {
      // ✅ الادمن يشوف الكل
      const companies = ["RYD", "SV", "SVC"]; // زيد الشركات هنا اذا عدك اكثر
      for (const company of companies) {
        const Model =
          mongoose.models[company] ||
          mongoose.model(company, ReportSchema, company);

        const companyReports = await Model.find({})
          .sort({ createdAt: -1 })
          .lean();

        // نضيف companyKey علمود نفرق بينهم
        reports.push(
          ...companyReports.map((r) => ({ ...r, companyKey: company }))
        );
      }
    } else {
      // ✅ غير الادمن يشوف بس شركته
      const Model =
        mongoose.models[role] || mongoose.model(role, ReportSchema, role);
      reports = await Model.find({}).sort({ createdAt: -1 });
    }

    return new Response(JSON.stringify({ success: true, data: reports }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}