"use client";

import HelpRequest from "@/app/component/form/HelpRequest";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/lib/redux/store";

export default function Page() {
  const jwt = useSelector((state: RootState) => state.user.jwt);

  const submit = async (formData: any) => {
    try {
      const response = await axios.post("/api/helper-request", formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
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
