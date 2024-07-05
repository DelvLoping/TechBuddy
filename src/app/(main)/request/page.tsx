"use client";

import axios from "axios";
import HelpRequest from "@/components/form/HelpRequest";
import axiosInstance from "@/lib/axiosInstance";

export default function Page() {

  const submit = async (formData: any) => {
    try {
      const response = await axiosInstance.post("/helper-request", formData)
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Different error than axios", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10">
      <h1 className="text-4xl font-bold text-secondary">Request</h1>
      <p>Need Help</p>
      <HelpRequest id="userSlice" onSubmit={submit} />
    </div>
  );
}
