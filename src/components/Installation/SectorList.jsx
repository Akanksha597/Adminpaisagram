

import React, { useEffect, useState } from "react";
import api from "../../api/api";
import SectorForm from "./SectorForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const SectorList = () => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSectors = async () => {
    try {
      // const res = await api.get("/sectors");
      const res = await axios.get(`${API_URL}/api/sectors`);
      const reversedData = [...res.data.data].reverse(); // Reverse the array
      setSectors(reversedData);
    
      // setSectors(res.data.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        // await api.delete(`/sectors/${id}`);
        await axios.delete(`${API_URL}/api/sectors/${id}`);
        toast.success("✅ Sector deleted successfully");
        fetchSectors();
      } catch (err) {
        toast.error("❌ Failed to delete sector");
      }
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedSector(null);
    fetchSectors();
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer />
     <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
  {/* <h4 className="fw-bold">
    {showForm ? (selectedSector ? "Edit Sector" : "Add New Sector") : "All Sectors"}
  </h4> */}
  <h4
    className="fw-bold"
    style={showForm ? { marginLeft: "30px" } : {}}
  >
    {showForm ? (selectedSector ? "Edit Sector" : "Add New Sector") : "All Sectors"}
  </h4>
{/* </div> */}



  {/* Show "Add Sector" button only when not in form view */}
  {!showForm && (
    <button
      className="btn btn-success"
      style={{ backgroundColor: "#1A1640" }}
      onClick={() => {
        setSelectedSector(null);
        setShowForm(true);
      }}
    >
      Add Sector
    </button>
  )}
</div>


      {showForm ? (
        <SectorForm
          selectedSector={selectedSector}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedSector(null);
          }}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "25%" }}>Image</th>
                <th style={{ width: "25%" }}>Title</th>
                <th style={{ width: "25%" }}>Category</th>
                <th style={{ width: "25%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectors.length > 0 ? (
                sectors.map((sector) => (
                  <tr key={sector._id}>
                    <td>
                      {sector.image ? (
                        <img
                          src={sector.image}
                          alt="sector"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{sector.title}</td>
                    <td>{sector.category}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setSelectedSector(sector);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(sector._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted py-3">
                    No sectors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SectorList;
