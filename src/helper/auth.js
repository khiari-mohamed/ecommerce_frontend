"use server";
import axiosInstance from "@/lib/axios";

export const checkAuthStatus = async (token) => {
  const res = await axiosInstance.get(`/auth/store/check-auth-status/${token}`);
  console.log(token);

  console.log(res);

  return res.data;
};

// logout the user
export const logoutUser = async () => {
  const res = await axiosInstance.get("/auth/store/logout");
  if (res.status !== 200) {
    console.log("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const loginUser = async (email, password) => {
  try {
    const res = await axiosInstance.post("/auth/store/login", {
      email,
      password,
    });
    console.log(res);

    return { status: "ok", user: res.data }; // Return the response data on success
  } catch (error) {
    if (error.response.data.message) {
      return { status: "bad", msg: error?.response?.data?.message };
    }
    if (error.response.data.errors[0]) {
      return { status: "bad", msg: error?.response?.data?.errors[0] };
    }
    return;
  }
};

// Register the user
// This function is called in the register function in authContext.jsx
// It takes the data from the register form and sends it to the API
// It returns the response from the API
// It also handles errors and returns a message if the registration fails
// It also handles the case where the user already exists
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Registration failed");
    return { status: "ok", user: result, message: "Registration successful" };
  } catch (error) {
    return { status: "bad", message: error.message };
  }
};