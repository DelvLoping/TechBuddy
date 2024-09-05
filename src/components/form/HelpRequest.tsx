"use client";

import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useSelector } from "react-redux";
import { OPEN, VIRTUAL, IN_PERSON } from "@/constant";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

export default function HelpRequest({ id }) {
  const userReducer = useSelector((state) => state.user);
  const { loading } = userReducer || {};
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subject: undefined,
    description: undefined,
    interventionType: VIRTUAL,
    interventionDate: undefined,
    reward: undefined,
    interventionAddress: {
      street: undefined,
      city: undefined,
      postalCode: undefined,
      country: undefined,
    },
    status: OPEN,
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/help-request", formData);
      setSubmissionSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data) {
        setError(error.response.data.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      interventionAddress: { ...formData.interventionAddress, [name]: value },
    });
  };

  return (
    <div className="w-full">
      {!submissionSuccess && (
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
              <SelectItem key={VIRTUAL}>Virtual</SelectItem>
              <SelectItem key={IN_PERSON}>In Person</SelectItem>
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
                <Input
                  label="Street"
                  name="street"
                  value={formData.interventionAddress.street}
                  onChange={handleAddressChange}
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.interventionAddress.city}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.interventionAddress.postalCode}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.interventionAddress.country}
                  onChange={handleAddressChange}
                />
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="min-w-24 w-full bg-primary text-white mt-8 font-bold"
            >
              {loading ? <Spinner color="white" /> : "Submit"}
            </Button>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </form>
      )}

      {submissionSuccess && (
        <div className="text-green-600 text-center font-bold mt-4">
          Your help request has been submitted successfully!
        </div>
      )}
    </div>
  );
}
