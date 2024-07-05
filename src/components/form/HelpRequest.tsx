"use client";

import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useSelector } from "react-redux";
import { OPEN,VIRTUAL,IN_PERSON} from "@/constant";

export default function HelpRequest({ id, onSubmit }) {
  const userReducer = useSelector((state) => state.user);
  const { error, loading } = userReducer || {};
  const [formData, setFormData] = useState({
    subject: undefined,
    description: undefined,
    interventionType: VIRTUAL, 
    interventionDate: undefined,
    reward:undefined,
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
      const response = await onSubmit(formData);
      console.log(response)
      if (response && response.status === 201) {
        console.log('submissionSuccess'); 
        setSubmissionSuccess(true); 
      } 
      console.log(submissionSuccess); 

    } catch (error) {
      console.error("Error submitting help request:", error);
    }
  };
  console.log(submissionSuccess); 


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
        <div className="text-green-600 font-bold mt-4">
          Your help request has been submitted successfully!
        </div>
      )}
    </div>
  );
}