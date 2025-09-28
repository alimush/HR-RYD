"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaLanguage,
  FaAddressCard,
  FaInfoCircle
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

export default function InterviewPage() {
  const [degrees, setDegrees] = useState([{ from: "", to: "", school: "" }]);
  const [contacts, setContacts] = useState([
    { name: "", occupation: "", location: "", contact: "" },
  ]);
  const [jobs, setJobs] = useState([
    { from: "", to: "", title: "", company: "", reason: "" },
  ]);
  const [startDate, setStartDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        alert("✅ Data saved to MongoDB!");
        setFormData({
          applicationDate: "",
          fullName: "",
          position: "",
          startDate: "",
          dob: "",
          gender: "",
          maritalStatus: "",
          kids: "",
          address: "",
          motherTongue: "",
          foundJobFrom: "",
          appliedBefore: "",
          workedBefore: "",
          relatives: "",
          car: "",
          immigrantApp: "",
          expectedSalary: "",
          degrees: [{ from: "", to: "", school: "" }],
          jobs: [{ from: "", to: "", title: "", company: "", reason: "" }],
          references: [{ name: "", occupation: "", location: "", contact: "" }],
          languages: [
            { name: "Arabic / العربية", read: false, write: false, speak: false, understand: false },
            { name: "English / الإنجليزية", read: false, write: false, speak: false, understand: false }
          ],
          otherInfo: {
            foundJobFrom: "",
            appliedBefore: "",
            workedBefore: "",
            relatives: "",
            car: "",
            immigrantApp: "",
            expectedSalary: "",
            degrees: [{ from: "", to: "", school: "" }],
            jobs: [{ from: "", to: "", title: "", company: "", reason: "" }],
            references: [{ name: "", occupation: "", location: "", contact: "" }],
            // ...
          },
          
        });
      } else {
        alert("❌ Error saving data");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong");
    }
  };
  

  const rowAnim = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const focusAnim = {
    whileFocus: {
      scale: 1.02,
      boxShadow: "0px 0px 8px rgba(107,114,128,0.4)",
      borderColor: "#6b7280",
    },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };
  
  const [formData, setFormData] = useState({
    applicationDate: "",
    fullName: "",
    position: "",
    startDate: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    kids: "",
    address: "",
    motherTongue: "",
    foundJobFrom: "",
    appliedBefore: "",
    workedBefore: "",
    relatives: "",
    car: "",
    immigrantApp: "",
    degrees: [{ from: "", to: "", school: "" }],
    jobs: [{ from: "", to: "", title: "", company: "", reason: "" }],
    references: [{ name: "", occupation: "", location: "", contact: "" }],
    languages: [
      { name: "Arabic / العربية", read: false, write: false, speak: false, understand: false },
      { name: "English / الإنجليزية", read: false, write: false, speak: false, understand: false }
    ],
    otherInfo: {                // ✅ خليته موجود من البداية
      expectedSalary: "",
      appliedBefore: "",
      workedBefore: "",
      relatives: "",
      car: "",
      immigrantApp: "",
      degrees: [{ from: "", to: "", school: "" }],
      jobs: [{ from: "", to: "", title: "", company: "", reason: "" }],
      references: [{ name: "", occupation: "", location: "", contact: "" }],
      // ...
    }
  });
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white/90 shadow-2xl rounded-2xl p-10 space-y-10 border border-gray-200"
        variants={rowAnim}
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2 flex justify-center items-center gap-3">
          <FaUser className="text-gray-700" />
          Job Application Form
        </h1>
        <p className="text-center text-gray-500 text-lg">
          استمارة التقديم على الوظيفة
        </p>

        {/* ================== Application Info ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
            <FaAddressCard className="text-gray-600" />
            Application Information / معلومات التقديم
          </h2>
          <motion.div className="grid md:grid-cols-2 gap-6" variants={rowAnim}>
            <label className="flex flex-col font-medium text-gray-700">
              Application Date / تاريخ التقديم
              <motion.input 
  type="date" 
  className="border p-2 rounded-md" 
  value={formData.applicationDate}
  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
  {...focusAnim}
/>
            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Full Name / الاسم الكامل
              <motion.input 
  type="text" 
  className="border p-2 rounded-md" 
  value={formData.fullName}
  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
  {...focusAnim}
/>
            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Position Applying For / الوظيفة المتقدم لها
              <motion.input 
  type="text" 
  className="border p-2 rounded-md" 
  value={formData.position}
  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
  {...focusAnim}
/>

            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Able to start the job on / متاح للبدء بالعمل في
              <motion.input
  type="date"
  className="border p-2 rounded-md"
  value={formData.startDate}
  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
  {...focusAnim}
/>
            </label>
          </motion.div>
        </section>

        {/* ================== Personal Info ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
            <FaUser className="text-gray-600" />
            Personal Information / معلومات شخصية
          </h2>
          <motion.div className="grid md:grid-cols-2 gap-6" variants={rowAnim}>
            <label className="flex flex-col font-medium text-gray-700">
              Date of Birth / تاريخ الميلاد
              <motion.input 
  type="date" 
  className="border p-2 rounded-md" 
  value={formData.dob}
  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
  {...focusAnim}
/>

            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Gender / الجنس
              <motion.select
  className="border p-2 rounded-md"
  value={formData.gender}
  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
  {...focusAnim}
>
  <option value="">Select</option>
  <option value="Male">Male / ذكر</option>
  <option value="Female">Female / أنثى</option>
</motion.select>
            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Marital Status / الحالة الاجتماعية
              <motion.select
  className="border p-2 rounded-md"
  value={formData.maritalStatus}
  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
  {...focusAnim}
>
  <option value="">Select</option>
  <option value="Single">Single / أعزب</option>
  <option value="Married">Married / متزوج</option>
</motion.select>
            </label>
            <label className="flex flex-col font-medium text-gray-700">
              Number of Kids / عدد الأولاد
              <motion.input 
  type="number" 
  className="border p-2 rounded-md" 
  value={formData.kids}
  onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
  {...focusAnim}
/>

            </label>
            <label className="flex flex-col col-span-2 font-medium text-gray-700">
              Address / العنوان
              <motion.input 
  type="text" 
  className="border p-2 rounded-md" 
  value={formData.address}
  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  {...focusAnim}
/>
            </label>
          </motion.div>
        </section>

        {/* ================== Languages ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
            <FaLanguage className="text-gray-600" />
            Language Proficiency / إتقان اللغة
          </h2>
          <label className="flex flex-col mb-4 font-medium text-gray-700">
            Mother tongue / اللغة الأم
            <motion.select
  className="border p-2 rounded-md w-full"
  value={formData.motherTongue}
  onChange={(e) =>
    setFormData({ ...formData, motherTongue: e.target.value })
  }
  {...focusAnim}
>
  <option value="">Select</option>
  <option value="Arabic">Arabic</option>
  <option value="English">English</option>
</motion.select>
          </label>

          {formData.languages.map((langObj, i) => (
  <motion.div key={langObj.name} className="mb-3 font-medium text-gray-700" variants={rowAnim}>
    <span className="font-semibold">{langObj.name}:</span>
    {["read", "write", "speak", "understand"].map((skill) => (
      <label key={skill} className="ml-4 inline-flex items-center gap-2">
        <motion.input
          type="checkbox"
          className="w-5 h-5 accent-gray-600 rounded-md cursor-pointer"
          checked={langObj[skill] || false}
          onChange={(e) => {
            const updated = [...formData.languages];
            updated[i][skill] = e.target.checked; // ✅ يخزن Boolean
            setFormData({ ...formData, languages: updated });
          }}
        />
        {skill.charAt(0).toUpperCase() + skill.slice(1)}
      </label>
    ))}
  </motion.div>
))}
        </section>

        {/* ================== Education ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
  <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
    <FaGraduationCap className="text-gray-600" />
    Education / المؤهلات الدراسية
  </h2>
  <div className="overflow-x-auto">
    <table className="w-full border border-gray-200 rounded-lg text-sm shadow">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 border">From / من</th>
          <th className="p-2 border">To / إلى</th>
          <th className="p-2 border">School / University</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
  {formData.degrees.map((deg, i) => (
    <motion.tr key={i} initial="hidden" animate="visible" variants={rowAnim}>
      <td className="border p-2">
        <motion.input
          type="date"
          className="border p-2 rounded-md w-full"
          value={deg.from}
          onChange={(e) => {
            const updated = [...formData.degrees];
            updated[i].from = e.target.value;
            setFormData({ ...formData, degrees: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="date"
          className="border p-2 rounded-md w-full"
          value={deg.to}
          onChange={(e) => {
            const updated = [...formData.degrees];
            updated[i].to = e.target.value;
            setFormData({ ...formData, degrees: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded-md w-full"
          value={deg.school}
          onChange={(e) => {
            const updated = [...formData.degrees];
            updated[i].school = e.target.value;
            setFormData({ ...formData, degrees: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2 text-center">
        {i > 0 && (
          <button
            type="button"
            onClick={() => {
              const updated = formData.degrees.filter((_, idx) => idx !== i);
              setFormData({ ...formData, degrees: updated });
            }}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            <FaTrashAlt />
          </button>
        )}
      </td>
    </motion.tr>
  ))}
</tbody>
    </table>
  </div>
  <button
    type="button"
    onClick={() =>
      setFormData({
        ...formData,
        degrees: [...formData.degrees, { from: "", to: "", school: "" }],
      })
    }
    className="flex items-center text-gray-700 text-sm mt-2 hover:text-gray-900"
  >
    <FaPlusCircle className="mr-1" /> Add more
  </button>
</section>
        {/* ================== Employment ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
  <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
    <FaBriefcase className="text-gray-600" />
    Employment Records / السجل الوظيفي
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border border-gray-200 rounded-lg text-sm shadow">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 border">From</th>
          <th className="p-2 border">To</th>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Company</th>
          <th className="p-2 border">Reason for leave</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
  {formData.jobs.map((job, i) => (
    <motion.tr key={i} initial="hidden" animate="visible" variants={rowAnim}>
      <td className="border p-2">
        <motion.input
          type="date"
          className="border p-2 rounded-md w-full"
          value={job.from}
          onChange={(e) => {
            const updated = [...formData.jobs];
            updated[i].from = e.target.value;
            setFormData({ ...formData, jobs: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="date"
          className="border p-2 rounded-md w-full"
          value={job.to}
          onChange={(e) => {
            const updated = [...formData.jobs];
            updated[i].to = e.target.value;
            setFormData({ ...formData, jobs: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded-md w-full"
          value={job.title}
          onChange={(e) => {
            const updated = [...formData.jobs];
            updated[i].title = e.target.value;
            setFormData({ ...formData, jobs: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded-md w-full"
          value={job.company}
          onChange={(e) => {
            const updated = [...formData.jobs];
            updated[i].company = e.target.value;
            setFormData({ ...formData, jobs: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded-md w-full"
          value={job.reason}
          onChange={(e) => {
            const updated = [...formData.jobs];
            updated[i].reason = e.target.value;
            setFormData({ ...formData, jobs: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2 text-center">
        {i > 0 && (
          <button
            type="button"
            onClick={() => {
              const updated = formData.jobs.filter((_, idx) => idx !== i);
              setFormData({ ...formData, jobs: updated });
            }}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            <FaTrashAlt />
          </button>
        )}
      </td>
    </motion.tr>
  ))}
</tbody>
    </table>
  </div>

  <button
    type="button"
    onClick={() =>
      setFormData({
        ...formData,
        jobs: [
          ...formData.jobs,
          { from: "", to: "", title: "", company: "", reason: "" },
        ],
      })
    }
    className="flex items-center text-gray-700 text-sm mt-2 hover:text-gray-900"
  >
    <FaPlusCircle className="mr-1" /> Add more
  </button>
</section>

        {/* ================== References ================== */}
        <section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-4">
    <FaUser className="text-gray-600" />
    References from Previous Works / مراجع من الأعمال السابقة
  </h2>

  <p className="text-gray-600 mb-4 text-lg">
    الرجاء ذكر معلومات اتصال لثلاث اشخاص معرفين لك من اعمالك السابقة ومن غير الاقارب
    (رب العمل او من يؤكد صحة المعلومات).
  </p>

  <div className="overflow-x-auto">
    <table className="w-full border border-gray-300 rounded-lg text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 border">Name / الاسم</th>
          <th className="p-2 border">Occupation / الوظيفة</th>
          <th className="p-2 border">Location / الموقع</th>
          <th className="p-2 border">Phone/Email / الهاتف أو البريد</th>
          <th className="p-2 border">Action / إجراء</th>
        </tr>
      </thead>
      <tbody>
  {formData.references.map((ref, i) => (
    <motion.tr key={i} initial="hidden" animate="visible" variants={rowAnim}>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded w-full"
          value={ref.name}
          onChange={(e) => {
            const updated = [...formData.references];
            updated[i].name = e.target.value;
            setFormData({ ...formData, references: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded w-full"
          value={ref.occupation}
          onChange={(e) => {
            const updated = [...formData.references];
            updated[i].occupation = e.target.value;
            setFormData({ ...formData, references: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded w-full"
          value={ref.location}
          onChange={(e) => {
            const updated = [...formData.references];
            updated[i].location = e.target.value;
            setFormData({ ...formData, references: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2">
        <motion.input
          type="text"
          className="border p-2 rounded w-full"
          value={ref.contact}
          onChange={(e) => {
            const updated = [...formData.references];
            updated[i].contact = e.target.value;
            setFormData({ ...formData, references: updated });
          }}
          {...focusAnim}
        />
      </td>
      <td className="border p-2 text-center">
        {i > 0 && (
          <button
            type="button"
            onClick={() => {
              const updated = formData.references.filter((_, idx) => idx !== i);
              setFormData({ ...formData, references: updated });
            }}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            <FaTrashAlt />
          </button>
        )}
      </td>
    </motion.tr>
  ))}
</tbody>
    </table>
  </div>

  <button
    type="button"
    onClick={() =>
      setFormData({
        ...formData,
        references: [
          ...formData.references,
          { name: "", occupation: "", location: "", contact: "" },
        ],
      })
    }
    className="flex items-center text-gray-600 text-sm mt-2 hover:text-blue-800"
  >
    <FaPlusCircle className="mr-1" /> Add more / أضف المزيد
  </button>
  </section>
{/* ================== Other Info ================== */}
<section className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
  <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-700 mb-4">
    <FaInfoCircle className="text-gray-600" />
    Other Information / معلومات إضافية
  </h2>

  {/* من أين عثرت على الوظيفة يبقى textarea */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
  From where did you find this job? / من أين عثرت على هذه الوظيفة؟
  <motion.textarea
    className="w-full border p-2 rounded-md"
    value={formData.otherInfo.foundJobFrom || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        otherInfo: { ...formData.otherInfo, foundJobFrom: e.target.value },
      })
    }
    {...focusAnim}
  />
</label>
  {/* قدمت سابقاً */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Have you applied before? / هل قدمت سابقاً؟
    <motion.select
      className="border p-2 rounded-md"
      value={formData.otherInfo.appliedBefore || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          otherInfo: { ...formData.otherInfo, appliedBefore: e.target.value },
        })
      }
      {...focusAnim}
    >
      <option value="">Select</option>
      <option value="yes">Yes / نعم</option>
      <option value="no">No / لا</option>
    </motion.select>
  </label>

  {/* عملت معنا سابقاً */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Have you worked with us before? / هل عملت معنا؟
    <motion.select
      className="border p-2 rounded-md"
      value={formData.otherInfo.workedBefore || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          otherInfo: { ...formData.otherInfo, workedBefore: e.target.value },
        })
      }
      {...focusAnim}
    >
      <option value="">Select</option>
      <option value="yes">Yes / نعم</option>
      <option value="no">No / لا</option>
    </motion.select>
  </label>

  {/* أقارب في الشركة */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Relatives in our company? / أقارب في الشركة؟
    <motion.select
      className="border p-2 rounded-md"
      value={formData.otherInfo.relatives || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          otherInfo: { ...formData.otherInfo, relatives: e.target.value },
        })
      }
      {...focusAnim}
    >
      <option value="">Select</option>
      <option value="yes">Yes / نعم</option>
      <option value="no">No / لا</option>
    </motion.select>
  </label>

  {/* سيارة */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Do you have a car? / هل لديك سيارة؟
    <motion.select
      className="border p-2 rounded-md"
      value={formData.otherInfo.car || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          otherInfo: { ...formData.otherInfo, car: e.target.value },
        })
      }
      {...focusAnim}
    >
      <option value="">Select</option>
      <option value="yes">Yes / نعم</option>
      <option value="no">No / لا</option>
    </motion.select>
  </label>

  {/* معاملة هجرة */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Active immigrant application? / هل لديك معاملة هجرة؟
    <motion.select
      className="border p-2 rounded-md"
      value={formData.otherInfo.immigrantApp || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          otherInfo: { ...formData.otherInfo, immigrantApp: e.target.value },
        })
      }
      {...focusAnim}
    >
      <option value="">Select</option>
      <option value="yes">Yes / نعم</option>
      <option value="no">No / لا</option>
    </motion.select>
  </label>

  {/* الراتب المتوقع يبقى input */}
  <label className="flex flex-col mb-2 font-medium text-gray-700">
    Expected Salary / الراتب المتوقع
    <motion.input
      type="text"
      className="w-full border p-2 rounded-md"
      value={
        formData.otherInfo.expectedSalary === ""
          ? ""
          : Number(formData.otherInfo.expectedSalary).toLocaleString()
      }
      onChange={(e) => {
        const rawValue = e.target.value.replace(/,/g, "");
        const numValue = Number(rawValue);
        setFormData({
          ...formData,
          otherInfo: {
            ...formData.otherInfo,
            expectedSalary:
              rawValue === "" ? "" : isNaN(numValue) ? 0 : numValue,
          },
        });
      }}
      {...focusAnim}
    />
  </label>
</section>
        {/* ================== Submit ================== */}
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white font-bold p-4 rounded-xl shadow-lg hover:opacity-90 transition"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit 
        </motion.button>
      </motion.form>
    </motion.main>
  );
}