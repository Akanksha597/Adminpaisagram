import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
} from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const LeavesList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/leave`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
      message.error("Failed to load leaves.");
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`${API_URL}/api/v1/leave/${id}`);
  //     message.success("Leave deleted successfully");
  //     fetchLeaves();
  //   } catch (err) {
  //     console.error("Error deleting leave", err);
  //     message.error("Failed to delete leave");
  //   }
  // };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    const filtered = leaves.filter(
      (leave) =>
        leave.employeeName.toLowerCase().includes(val) ||
        leave.leaveReason.toLowerCase().includes(val)
    );
    setFilteredLeaves(filtered);
  };

 const exportToExcel = () => {
  if (!filteredLeaves.length) {
    message.warning("No leave records available to export!");
    return;
  }

  const exportData = filteredLeaves.map((leave) => ({
    "Employee Name": leave.employeeName || "N/A",
    "Leave From": leave.leaveFrom
      ? moment(leave.leaveFrom).format("YYYY-MM-DD")
      : "N/A",
    "Leave To": leave.leaveTo
      ? moment(leave.leaveTo).format("YYYY-MM-DD")
      : "N/A",
    "Resume Duty On": leave.resumeDutyOn
      ? moment(leave.resumeDutyOn).format("YYYY-MM-DD")
      : "N/A",
    "No of Days": leave.noOfDays || "N/A",
    "Leave Reason": leave.leaveReason || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Leaves.xlsx");
};


  const columns = [
    { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
    {
      title: "Leave From",
      dataIndex: "leaveFrom",
      key: "leaveFrom",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Leave To",
      dataIndex: "leaveTo",
      key: "leaveTo",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Resume Duty On",
      dataIndex: "resumeDutyOn",
      key: "resumeDutyOn",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    { title: "No of Days", dataIndex: "noOfDays", key: "noOfDays" },
    { title: "Leave Reason", dataIndex: "leaveReason", key: "leaveReason" },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Popconfirm
    //       title="Are you sure to delete this leave?"
    //       onConfirm={() => handleDelete(record._id)}
    //       okText="Yes"
    //       cancelText="No"
    //     >
    //       <Button danger type="primary">
    //         Delete
    //       </Button>
    //     </Popconfirm>
    //   ),
    // },
  ];

  return (
    <div style={{ padding: "20px" }}>
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap", // ✅ responsive on smaller screens
    gap: "10px",
  }}
>
  {/* Left side → Title */}
  <h2 style={{ margin: 0 }}>Leave Management</h2>

  {/* Right side → Search + Export */}
  <Space>
    <Input
      placeholder="Search by name or reason"
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


      <Table
        dataSource={filteredLeaves}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LeavesList;
