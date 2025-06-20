import React, { useState } from "react";
import axios from "axios";

const AddVehicle = () => {
  const [form, setForm] = useState({ name: "", capacityKg: "", tyres: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicles`, form);
      setMessage("✅ Vehicle added successfully");
    } catch (err) {
      setMessage("❌ Error adding vehicle");
    }
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input
          name="capacityKg"
          placeholder="Capacity (kg)"
          type="number"
          onChange={handleChange}
        />
        <input
          name="tyres"
          placeholder="Tyres"
          type="number"
          onChange={handleChange}
        />
        <button type="submit">Add Vehicle</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddVehicle;
