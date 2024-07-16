// app/signup/page.tsx
"use client";

import { axiosPublic } from "@/utils/axios";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await axiosPublic.post("/auth/signup", {
        email,
        password,
      });
      console.log(res.data);

      setMessage("Sign-up successful. You can now log in.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
