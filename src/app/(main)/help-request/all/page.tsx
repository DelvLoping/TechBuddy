"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Spinner } from "@nextui-org/react";
import axiosInstance from "@/lib/axiosInstance";
import HelpRequestList from "@/components/list/HelpRequestList";
import _ from "lodash";

export default function HelpRequestsPage() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    subject: "",
    interventionType: "",
    sortBy: "requestDate",
    sortOrder: "asc",
  });
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "OPEN", label: "OPEN" },
    { value: "IN_PROGRESS", label: "IN PROGRESS" },
    { value: "COMPLETED", label: "COMPLETED" }
  ];

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await axiosInstance.get("/help-request");
        setHelpRequests(response.data.helpRequests); 
      } catch (error) {
        setError("Failed to load help requests.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserType = async () => {
      try {
        const response = await axiosInstance.get("/user/current");
        setUserType(response.data.type); 
      } catch (error) {
        setError("Failed to load user data.");
      }
    };

    fetchUserType();
    fetchHelpRequests();
  }, []);

  const filteredHelpRequests = useMemo(() => {
    return helpRequests
      .filter((request) => {
        return (
          (!filters.status || request.status === filters.status) &&
          (!filters.subject ||
            request.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
          (!filters.interventionType || request.interventionType === filters.interventionType)
        );
      })
      .sort((a, b) => {
        const fieldA = a[filters.sortBy];
        const fieldB = b[filters.sortBy];
        if (filters.sortOrder === "asc") {
          return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        } else {
          return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        }
      });
  }, [filters, helpRequests]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">My Help Requests</h1>

      <div className="mb-4">
        <input
          type="text"
          name="subject"
          placeholder="Filter by Subject"
          value={filters.subject}
          onChange={handleFilterChange}
          className="p-2 border rounded-large mr-2"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border rounded-large m-2"
        >
          {_.map(statusOptions, status=> (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))
          }
        </select>
        <select
          name="interventionType"
          value={filters.interventionType}
          onChange={handleFilterChange}
          className="p-2 border rounded-large m-2"
        >
          <option value="">All Types</option>
          <option value="IN_PERSON">In Person</option>
          <option value="VIRTUAL">Virtual</option>
        </select>
        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
          className="p-2 border rounded-large m-2"
        >
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
      </div>

      <HelpRequestList helpRequests={filteredHelpRequests} userType={userType} />
    </div>
  );
}
