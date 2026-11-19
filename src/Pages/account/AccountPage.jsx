import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./account.module.css";
import {
  getCurrentUser,
  getMyOrders,
  logoutCustomer,
  updateAccount,
} from "../../services/account";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));

const formatMoney = (amount, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getErrorMessage = (error) =>
  error.response?.data?.message || "Unable to load your account. Please try again.";

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalOrders: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      setLoading(true);
      setError("");
      try {
        const account = await getCurrentUser();
        const result = await getMyOrders(page);
        if (active) {
          setUser(account);
          setName(account.name || "");
          setEmail(account.email || "");
          setOrders(result.orders);
          setPagination(result.pagination);
        }
      } catch (requestError) {
        if (active) {
          if (requestError.response?.status === 401) {
            setSignedOut(true);
          } else {
            setError(getErrorMessage(requestError));
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAccount();
    return () => {
      active = false;
    };
  }, [page]);

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      navigate("/", { replace: true });
    } catch (logoutError) {
      setError(getErrorMessage(logoutError));
    }
  };

  const handleAccountUpdate = async (event) => {
    event.preventDefault();
    setUpdatingAccount(true);
    setAccountError("");
    setAccountMessage("");

    try {
      const details = { name, email };
      if (newPassword) {
        details.currentPassword = currentPassword;
        details.newPassword = newPassword;
      }
      const result = await updateAccount(details);
      setUser(result.user);
      setName(result.user.name);
      setEmail(result.user.email);
      setCurrentPassword("");
      setNewPassword("");
      setAccountMessage("Your account details have been updated.");
    } catch (requestError) {
      setAccountError(
        requestError.response?.data?.message || "Unable to update your account. Please try again.",
      );
    } finally {
      setUpdatingAccount(false);
    }
  };

  if (loading) {
    return <main className={styles.page}><p>Loading your account...</p></main>;
  }

  if (signedOut) {
    return (
      <main className={styles.page}>
        <h1>Your account</h1>
        <p className={styles.notice}>Sign in to see your order history.</p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} to="/login">Sign in</Link>
          <Link className={styles.secondaryButton} to="/register">Create account</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>My account</p>
          <h1>{user?.name || "Your account"}</h1>
          <p className={styles.muted}>{user?.email}</p>
        </div>
        <button className={styles.secondaryButton} onClick={handleLogout} type="button">
          Sign out
        </button>
      </header>

      <section className={styles.profile} aria-labelledby="profile-heading">
        <h2 id="profile-heading">Account details</h2>
        <form className={styles.profileForm} onSubmit={handleAccountUpdate}>
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
              maxLength={254}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Current password (required to change password)
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>
          <label>
            New password (leave blank to keep your current password)
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
          {accountError && <p className={styles.error} role="alert">{accountError}</p>}
          {accountMessage && <p className={styles.success} role="status">{accountMessage}</p>}
          <button className={styles.primaryButton} type="submit" disabled={updatingAccount}>
            {updatingAccount ? "Saving..." : "Save account details"}
          </button>
        </form>
      </section>

      <section className={styles.orders} aria-labelledby="orders-heading">
        <h2 id="orders-heading">Order history</h2>
        {error ? (
          <p className={styles.error} role="alert">{error}</p>
        ) : orders.length ? (
          <>
            <div className={styles.orderList}>
              {orders.map((order) => (
                <article className={styles.order} key={order._id}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3>Order #{order.orderNumber || order._id}</h3>
                      <p className={styles.muted}>{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={styles.status}>{order.orderStatus}</span>
                  </div>
                  <p className={styles.itemList}>
                    {(order.orderItems || [])
                      .map((item) => `${item.title} × ${item.qty}`)
                      .join(", ")}
                  </p>
                  <div className={styles.orderFooter}>
                    <span>{order.paymentStatus}</span>
                    <strong>{formatMoney(order.totalPrice, order.currency)}</strong>
                  </div>
                  {order.paymentStatus === "Refunded" && (
                    <p className={styles.muted}>
                      Refunded {formatMoney(order.refundedAmount, order.currency)}
                    </p>
                  )}
                </article>
              ))}
            </div>
            <div className={styles.pagination}>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className={styles.actions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </button>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className={styles.notice}>
            No orders yet. Orders placed while signed in will appear here.
          </p>
        )}
      </section>
    </main>
  );
}
