// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import mongoose from "mongoose";

// export async function DELETE() {
//   try {
//     await dbConnect();

//     // 🟢 سكيمة مرنة
//     const ReportSchema = new mongoose.Schema({}, { strict: false });

//     // 🟢 الشركات
//     const companies = ["RYD", "SV", "SVC"];

//     for (const company of companies) {
//       // 🟢 استخدم collection name مباشرة (بدون تعريف موديل ثابت)
//       const Model = mongoose.connection.collection(company);
//       await Model.deleteMany({});
//     }

//     return NextResponse.json(
//       { success: true, message: "✅ All interviews deleted for all companies" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Error deleting all interviews:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }