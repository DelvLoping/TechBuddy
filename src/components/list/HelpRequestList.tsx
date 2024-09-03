import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from 'next/navigation';

export default function HelpRequestList({ helpRequests }) {
  const [appliedRequests, setAppliedRequests] = useState(new Set());
  const router = useRouter();

  const handleApply = async (requestId) => {
    try {
      const response = await axiosInstance.post('/helper-application', { requestId });
      if (response.status === 201) {
        setAppliedRequests(prev => new Set(prev).add(requestId));
        router.refresh(); 
      }
    } catch (error) {
      console.error('Error applying for help request:', error);
    }
  };

  return (
    <div>
      {helpRequests !== null ? (
        <ul className="space-y-4">
          {helpRequests.map((request) => (
            <li key={request.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{request.subject}</h2>
              <p>{request.description}</p>
              <p><strong>Intervention Type:</strong> {request.interventionType}</p>
              <p><strong>Intervention Date:</strong> {new Date(request.interventionDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.interventionType === "IN_PERSON" && request.interventionAddressId && (
                <>
                  <p><strong>Address:</strong></p>
                  <p>{request.interventionAddress?.street || "Street not provided"}</p>
                  <p>
                    {request.interventionAddress?.city || "City not provided"}, {request.interventionAddress?.postalCode || "Postal Code not provided"}, {request.interventionAddress?.country || "Country not provided"}
                  </p>
                </>
              )}
              {appliedRequests.has(request.id) ? (
                <p className="mt-4 text-green-500">Bravo, vous vous êtes positionné sur cette demande !</p>
              ) : (
                <button
                  onClick={() => handleApply(request.id)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  Apply
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No help requests found.</p>
      )}
    </div>
  );
}
