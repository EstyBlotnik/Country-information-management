import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import "../../style/LoginPage.scss";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { loginUser, loginMutation } = useUser();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Handles form submission and logs the user in.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ userName, password });
  };

  const isLoading = loginMutation.status === "pending";

  return (
    <div className="landing-page">
      <div className="landing-page__box">
        <h1 className="landing-page__title">Sign in to your account</h1>
        <p className="landing-page__description">
          Enter your username and password to log in
        </p>
        <form className="landing-page__form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="landing-page__button landing-page__button--login"
            type="submit"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? "Logging In..." : "Sign In"}
          </button>
        </form>
        <div className="landing-page__forgot-password">
          <Link to="/passwordresetrequest">Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
