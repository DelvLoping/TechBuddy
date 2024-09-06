import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function HelpRequestList({ helpRequests }) {
  const [appliedRequests, setAppliedRequests] = useState(new Set());
  const [requests, setRequests] = useState(helpRequests);
  const [addresses, setAddresses] = useState({}); // Stocker les adresses récupérées
  const [loadingApplications, setLoadingApplications] = useState(true); 

  const fetchAddressById = async (addressId) => {
    try {
      const response = await axiosInstance.get(`/address/${addressId}`);
      return response.data.address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };
  
  useEffect(() => {
    setRequests(helpRequests);
    helpRequests.forEach(async (request) => {
      if (request.interventionAddressId) {
        const address = await fetchAddressById(request.interventionAddressId);
        setAddresses((prev) => ({ ...prev, [request.id]: address }));
      }
    });
  }, [helpRequests]);

  useEffect(() => {
    const fetchAppliedRequests = async () => {
      try {
        const response = await axiosInstance.get('/helper-application');
        const applications = new Set(response.data.helpApplications.map(app => app.requestId));
        setAppliedRequests(applications);
      } catch (error) {
        console.error('Error fetching applied requests:', error);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchAppliedRequests();
  }, []);

  const handleApply = async (requestId) => {
    if (appliedRequests.has(requestId)) {
      alert("You have already applied for this request.");
      return;
    }

    try {
      const response = await axiosInstance.post('/helper-application', { requestId });
      if (response.status === 201) {
        setAppliedRequests(prev => new Set(prev).add(requestId));
        setRequests(prevRequests => prevRequests.map(request => 
          request.id === requestId ? { ...request, applied: true } : request
        ));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("You have already applied for this request.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white">
      {loadingApplications ? (  
        <p>Loading requests...</p>
      ) : requests.length ? (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{request.subject}</h2>
              <p>{request.description}</p>
              <p><strong>Intervention Type:</strong> {request.interventionType}</p>
              <p><strong>Intervention Date:</strong> {new Date(request.interventionDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.interventionType === "IN_PERSON" && addresses[request.id] && (
                <>
                  <p><strong>Address:</strong></p>
                  <p>{addresses[request.id].street || "Street not provided"}</p>
                  <p>{addresses[request.id].city || "City not provided"}</p>
                  <p>{addresses[request.id].postalCode || "Postal Code not provided"}</p>
                  <p>{addresses[request.id].country || "Country not provided"}</p>
                </>
              )}
              {appliedRequests.has(request.id) ? (
                <p className="mt-4 text-green-500">You have applied for this request</p>
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
