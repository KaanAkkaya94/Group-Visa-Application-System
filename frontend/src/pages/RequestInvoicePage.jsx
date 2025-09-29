import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const RequestInvoicePage = () => {
  const location = useLocation();
  const userId = location.state.userId || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axiosInstance.get(`/api/applications/${id}`);
        setApplication(res.data);
      } catch (err) {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/invoices", {
        userId: userId,
        applicationId: id,
        title: application.title,
        cost: application.cost,
        method,
        details: { info: details },
      });
      alert("Invoice requested!");
      navigate("/applications");
    } catch (error) {
      alert("Failed to request invoice.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!application) return <div className="p-6">Application not found.</div>;

  return (
    <div className="container bg-white rounded shadow-md p-6 mt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Request Invoice</h1>
      <p>
        <strong>Visa Type:</strong> {application.title}
      </p>
      <p>
        <strong>Cost:</strong> ${application.cost}
      </p>
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block mb-2 font-semibold">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
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
          placeholder="Payment details (e.g. last 4 digits, PayPal email)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Request Invoice
        </button>
      </form>
    </div>
  );
};

export default RequestInvoicePage;
