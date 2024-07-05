"use client";

import AuthForm from "@/components/form/AuthForm";
import { login } from "@/lib/redux/slices/user";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const submit = async (formData: any) => {
    dispatch(login(formData));
  };

  return (
    <div className="flex flex-col items-center gap-20 w-full p-4 px-10 md:px-20 h-full mb-10">
      <h1 className="text-4xl font-bold text-primary">Login</h1>
      <p>Welcome back! Please log in to your account.</p>
      <AuthForm id="login" onSubmit={submit} />
    </div>
  );
}
