// src/app/help-requests/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import axiosInstance from "@/lib/axiosInstance";
import HelpRequestList from "@/components/list/HelpRequestList";

export default function HelpRequestsPage() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await axiosInstance.get("/helper-request");
        console.log(response.data)
        setHelpRequests(response.data.helpRequests);
      } catch (error) {
        setError("Failed to load help requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpRequests();
  }, []);

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Help Requests</h1>
      {loading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <HelpRequestList helpRequests={helpRequests} />
      )}
    </div>
  );
}
