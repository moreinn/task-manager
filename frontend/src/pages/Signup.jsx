import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
        name,
      });

      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Cannot connect to signup server. Make sure backend is running on port 5000."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Signup</h1>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button onClick={signup} disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
