// app/signin/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { axiosPublic } from "@/utils/axios";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setAccessToken } = useAuth();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await axiosPublic.post("/auth/login", {
        email,
        password,
      });
      console.log(res.data);
      setAccessToken(res.data.accessToken);

      setMessage("Sign-in successful. You can now log in.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
