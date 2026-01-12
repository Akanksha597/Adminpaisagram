import React, { useState, useEffect } from "react";
import {
  Table,
  message,
  Avatar,
  Input,
  Button,
  Space,
  Spin,
  Typography,
  Divider,
} from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL;

const EmployeesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/candidate`);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.candidates)
        ? res.data.candidates
        : [];
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error("Failed to load employees.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = candidates.filter(
      (candidate) =>
        candidate.name?.toLowerCase().includes(value) ||
        candidate.email?.toLowerCase().includes(value) ||
        candidate.mobileNo?.toString().includes(value)
    );
    setFilteredCandidates(filtered);
  };

  // ✅ Export all fields to Excel
  const exportToExcel = () => {
    if (!filteredCandidates.length) {
      message.warning("No data available to export!");
      return;
    }

    const exportData = filteredCandidates.map((emp) => ({
      "Full Name": emp.name || "N/A",
      Email: emp.email || "N/A",
      Mobile: emp.mobileNo || "N/A",
      "Date of Birth": emp.dateOfBirth || "N/A",
      "Father Name": emp.fatherName || "N/A",
      "Father Occupation": emp.fatherOccupation || "N/A",
      "Mother Name": emp.motherName || "N/A",
      "Mother Occupation": emp.motherOccupation || "N/A",
      "Marital Status": emp.maritalStatus || "N/A",
      "Present Address": emp.presentAddress || "N/A",
      "Permanent Address": emp.permanentAddress || "N/A",
      "Last Employer": emp.lastEmployee || "N/A",
      "Total Experience": emp.totalExp || "N/A",
      "Current Employer": emp.currentEmployee || "N/A",
      "In-hand Salary": emp.inHandSalary || "N/A",
      Bike: emp.bike ? "Yes" : "No",
      "PAN Card Number": emp.panCardNumber || "N/A",
      "Aadhar Card Number": emp.aadharCardNumber || "N/A",
      "Account Holder": emp.accountHolderName || "N/A",
      "Bank Name": emp.bankName || "N/A",
      "IFSC Code": emp.ifscCode || "N/A",
      "Account Number": emp.accountNumber || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Employees.xlsx");
  };

  // ✅ Helper component for detail sections
  const Section = ({ title, data }) => (
    <>
      <Divider orientation="left">{title}</Divider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {data.map((item) => (
          <div
            key={item.key}
            style={{
              background: "#fff",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <strong style={{ display: "block", fontSize: "12px", color: "#888" }}>
              {item.key}
            </strong>
            <span style={{ fontSize: "14px", color: "#333" }}>
              {item.value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  // ✅ Expanded row with sections
  const expandedRowRender = (record) => {
    const personalInfo = [
      { key: "Date of Birth", value: record.dateOfBirth },
      { key: "Father Name", value: record.fatherName },
      { key: "Father Occupation", value: record.fatherOccupation },
      { key: "Mother Name", value: record.motherName },
      { key: "Mother Occupation", value: record.motherOccupation },
      { key: "Marital Status", value: record.maritalStatus },
      { key: "Present Address", value: record.presentAddress },
      { key: "Permanent Address", value: record.permanentAddress },
    ];

    const education = [
      {
        key: "Education",
        value: record.education
          ?.map(
            (e) => `${e.qualification} - ${e.institute} (${e.yearOfPassing})`
          )
          .join(", "),
      },
    ];

    const employment = [
      { key: "Last Employer", value: record.lastEmployee },
      { key: "Total Experience", value: record.totalExp },
      { key: "Current Employer", value: record.currentEmployee },
      { key: "In-hand Salary", value: record.inHandSalary },
      { key: "Bike", value: record.bike ? "Yes" : "No" },
    ];

    const bankDetails = [
      { key: "PAN No", value: record.panCardNumber },
      { key: "Aadhar No", value: record.aadharCardNumber },
      { key: "Account Holder", value: record.accountHolderName },
      { key: "Bank Name", value: record.bankName },
      { key: "IFSC Code", value: record.ifscCode },
      { key: "Account Number", value: record.accountNumber },
    ];

    const documents = [
      {
        key: "PAN Image",
        value: record.panUrl ? (
          <a href={record.panUrl} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "N/A"
        ),
      },
      {
        key: "Aadhar Image",
        value: record.aadharUrl ? (
          <a href={record.aadharUrl} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "N/A"
        ),
      },
      {
        key: "Bank Statement",
        value: record.bankStatementUrl ? (
          <a href={record.bankStatementUrl} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "N/A"
        ),
      },
    ];

    return (
      <div
        style={{
          background: "#fafafa",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #f0f0f0",
        }}
      >
        <Title level={4} style={{ marginBottom: 20 }}>
          Employee Details
        </Title>
        <Section title="👤 Personal Info" data={personalInfo} />
        <Section title="🎓 Education" data={education} />
        <Section title="💼 Employment" data={employment} />
        <Section title="🏦 Bank Details" data={bankDetails} />
        <Section title="📑 Documents" data={documents} />
      </div>
    );
  };

  // ✅ Main table
  const columns = [
    {
      title: "Sr No",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, record) =>
        text ? (
          <Avatar src={text} />
        ) : (
          <Avatar>{record.name?.charAt(0)}</Avatar>
        ),
      width: 70,
    },
    { title: "Name", dataIndex: "name", key: "name", width: 160 },
    { title: "Mobile", dataIndex: "mobileNo", key: "mobileNo", width: 130 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
  ];

  return (
    <div style={{ padding: "20px" }}>
 <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap", // ✅ makes it responsive
    gap: "10px",
  }}
>
  {/* Left side → Title */}
  <Title level={2} style={{ margin: 0 }}>
    Employees List
  </Title>

  {/* Right side → Search + Export */}
  <Space>
    <Input
      placeholder="Search by name, email, or mobile"
      value={search}
      onChange={handleSearch}
      prefix={<SearchOutlined />}
      allowClear
      style={{ minWidth: "250px" }}
    />
    <Button type="primary" onClick={exportToExcel}>
      Export to Excel
    </Button>
  </Space>
</div>


      <Spin spinning={loading} tip="Loading employees...">
        <Table
          dataSource={filteredCandidates}
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => !!record,
          }}
          rowKey={(record) => record._id || record.id}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          
        />
      </Spin>
    </div>
  );
};

export default EmployeesList;
