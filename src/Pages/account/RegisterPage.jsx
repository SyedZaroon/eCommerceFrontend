import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./account.module.css";
import { loginCustomer, registerCustomer } from "../../services/account";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await registerCustomer({ name, email, password });
      await loginCustomer({ email, password });
      navigate("/account", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <form className={styles.authCard} onSubmit={handleSubmit}>
        <p className={styles.eyebrow}>Join us</p>
        <h1>Create account</h1>
        <label>
          Name
          <input
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.primaryButton} type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
        <p className={styles.authFooter}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
