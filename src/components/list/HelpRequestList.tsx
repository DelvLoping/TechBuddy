import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import HelpRequestDetails from "../macro/HelpRequestDetails";

export default function HelpRequestList({ helpRequests, userType }) {
  const [appliedRequests, setAppliedRequests] = useState(new Set());
  const [requests, setRequests] = useState(helpRequests);
  const [addresses, setAddresses] = useState({});
  const [loadingApplications, setLoadingApplications] = useState(true);

  const fetchAddressById = async (addressId) => {
    try {
      const response = await axiosInstance.get(`/address/${addressId}`);
      return response.data.address;
    } catch (error) {
      console.error("Error fetching address:", error);
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
    if (userType === "HELPER") {
      const fetchAppliedRequests = async () => {
        try {
          const response = await axiosInstance.get("/helper-application");
          const applications = new Set(
            response.data.helpApplications.map((app) => app.requestId)
          );
          setAppliedRequests(applications);
          console.log(response)
        } catch (error) {
          console.error("Error fetching applied requests:", error);
        } finally {
          setLoadingApplications(false);
        }
      };

      fetchAppliedRequests();
    }
  }, [userType]);

  // Handle application by Helper
  const handleApply = async (requestId) => {
    if (appliedRequests.has(requestId)) {
      alert("You have already applied for this request.");
      return;
    }

    try {
      const response = await axiosInstance.post("/helper-application", {
        requestId,
      });
      if (response.status === 201) {
        setAppliedRequests((prev) => new Set(prev).add(requestId));
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId ? { ...request, applied: true } : request
          )
        );
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle accepting a Helper by TechBuddy
  const handleAcceptHelper = async (applicationId) => {
    try {
      const response = await axiosInstance.put(
        `/helper-application/${applicationId}`,
        { status: "ACCEPTED" }
      );
      if (response.status === 200) {
        alert("Helper accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting helper:", error);
      alert("Failed to accept helper.");
    }
  };

  // Render the component based on user type
  return (
    <div className="bg-white">
      {loadingApplications && userType === "HELPER" ? (
        <p>Loading requests...</p>
      ) : requests.length ? (
        // <ul className="space-y-4">
        //   {requests.map((request) => (
        //     <li key={request.id} className="p-4 border rounded-large shadow">
        //       <div className="flex justify-between items-start">
        //         <h2 className="text-xl font-semibold">{request.subject}</h2>
        //         <p>{new Date(request.interventionDate).toLocaleDateString()}</p>
        //       </div>
        //       <div className="flex justify-between items-start">
        //         <div>
        //           <p>{request.description}</p>
        //           <p>
        //             <span className="text-sm sm:text-base underline">
        //               Intervention type
        //             </span>{" "}
        //             : {request.interventionType}
        //           </p>
        //           <p>
        //             <span className="text-sm sm:text-base underline">
        //               Status
        //             </span>{" "}
        //             : <span className="text-warning"> {request.status}</span>
        //           </p>
        //           {request.interventionType === "IN_PERSON" &&
        //             addresses[request.id] && (
        //               <>
        //                 <p>
        //                   <strong>Address:</strong>
        //                 </p>
        //                 <p>
        //                   {addresses[request.id].street || "Street not provided"}
        //                 </p>
        //                 <p>
        //                   {addresses[request.id].city || "City not provided"}
        //                 </p>
        //                 <p>
        //                   {addresses[request.id].postalCode ||
        //                     "Postal Code not provided"}
        //                 </p>
        //                 <p>
        //                   {addresses[request.id].country ||
        //                     "Country not provided"}
        //                 </p>
        //               </>
        //             )}
        //         </div>

        //         {/* If the user is a HELPER, show the Apply button */}
        //         {userType === "HELPER" && (
        //           <div>
        //             {appliedRequests.has(request.id) ? (
        //               <p className="mt-4 text-green-500">
        //                 You have applied for this request
        //               </p>
        //             ) : (
        //               <button
        //                 onClick={() => handleApply(request.id)}
        //                 className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-large hover:bg-blue-600 transition duration-200"
        //               >
        //                 Apply
        //               </button>
        //             )}
        //           </div>
        //         )}

        //         {/* If the user is a TECHBUDDY, show Helpers applied and accept option */}
        //         {userType === "TECHBUDDY" && request.applications && (
        //           <div>
        //             {request.applications.length > 0 ? (
        //               <div>
        //                 <h3 className="font-bold">Helpers Applied:</h3>
        //                 <ul>
        //                   {request.applications.map((app) => (
        //                     <li key={app.id} className="my-2">
        //                       <p>
        //                         <strong>Helper:</strong> {app.helper.lastname}
        //                       </p>
        //                       <button
        //                         onClick={() => handleAcceptHelper(app.id)}
        //                         className="bg-green-500 text-white py-2 px-4 rounded-large hover:bg-green-600"
        //                       >
        //                         Accept Helper
        //                       </button>
        //                     </li>
        //                   ))}
        //                 </ul>
        //               </div>
        //             ) : (
        //               <p>No helpers have applied yet.</p>
        //             )}
        //           </div>
        //         )}
        //       </div>
        //     </li>
        //   ))}
        // </ul>
        <div>
          {requests.map((request) => (
          <HelpRequestDetails key={request.id} helpRequest={request}/> 
          ))
        }
        </div>
      ) : (
        <p>No help requests found.</p>
      )}
    </div>
  );
}
