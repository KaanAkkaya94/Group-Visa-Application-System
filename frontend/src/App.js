import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import RequestInvoicePage from "./pages/RequestInvoicePage";
import ViewInvoicePage from "./pages/ViewInvoicePage";
import { useAuth } from "./context/AuthContext";
import TicketSystemPage from "./pages/TicketSystemPage";
import "./App.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: "100%",
          marginBottom: "1rem",
        }}
      >
        <img
          src="/background.jpg"
          alt="Background"
          style={{
            width: "100%",
            borderRadius: "12px",
            maxHeight: "500px",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h1
            className="hero-text"
            style={{ fontSize: "4rem", marginBottom: "0.3rem" }}
          >
            Welcome to E-Visa Application
          </h1>
          <h1
            className="hero-text"
            style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}
          >
            Fastest way to Australia
          </h1>
          {user && (
            <Link
              to="/applications"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1.25rem",
                textDecoration: "none",
                boxShadow: "0 2px 8px #0006",
              }}
            >
              Applications
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/tickets" element={<TicketSystemPage />} />
        <Route path="/request-invoice/:id" element={<RequestInvoicePage />} />
        <Route
          path="/view-invoice/:applicationId"
          element={<ViewInvoicePage />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
