"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Calendar, Spin, Table } from "antd";
import axios from "axios";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaCalendarAlt, FaBullhorn } from "react-icons/fa";

/* ================= API URLS ================= */
const EVENTS_API = "https://paisagramsbackend.vercel.app/api/events";
const CAMPAIGN_API = "https://paisagramsbackend.vercel.app/api/campaion/";

const Dashboard = () => {
  /* ================= STATES ================= */
  const [counts, setCounts] = useState({
    events: 0,
    campaigns: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("events");

  /* ================= HELPERS ================= */
  const getDate = (item) =>
    item?.createdAt || item?.created_at || item?.date;

  /* ================= FETCH DATA ================= */
  const fetchDashboardData = async () => {
    try {
      const [eventsRes, campaignRes] = await Promise.all([
        axios.get(EVENTS_API),
        axios.get(CAMPAIGN_API),
      ]);

      // 🔑 API RESPONSE HANDLING
      const events = eventsRes?.data?.data || [];
      const campaigns = campaignRes?.data?.data || [];

      /* ===== COUNTS ===== */
      setCounts({
        events: events.length,
        campaigns: campaigns.length,
      });

      /* ===== RECENT ACTIVITY (LAST 3 EVENTS) ===== */
      const recent = [...events]
        .sort(
          (a, b) =>
            new Date(getDate(b)) - new Date(getDate(a))
        )
        .slice(0, 3)
        .map((item, index) => ({
          key: index,
          name: item?.name || "Event",
          type: "Event Created",
          date: new Date(getDate(item)).toLocaleDateString(),
        }));

      setRecentActivity(recent);

      /* ===== EVENT-WISE GRAPH ===== */
      const dayMap = {};
      events.forEach((event) => {
        const day = new Date(getDate(event)).toLocaleDateString("en-US", {
          weekday: "short",
        });
        dayMap[day] = (dayMap[day] || 0) + 1;
      });

      setChartData(
        Object.keys(dayMap).map((day) => ({
          day,
          value: dayMap[day],
        }))
      );
    } catch (error) {
      console.error("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================= UI CONFIG ================= */
  const cards = [
    {
      key: "events",
      label: "Events",
      icon: <FaCalendarAlt size={28} color="#fff" />,
      color: "linear-gradient(135deg,#6366f1,#3b82f6)",
    },
    {
      key: "campaigns",
      label: "Campaigns",
      icon: <FaBullhorn size={28} color="#fff" />,
      color: "linear-gradient(135deg,#f97316,#facc15)",
    },
  ];

  const activityColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "60px" }}>
        <Spin size="large" />
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div
      style={{
        padding: "30px",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ===== TITLE ===== */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "25px",
          color: "#1e293b",
        }}
      >
        Admin Dashboard
      </h1>

      {/* ===== CARDS ===== */}
      <Row gutter={[24, 24]}>
        {cards.map((card) => (
          <Col xs={24} md={12} key={card.key}>
            <Card
              onClick={() => setSelected(card.key)}
              hoverable
              style={{
                borderRadius: "20px",
                background: card.color,
                color: "#fff",
                cursor: "pointer",
                transform: selected === card.key ? "scale(1.04)" : "scale(1)",
                transition: "all 0.4s ease",
                boxShadow:
                  selected === card.key
                    ? "0 25px 50px rgba(0,0,0,0.35)"
                    : "0 12px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "36px", margin: 0 }}>
                    {counts[card.key]}
                  </h2>
                  <p style={{ marginTop: "6px", fontSize: "16px" }}>
                    {card.label}
                  </p>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "14px",
                    borderRadius: "14px",
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== MAIN SECTION ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: "35px" }}>
        {/* GRAPH */}
        <Col xs={24} md={16}>
          <Card
            style={{
              borderRadius: "22px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: "#4338ca", fontWeight: "700" }}>
               Event-wise Activity
            </h3>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                  activeDot={{ r: 9 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* RIGHT PANEL */}
        <Col xs={24} md={8}>
         
          <Card
          
            style={{
              borderRadius: "22px",
              marginBottom: "20px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
            }}
          >
             <h3 style={{ color: "#4338ca", fontWeight: "700" }}>
            Calender
            </h3>
            <Calendar fullscreen={false} />
          </Card>

        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
