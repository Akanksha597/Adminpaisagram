

import React, { useState, useEffect } from "react";
import { Input, Button, Select, Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import "./SectorForm.css";
const API_URL = import.meta.env.VITE_API_BASE_URL;
import { DownOutlined } from "@ant-design/icons"; // built-in Ant icon


const { TextArea } = Input;
const { Option } = Select;

const SectorForm = ({ selectedSector, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    published: true,
    image: null,
    originalImageName: "", // Displayed file name
  });

  useEffect(() => {
    if (selectedSector) {
      setFormData({
        title: selectedSector.title || "",
        description: selectedSector.description || "",
        category: selectedSector.category || "",
        published: selectedSector.published ?? true,
        image: null, // Only file input, not actual URL
        originalImageName: selectedSector.originalImageName || "", // ⭐ this line added
      });
      setPreview(selectedSector.image || null);
    }
  }, [selectedSector]);

  const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (type === "checkbox") {
    setFormData({ ...formData, [name]: checked });
  } else if (type === "file") {
    const file = files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: "Image must be less than 5MB" }));
        setFormData({ ...formData, image: null });
        setPreview(null);
        return;
      } else {
        // Clear error if valid
        setFormErrors((prev) => ({ ...prev, image: null }));
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleChange1 = (e) => {
  const { name, files } = e.target;

  if (name === "image" && files && files.length > 0) {
    const file = files[0];
    setFileName(file.name);
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  }
};

const extractFileName = (url) => {
  if (!url) return "";
  return url.split("/").pop(); // gets 'solar1.png' from '.../uploads/solar1.png'
};

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || (!formData.image && !selectedSector)) {
      toast.error("Please fill all required fields and upload an image.");
      return;
    }

    try {
      setLoading(true);
      const sendData = new FormData();
      sendData.append("title", formData.title);
      sendData.append("description", formData.description);
      sendData.append("category", formData.category);
      sendData.append("published", formData.published);
      if (formData.image) sendData.append("image", formData.image);

        sendData.append(
      "originalImageName",
      formData.image?.name || selectedSector?.originalImageName || ""
    );

      if (selectedSector) {
        await axios.put(`${API_URL}/api/sectors/${selectedSector._id}`, sendData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Sector updated successfully");
      } else {
        await axios.post(`${API_URL}/api/sectors`, sendData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Sector created successfully");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Failed to save sector");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sector-form-wrapper">
      <Card className="sector-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Title <span className="required-star">*</span>
            </label>
            <Input
              placeholder="Enter title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* <div className="form-group">
            <label>Description</label>
            <TextArea
              rows={4}
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div> */}


<div className="form-group">
  <label>
    Category <span className="required-star">*</span>
  </label>
  <div style={{ position: "relative" }}>
    <Select
      placeholder="Select category"
      value={formData.category}
      onChange={handleCategoryChange}
      style={{ width: "100%" }}
    >
      <Option value="Residential">Residential</Option>
      <Option value="Commercial">Commercial</Option>
      <Option value="Industrial">Industrial</Option>
      <Option value="General">General</Option>
    </Select>

    {/* Dropdown icon */}
    <i
      className="bi bi-caret-down-fill position-absolute"
      style={{
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "#666",
        zIndex: 1,
      }}
    ></i>
  </div>
</div>


   <div className="form-group">
  <label>Published</label>
  <div style={{ position: "relative" }}>
    <Select
      value={formData.published ? "Yes" : "No"}
      onChange={(value) =>
        setFormData({ ...formData, published: value === "Yes" })
      }
      suffixIcon={null} 
      style={{ width: "100%" }}
    >
      <Option value="Yes">Yes</Option>
      <Option value="No">No</Option>
    </Select>
     
    <i
      className="bi bi-caret-down-fill position-absolute"
      style={{
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "#666",
        zIndex: 1,
      }}
    ></i>
  </div>
</div>


  {/* <div className="form-group">
   <label>
    image <span className="required-star">*</span>
   </label>
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    className="form-control"
  />
</div> */}

{/* <div className="form-group">
  <label>
    Image <span className="required-star">*</span>
  </label>

  <div className="position-relative">
    <input
      type="text"
      className="form-control" 
      value={
        formData.image?.name || selectedSector?.originalImageName || "Choose File"
      }
      readOnly
      onClick={() =>
        document.getElementById("sector-image-file").click()
      }
      style={{ cursor: "pointer", backgroundColor: "#fff" }}
    />

    <input
      id="sector-image-file"
      type="file"
      name="image"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleChange}
    />
  </div>
</div> */}



<div className="form-group">
  <label>
    Image <span className="required-star">*</span>
  </label>

  <div className="position-relative">
    <input
      type="text"
      className="form-control"
      value={
        formData.image?.name || selectedSector?.originalImageName || "Choose File"
      }
      readOnly
      onClick={() =>
        document.getElementById("sector-image-file").click()
      }
      style={{ cursor: "pointer", backgroundColor: "#fff" }}
    />

    <input
      id="sector-image-file"
      type="file"
      name="image"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleChange}
    />
  </div>

  {/* Error message */}
  {formErrors.image && (
    <small style={{ color: "red" }}>{formErrors.image}</small>
  )}
</div>

          <div className="form-buttons" style={{ display: "flex", gap: "10px" }}>
            <Button
              htmlType="submit"
              disabled={loading}
              // loading={loading}
              className="submit-btn"
              style={{
               backgroundColor: "#1A1640" ,
                color: "#fff",
                border: "none",
                height:'35px',
              }}
            >
              {selectedSector ? "Update" : "Submit"}
            </Button>

            <Button
              onClick={onCancel}
              style={{
                backgroundColor: "#6c757d", // Cancel button color
                color: "#fff",
                border: "none",
                height:'35px',
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SectorForm;
