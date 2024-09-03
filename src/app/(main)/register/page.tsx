"use client";

import AuthForm from "@/components/form/AuthForm";
import { register } from "@/lib/redux/slices/user";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const submit = async (formData: any) => {
    dispatch(register(formData));
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10">
      <h1 className="text-4xl font-bold text-secondary">Register</h1>
      <p>Join us! Create an account to get started.</p>
      <AuthForm id="login" onSubmit={submit} register={true} />
    </div>
  );
}
