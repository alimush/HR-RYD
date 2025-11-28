"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const currencyOptions = [
  { value: "IQD", label: "Iraqi Dinar – IQD" },
  { value: "USD", label: "US Dollar – USD" },
];

export default function EditFormPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/editform");
      const json = await res.json();

      if (json.success) setData(json.data);
      setLoading(false);
    };

    load();
  }, []);

  // ================= SAVE =================
  const save = async () => {
    const res = await fetch("/api/editform", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
  
    const json = await res.json();
  
    if (json.success) {
      const updated = json.updated.value || json.updated; // حسب نوع Mongo driver
  
      // 🟢 تحديث الـ state مباشرة بدون reload
      setData((prev) =>
        prev.map((row) =>
          row._id === selected._id ? { ...row, ...updated } : row
        )
      );
  
      setSelected(null); // غلق البوب أب
    } else {
      alert("❌ Error updating");
    }
  };
  // ================= DELETE =================
  const remove = async (id, companyKey) => {
    if (!confirm("Delete?")) return;
  
    const res = await fetch(`/api/editform?id=${id}&companyKey=${companyKey}`, {
      method: "DELETE",
    });
  
    const json = await res.json();
  
    if (json.success) {
      // 🟢 إزالة العنصر من الـ state بدون reload
      setData((prev) => prev.filter((item) => item._id !== id));
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <FaEdit /> Edit Applications
      </h1>

      {loading ? (
        <div className="text-center py-20 text-lg">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Position</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Currency</th>
                <th className="p-3">Company</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr key={row._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{row.fullName}</td>
                  <td className="p-3">{row.position}</td>
                  <td className="p-3">{row.otherInfo?.expectedSalary || "-"}</td>
                  <td className="p-3">{row.otherInfo?.currency || "-"}</td>
                  <td className="p-3">{row.companyKey}</td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => setSelected(row)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(row._id, row.companyKey)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= POPUP ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-7 rounded-2xl w-[450px] shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 text-2xl"
                onClick={() => setSelected(null)}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaEdit /> Edit: {selected.fullName}
              </h2>

              {/* Name */}
              <label className="block mb-4">
                Full Name
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selected.fullName}
                  onChange={(e) =>
                    setSelected({ ...selected, fullName: e.target.value })
                  }
                />
              </label>

              {/* Salary */}
              <label className="block mb-4">
                Expected Salary
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={selected.otherInfo?.expectedSalary || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      otherInfo: {
                        ...selected.otherInfo,
                        expectedSalary: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>

              {/* Currency */}
              <label className="block mb-4">
                Currency
                <select
                  className="w-full p-2 border rounded"
                  value={selected.otherInfo?.currency || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      otherInfo: {
                        ...selected.otherInfo,
                        currency: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Select...</option>
                  {currencyOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={save}
                className="w-full bg-green-600 text-white p-3 rounded-lg text-lg flex items-center justify-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}