import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table, Card, Badge } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "https://paisagramsbackend.vercel.app/api/campaion";

function CampaignReports() {
  const [activeReport, setActiveReport] = useState("");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // for summary always

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventName, setEventName] = useState("");

  /* ================= FETCH ALL DATA FOR SUMMARY ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(API);
        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];

        setAllData(list);
      } catch (err) {
        console.error("Summary fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  /* ================= FETCH FILTERED DATA (DETAILS VIEW) ================= */
  const fetchData = async (type) => {
    try {
      const res = await axios.get(API);

      const list =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      let filtered = [];

      // ===== DATE WISE =====
      if (type === "date") {
        if (!startDate || !endDate) {
          alert("Please select start & end date");
          return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filtered = list.filter((item) => {
          const created = new Date(item.createdAt);
          return created >= start && created <= end;
        });
      }

      // ===== EVENT WISE =====
      if (type === "event") {
        if (!eventName.trim()) {
          alert("Please enter event name");
          return;
        }

        filtered = list.filter((item) =>
          item.eventName?.toLowerCase().includes(eventName.toLowerCase())
        );
      }

      setData(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    }
  };

  /* ================= SUMMARY DATA (ALWAYS FROM allData) ================= */
  const summaryData = Object.values(
    allData.reduce((acc, item) => {
      const key = item.eventName || "Unknown Event";

      if (!acc[key]) {
        acc[key] = {
          id: item._id,
          eventName: key,
          users: new Set(),
          responses: 0,
        };
      }

      acc[key].responses += 1;
      acc[key].users.add(item.mobile || item.email);

      return acc;
    }, {})
  ).map((item) => ({
    id: item.id,
    eventName: item.eventName,
    status: item.responses > 0 ? "Active" : "Inactive",
    userCount: item.users.size,
    responses: item.responses,
  }));

  /* ================= EXCEL DOWNLOAD ================= */
  const downloadExcel = (fileName) => {
    const sheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        EventName: item.eventName,
        Description: item.eventDescription,
        Name: item.name,
        Mobile: item.mobile,
        Email: item.email,
        Occupation: item.occupation,
        Date: new Date(item.createdAt).toLocaleString(),
      }))
    );

    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Report");

    const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-4">📊 Campaign Reports</h4>

      {/* ===== REPORT TYPE ===== */}
      <Row className="mb-4">
        <Col md={6}>
          <Card
            className="p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveReport("date");
              setData([]);
            }}
          >
            📅 Date Wise Report
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveReport("event");
              setData([]);
            }}
          >
            🎯 Event Wise Report
          </Card>
        </Col>
      </Row>

      {/* ===== DATE REPORT FILTER ===== */}
      {activeReport === "date" && (
        <Row className="mb-3">
          <Col md={3}>
            <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)} />
          </Col>
          <Col md={3}>
            <Button onClick={() => fetchData("date")}>View Details</Button>
          </Col>
          <Col md={3}>
            <Button
              variant="success"
              disabled={!data.length}
              onClick={() => downloadExcel("Date_Wise_Report")}
            >
              Download Excel
            </Button>
          </Col>
        </Row>
      )}

      {/* ===== EVENT REPORT FILTER ===== */}
      {activeReport === "event" && (
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              placeholder="Enter Event Name"
              onChange={(e) => setEventName(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button onClick={() => fetchData("event")}>View Details</Button>
          </Col>
          <Col md={4}>
            <Button
              variant="success"
              disabled={!data.length}
              onClick={() => downloadExcel("Event_Wise_Report")}
            >
              Download Excel
            </Button>
          </Col>
        </Row>
      )}

      {/* ================= DETAILED REPORT (TOP VIEW) ================= */}
      {activeReport && (
        <>
          <h5 className="mt-4 mb-3">📄 Detailed Report</h5>

          <Table bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Event</th>
                <th>Description</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Occupation</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item, i) => (
                  <tr key={item._id || i}>
                    <td>{i + 1}</td>
                    <td>{item.eventName}</td>
                    <td>{item.eventDescription}</td>
                    <td>{item.name}</td>
                    <td>{item.mobile}</td>
                    <td>{item.email}</td>
                    <td>{item.occupation}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {/* ================= SUMMARY REPORT (ALWAYS DISPLAY) ================= */}
      <>
        <h5 className="mt-5 mb-3">📌 Summary Report (All Campaigns)</h5>

        <Table bordered hover responsive>
          <thead className="table-secondary">
            <tr>
              <th>#</th>
              <th>Event Name</th>
              <th>Status</th>
         
              <th>Responses</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.length ? (
              summaryData.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.eventName}</td>
                  <td>
                    <Badge bg={item.status === "Active" ? "success" : "danger"}>
                      {item.status}
                    </Badge>
                  </td>
             
                  <td>{item.responses}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Loading Summary...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    </Container>
  );
}

export default CampaignReports;
