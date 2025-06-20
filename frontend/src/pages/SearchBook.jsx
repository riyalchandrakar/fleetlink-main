import React, { useState } from "react";
import axios from "axios";

const SearchBook = () => {
  const [query, setQuery] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const search = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/vehicles/available`,
        { params: query }
      );
      setResults(data.vehicles);
    } catch (e) {
      setMessage("❌ Error searching vehicles");
    }
  };

  const book = async (vehicleId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/bookings`, {
        vehicleId,
        ...query,
        customerId: "test-customer-123",
      });

      setMessage("✅ Booking successful");
    } catch (e) {
      setMessage("❌ Booking failed");
    }
  };

  return (
    <div>
      <h2>Search & Book Vehicle</h2>
      <input
        name="capacityRequired"
        placeholder="Capacity (kg)"
        onChange={(e) =>
          setQuery({ ...query, capacityRequired: e.target.value })
        }
      />
      <input
        name="fromPincode"
        placeholder="From Pincode"
        onChange={(e) => setQuery({ ...query, fromPincode: e.target.value })}
      />
      <input
        name="toPincode"
        placeholder="To Pincode"
        onChange={(e) => setQuery({ ...query, toPincode: e.target.value })}
      />
      <input
        name="startTime"
        type="datetime-local"
        onChange={(e) =>
          setQuery({ ...query, startTime: e.target.value + ":00" })
        }
      />
      <button onClick={search}>Search</button>

      {results.map((v) => (
        <div key={v._id}>
          <p>
            {v.name} - {v.capacityKg}kg - {v.tyres} tyres
          </p>
          {v.available ? (
            <button onClick={() => book(v._id)}>Book Now</button>
          ) : (
            <p style={{ color: "red" }}>
              Booked. Next Available:{" "}
              {new Date(v.nextAvailableTime).toLocaleString()}
            </p>
          )}
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
};

export default SearchBook;
