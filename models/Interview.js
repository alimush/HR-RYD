import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    // ✅ معلومات التقديم
    applicationDate: { type: Date },
    fullName: { type: String, required: true },
    position: { type: String },
    startDate: { type: Date },

    // ✅ المعلومات الشخصية
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], required: false },
    maritalStatus: { type: String, enum: ["Single", "Married", ""], required: false },
    kids: { type: Number, default: 0 },
    address: { type: String },

    // ✅ اللغة
    motherTongue: { type: String },
    languages: [
      {
        name: { type: String }, // Arabic / English
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        speak: { type: Boolean, default: false },
        understand: { type: Boolean, default: false },
      },
    ],

    // ✅ التعليم
    degrees: [
      {
        from: { type: Date },
        to: { type: Date },
        school: { type: String },
      },
    ],

    // ✅ الخبرات الوظيفية
    jobs: [
      {
        from: { type: Date },
        to: { type: Date },
        title: { type: String },
        company: { type: String },
        reason: { type: String },
      },
    ],

    // ✅ المراجع
    references: [
      {
        name: { type: String },
        occupation: { type: String },
        location: { type: String },
        contact: { type: String },
      },
    ],

    // ✅ معلومات إضافية
    otherInfo: {
      foundJobFrom: String,
      appliedBefore: String,
      workedBefore: String,
      relatives: String,
      car: String,
      immigrantApp: String,
      expectedSalary: Number,
    },
    companyKey: { type: String, required: true }, // 🟢 ضروري
  },
  
  { timestamps: true }
);

export default mongoose.models.Interview ||
  mongoose.model("Interview", InterviewSchema);