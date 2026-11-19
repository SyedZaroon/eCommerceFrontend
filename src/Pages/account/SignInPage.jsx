import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./account.module.css";
import { loginCustomer } from "../../services/account";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await loginCustomer({ email, password });
      navigate("/account", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <form className={styles.authCard} onSubmit={handleSubmit}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h1>Sign in</h1>
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.primaryButton} type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className={styles.authFooter}>
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}
