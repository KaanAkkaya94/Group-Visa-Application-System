import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const ViewInvoicePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userId = location.state.userId || "";
  console.log("userId", userId);
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ method: "", details: "" });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/invoices/application/${applicationId}`,
          {
            params: { userId },
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setInvoice(res.data);
        setFormData({
          method: res.data.method || "",
          details:
            (res.data.details &&
              (res.data.details.info ||
                res.data.details.note ||
                JSON.stringify(res.data.details))) ||
            "",
        });
      } catch (err) {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [applicationId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: userId,
        method: formData.method,
        details: { info: formData.details },
      };
      const res = await axiosInstance.put(
        `/api/invoices/${invoice._id}`,
        payload
      );
      setInvoice(res.data);
      setEditing(false);
    } catch (err) {
      alert("Failed to update invoice");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await axiosInstance.delete(`/api/invoices/${invoice._id}`, {
        params: { userId },
      });
      navigate("/applications");
    } catch (err) {
      alert("Failed to delete invoice");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!invoice) return <div className="p-6">Invoice not found.</div>;

  return (
    <div className="container bg-white rounded shadow-md p-6 mt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <p>
        <strong>Visa Type:</strong> {invoice.title}
      </p>
      <p>
        <strong>Cost:</strong> ${invoice.cost}
      </p>
      <p>
        <strong>Method:</strong> {invoice.method}
      </p>
      <p>
        <strong>Requested On:</strong> {new Date(invoice.date).toLocaleString()}
      </p>
      {invoice.details && (
        <pre className="bg-gray-100 p-2 rounded mt-4 text-sm">
          {JSON.stringify(invoice.details, null, 2)}
        </pre>
      )}
      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={() => setEditing((e) => !e)}
          className="bg-yellow-600 text-white px-4 py-2 rounded w-full"
        >
          {editing ? "Cancel Edit" : "Edit Invoice"}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Delete Invoice
        </button>
        <button
          onClick={() => navigate("/applications")}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Back to Applications
        </button>
      </div>

      {editing && (
        <form onSubmit={handleUpdate} className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Update Invoice</h2>
          <label className="block mb-2 font-semibold">Payment Method</label>
          <select
            value={formData.method}
            onChange={(e) =>
              setFormData({ ...formData, method: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select a method
            </option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <label className="block mb-2 font-semibold">Payment Details</label>
          <input
            type="text"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
            placeholder="Updated details"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default ViewInvoicePage;
