// ContactList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Input, Space, Popconfirm ,Card} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContactList.css"; // Optional: add responsive & hover styles

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch contacts
  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/contact`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          const contactsArray = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];
          setContacts(contactsArray);
          setFilteredContacts(contactsArray);
        }
      })
      .catch((err) => {
        console.error("Error fetching contacts:", err);
        toast.error("❌ Failed to fetch contacts.");
      });
  }, []);

  // Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(value) ||
        c.email.toLowerCase().includes(value) ||
        c.subject?.toLowerCase().includes(value)
    );
    setFilteredContacts(filtered);
  };

  // Delete
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/api/v1/contact/${id}`)
      .then(() => {
        const updated = contacts.filter((item) => item._id !== id);
        setContacts(updated);
        setFilteredContacts(updated);
        toast.success("✅ Contact deleted successfully");
      })
      .catch((err) => {
        console.error("Delete error:", err);
        toast.error("❌ Failed to delete contact");
      });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    { title: "Phone", dataIndex: "phone", key: "phone", align: "center" },
    { title: "Subject", dataIndex: "subject", key: "subject", align: "center" },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 300,
      render: (text) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{text}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Delete this contact?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            style={{
              background: "linear-gradient(90deg,#f43f5e,#f59e0b)",
              color: "#fff",
              border: "none",
              fontWeight: 500,
            }}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="contact-container" style={{ maxWidth: 1200, margin: "20px auto", padding: "0 16px" }} >
      
      <ToastContainer position="top-right" autoClose={3000} />
       <Card
            style={{
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          >
      <h2 style={{ textAlign: "center", color: "#45385e", marginBottom: 20 }}>📨 Contact Enquiries</h2>

      <Space style={{ marginBottom: 16, width: "100%" }}>
        <Input
          placeholder="Search by name, email, or subject"
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Space>

      {/* Desktop Table */}
      <div className="desktop-table">
        <Table
          dataSource={filteredContacts}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-content" }}
          rowClassName={() => "hover-row"}
        />
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {filteredContacts.map((contact) => (
          <div
            key={contact._id}
            style={{
              marginBottom: 15,
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              background: "#fff",
            }}
          >
            <p><strong>Name:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Subject:</strong> {contact.subject}</p>
            <p><strong>Message:</strong> {contact.message}</p>
            <Popconfirm
              title="Delete this contact?"
              onConfirm={() => handleDelete(contact._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                block
                style={{
                  background: "linear-gradient(90deg,#f43f5e,#f59e0b)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 500,
                  marginTop: 10,
                }}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        ))}
      </div>
      </Card>
    </div>
  );
};

export default ContactList;
