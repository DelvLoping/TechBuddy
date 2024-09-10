import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import HelpRequestDetails from "../macro/HelpRequestDetails";
import _ from 'lodash';
import { HelpRequest } from "@prisma/client";

type HelpRequestListProps = {
  helpRequests: HelpRequest[] | null;
  userType: string;
};

export default function HelpRequestList({ helpRequests, userType } : HelpRequestListProps) {
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

 
  return (
    <div className="bg-white">
      {loadingApplications && userType === "HELPER" ? (
        <p>Loading requests...</p>
      ) : requests.length ? (
        <div>
          {_.map(requests,(request) => (
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
