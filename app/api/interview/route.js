import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📩 Received body:", body); // 🟢 اطبع البيانات الراجعة من الفورم

    if (!body.fullName) {
      return new Response(
        JSON.stringify({ success: false, error: "Full name is required" }),
        { status: 400 }
      );
    }

    const newInterview = new Interview(body);
    const saved = await newInterview.save();

    console.log("✅ Saved interview:", saved); // 🟢 اطبع المستند المخزون

    return new Response(
      JSON.stringify({ success: true, data: saved }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}