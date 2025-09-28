import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    // 🟢 نفك params لأنه Promise
    const { company } = await params;
    const body = await req.json();

    if (!company) {
      return new Response(
        JSON.stringify({ success: false, error: "❌ No company provided" }),
        { status: 400 }
      );
    }

    // 🟢 سكيمة مرنة
    const InterviewSchema = new mongoose.Schema({}, { strict: false });

    // 🟢 نحدد اسم الكلكشن حسب الشركة
    const Model =
      mongoose.models[company] ||
      mongoose.model(company, InterviewSchema, company);

    const newDoc = new Model(body);
    await newDoc.save();

    return new Response(JSON.stringify({ success: true, data: newDoc }), {
      status: 201,
    });
  } catch (err) {
    console.error("Error saving interview:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}