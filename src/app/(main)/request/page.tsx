// src/app/main/request/page.tsx

"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { createRequest } from "@/lib/redux/slices/request";

export default function RequestPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    interventionType: "",
    reward: "",
    interventionDate: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createRequest(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-20 w-full p-4 px-10 md:px-20 lg:px-40 xl:px-80 h-full mb-10">
      <h1 className="text-4xl font-bold text-primary">Request</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          fullWidth
        />
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Intervention Type"
          name="interventionType"
          value={formData.interventionType}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Reward"
          name="reward"
          value={formData.reward}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Intervention Date"
          type="date"
          name="interventionDate"
          value={formData.interventionDate}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          fullWidth
        />
        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" className="bg-primary text-white mt-4">
          Submit Request
        </Button>
      </form>
    </div>
  );
}
