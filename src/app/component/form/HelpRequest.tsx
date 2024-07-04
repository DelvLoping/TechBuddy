"use client";
import { Button, Textarea, Input, user } from "@nextui-org/react";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useSelector } from "react-redux";

export default function HelpRequest({
  id,
  onSubmit,
  register = false,
}: {
  id: string;
  onSubmit: (formData: any) => Promise<void>;
  register?: boolean;
}) {
  const userReducer = useSelector((state) => state.user);
  console.log(userReducer)
  const { error, loading } = userReducer || {};
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    interventionDate: "",
    interventionType: "",
    interventionAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeAddress = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      interventionAddress: {
        ...formData.interventionAddress,
        [name]: value,
      },
    });
  };
  return (
    <form onSubmit={submit} className="w-full">
    <div className="flex flex-col items-center justify-center gap-4 mb-4">
      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
      />
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <Input
        label="Intervention Date"
        name="interventionDate"
        type="datetime-local"
        value={formData.interventionDate}
        onChange={handleChange}
      />
      <Input
        label="Intervention Type"
        name="interventionType"
        value={formData.interventionType}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center gap-4 w-full mb-4">
        <h2>Intervention Address</h2>
        <Input
          label="Street"
          name="street"
          value={formData.interventionAddress.street}
          onChange={handleChangeAddress}
        />
        <Input
          label="City"
          name="city"
          value={formData.interventionAddress.city}
          onChange={handleChangeAddress}
        />
        <Input
          label="State"
          name="state"
          value={formData.interventionAddress.state}
          onChange={handleChangeAddress}
        />
        <Input
          label="Zip"
          name="zip"
          value={formData.interventionAddress.zip}
          onChange={handleChangeAddress}
        />
        <Button
      type="submit"
      disabled={loading}
      className="min-w-24 w-[20vw] bg-primary text-white mt-8 font-bold"
    >
      {loading ? <Spinner color="white" /> : "Submit"}
    </Button>
      </div>
    </div>
    
    {error && <p className="text-danger">{error}</p>}
  </form>
  );
}