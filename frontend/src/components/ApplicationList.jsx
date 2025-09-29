import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";

const ApplicationList = ({
  applications,
  setApplications,
  setEditingApplication,
  invoices = [],
}) => {
  const { user } = useAuth();
  const handleDelete = async (applicationId) => {
    try {
      await axiosInstance.delete(`/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(
        applications.filter((application) => application._id !== applicationId)
      );
    } catch (error) {
      alert("Failed to delete application.");
    }
  };

  return (
    <div>
      {applications.map((application) => (
        <div
          key={application._id}
          className="bg-gray-100 p-4 mb-4 rounded shadow"
        >
          <h2 className="font-bold">{application.title}</h2>
          {user.admin === true && (
            <h3 className="font-bold">
              Applicant Name: {application.firstname},{application.lastname}
            </h3>
          )}
          <p className="text-sm text-gray-500">
            Date of Arrival:{" "}
            {new Date(application.dateofarrival).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Date of Departure:{" "}
            {new Date(application.dateofdeparture).toLocaleDateString()}
          </p>

          <p className={"text-sm text-gray-500"}>
            Status:{" "}
            <span
              className={`${
                application.status === "Pre-payment"
                  ? "text-blue-600"
                  : application.status === "Pending"
                  ? "text-yellow-600"
                  : application.status === "Approval"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {application.status}
            </span>
          </p>
          <div className="mt-2">
            {(application.status == "Pre-payment" ||
              application.status == "Pending") && (
              <button
                onClick={() => setEditingApplication(application)}
                className="mr-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
            )}
            {(application.status == "Pre-payment" ||
              application.status == "Pending") && (
              <button
                onClick={() => handleDelete(application._id)}
                className="mr-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            )}
            {(application.status == "Pre-payment" ||
              application.status == "Pending") &&
              (invoices.some((inv) => inv.applicationId === application._id) ? (
                <Link
                  to={`/view-invoice/${application._id}`}
                  state={user.admin ? { userId: application.userId } : {}}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  style={{ textDecoration: "none", marginRight: "0.5rem" }}
                >
                  View Invoice
                </Link>
              ) : (
                <Link
                  to={`/request-invoice/${application._id}`}
                  state={user.admin ? { userId: application.userId } : {}}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                  style={{ textDecoration: "none", marginRight: "0.5rem" }}
                >
                  Request Invoice
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;
