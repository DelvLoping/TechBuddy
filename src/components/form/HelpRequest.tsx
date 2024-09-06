"use client";

import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import React, { useState, useCallback } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useSelector } from "react-redux";
import { OPEN, VIRTUAL, IN_PERSON } from "@/constant";
import axiosInstance from "@/lib/axiosInstance";

export default function HelpRequest({ id }) {
  const { loading } = useSelector((state) => state.user) || {};
  const [error, setError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    interventionType: VIRTUAL,
    interventionDate: "",
    reward: "",
    interventionAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    status: OPEN,
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/helper-request", formData);
      setSubmissionSuccess(true);
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddressChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      interventionAddress: { ...prev.interventionAddress, [name]: value },
    }));
  }, []);

  return (
    <div className="w-full">
      {!submissionSuccess ? (
        <form id={id} onSubmit={submit} className="w-full">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Select
              label="Intervention Type"
              name="interventionType"
              value={formData.interventionType}
              onChange={handleChange}
              required
            >
              <SelectItem key={VIRTUAL} value={VIRTUAL}>
                Virtual
              </SelectItem>
              <SelectItem key={IN_PERSON} value={IN_PERSON}>
                In Person
              </SelectItem>
            </Select>

            <Input
              label="Intervention Date"
              type="date"
              name="interventionDate"
              value={formData.interventionDate}
              onChange={handleChange}
            />
            <Input
              label="Reward"
              type="text"
              name="reward"
              value={formData.reward}
              onChange={handleChange}
            />

            {formData.interventionType === IN_PERSON && (
              <>
                <h2>In person</h2>
                {["street", "city", "postalCode", "country"].map((field) => (
                  <Input
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={formData.interventionAddress[field]}
                    onChange={handleAddressChange}
                  />
                ))}
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 w-full py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {loading ? <Spinner color="white" /> : "Submit"}
            </Button>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </form>
      ) : (
        <div className="text-green-600 text-center font-bold mt-4">
          Your help request has been submitted successfully!
        </div>
      )}
    </div>
  );
}
