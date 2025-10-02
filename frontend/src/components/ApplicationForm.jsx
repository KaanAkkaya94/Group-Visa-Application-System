import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const VISA_OPTIONS = [
  { label: "Holiday Visa", value: "Holiday Visa", cost: 100 },
  { label: "Student Visa", value: "Student Visa", cost: 150 },
  { label: "Working Holiday Visa", value: "Working Holiday Visa", cost: 200 },
  { label: "Business Visa", value: "Business Visa", cost: 250 },
  { label: "Family Visa", value: "Family Visa", cost: 120 },
];

const STATUS = ["Pre-payment", "Pending", "Approval", "Rejected"];

const ApplicationForm = ({
  allUsers,
  applications,
  setApplications,
  editingApplication,
  setEditingApplication,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    cost: "",
    firstname: "",
    lastname: "",
    countryofresidence: "",
    email: "",
    city: "",
    passportNo: "",
    dateofarrival: "",
    dateofdeparture: "",
    status: "Pre-payment",
  });

  useEffect(() => {
    if (editingApplication) {
      // Ensure date strings are formatted as yyyy-MM-dd for date inputs
      const formatDate = (d) => {
        if (!d) return "";
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return "";
        return dateObj.toISOString().split("T")[0];
      };
      setFormData({
        userId: "",
        title: editingApplication.title,
        cost: editingApplication.cost || "",
        firstname: editingApplication.firstname || "",
        lastname: editingApplication.lastname || "",
        countryofresidence: editingApplication.countryofresidence || "",
        email: editingApplication.email || "",
        city: editingApplication.city || "",
        passportNo: editingApplication.passportNo || "",
        dateofarrival: formatDate(editingApplication.dateofarrival),
        dateofdeparture: formatDate(editingApplication.dateofdeparture),
        status: editingApplication.status || "Pre-payment",
      });
    } else {
      setFormData({
        userId: "",
        title: "",
        cost: "",
        firstname: "",
        lastname: "",
        countryofresidence: "",
        email: "",
        city: "",
        passportNo: "",
        dateofarrival: "",
        dateofdeparture: "",
        status: "Pre-payment",
      });
    }
  }, [editingApplication]);

  // Update cost when visa type changes
  const handleVisaChange = (e) => {
    const selected = VISA_OPTIONS.find((opt) => opt.value === e.target.value);
    setFormData({
      ...formData,
      title: e.target.value,
      cost: selected ? selected.cost : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApplication) {
        const response = await axiosInstance.put(
          `/api/applications/${editingApplication._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setApplications(
          applications.map((application) =>
            application._id === response.data._id ? response.data : application
          )
        );
      } else {
        const response = await axiosInstance.post(
          "/api/applications",
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setApplications([...applications, response.data]);
      }
      setEditingApplication(null);
      setFormData({
        userId: "",
        title: "",
        cost: "",
        firstname: "",
        lastname: "",
        countryofresidence: "",
        email: "",
        city: "",
        passportNo: "",
        dateofarrival: "",
        dateofdeparture: "",
        status: "Pre-payment",
      });
    } catch (error) {
      console.error(
        "Failed to save application",
        error?.response?.data || error.message
      );
      alert("Failed to save application.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingApplication
          ? "Update Visa application"
          : "Create new Visa application"}
      </h1>
      {user.admin && !editingApplication && (
        <select
          value={formData.userId || ""}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Choose User --</option>
          {allUsers
            .filter((user) => user.admin !== true)
            .map((user, i) => (
              <option key={i} value={user._id}>
                {user.name}
              </option>
            ))}
        </select>
      )}
      <select
        value={formData.title}
        onChange={handleVisaChange}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="" disabled>
          Select Visa Type
        </option>
        {VISA_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={formData.cost ? `Cost: $${formData.cost}` : ""}
        readOnly
        className="w-full mb-4 p-2 border rounded bg-gray-100 font-semibold"
        tabIndex={-1}
        style={{ color: "#222" }}
      />

      <input
        type="text"
        placeholder="Firstname"
        value={formData.firstname}
        onChange={(e) =>
          setFormData({ ...formData, firstname: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Lastname"
        value={formData.lastname}
        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Country of Residence"
        value={formData.countryofresidence}
        onChange={(e) =>
          setFormData({ ...formData, countryofresidence: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Passport Number"
        value={formData.passportNo}
        onChange={(e) =>
          setFormData({ ...formData, passportNo: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <label className="block mb-1 font-semibold">Date of Arrival</label>
      <input
        type="date"
        value={formData.dateofarrival}
        onChange={(e) =>
          setFormData({ ...formData, dateofarrival: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      <label className="block mb-1 font-semibold">Date of Departure</label>
      <input
        type="date"
        value={formData.dateofdeparture}
        onChange={(e) =>
          setFormData({ ...formData, dateofdeparture: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />
      {/* status for admin */}
      {user.admin && editingApplication && (
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select Visa Status
          </option>
          {STATUS.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingApplication ? "Update application" : "Submit application"}
      </button>
    </form>
  );
};

export default ApplicationForm;
