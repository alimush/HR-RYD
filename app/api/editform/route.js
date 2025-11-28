import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// 🟦 الشركات
const companies = ["RYD", "SV", "SVC"];

// 🟦 دالة تجيب الكولكشن من اسم الشركة
function getCollection(companyKey) {
  if (!companies.includes(companyKey)) return null;
  return mongoose.connection.collection(companyKey);
}

// ======================= GET (All Data) =======================
export async function GET() {
  try {
    await dbConnect();

    let all = [];

    for (const company of companies) {
      const col = mongoose.connection.collection(company);
      const docs = await col.find().toArray();

      docs.forEach(d => {
        d.companyKey = company; // مهم حتى نعرف هو من أي شركة
      });

      all.push(...docs);
    }

    return NextResponse.json({ success: true, data: all });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ======================= PUT (Update One) =======================
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { _id, companyKey, ...updateData } = body;

    if (!_id || !companyKey)
      return NextResponse.json({ success: false, error: "Missing ID or companyKey" }, { status: 400 });

    const col = getCollection(companyKey);
    if (!col)
      return NextResponse.json({ success: false, error: "Invalid company" }, { status: 400 });

    const updated = await col.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const companyKey = searchParams.get("companyKey");

    if (!id || !companyKey)
      return NextResponse.json({ success: false, error: "Missing required params" }, { status: 400 });

    const col = getCollection(companyKey);
    if (!col)
      return NextResponse.json({ success: false, error: "Invalid company" }, { status: 400 });

    await col.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}