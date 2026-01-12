import React, { useEffect, useState } from "react";
import { Tabs, Table, Spin, message, Button, Popconfirm, Tag, Card } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const categories = ["Development", "Database", "Cloud", "SAP", "Testing"];
const buttonGradient = "linear-gradient(90deg, #28235c, #a31d28)";
const editGradient = "linear-gradient(90deg, #45385e, #b8b2d5)";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GetCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/courses`);
      if (res.data.success) setCourses(res.data.data);
      else message.error("❌ Failed to load courses");
    } catch (err) {
      console.error(err);
      message.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/courses/${id}`);
      message.success("✅ Course deleted!");
      fetchCourses();
    } catch (err) {
      message.error("❌ Failed to delete");
    }
  };

  const getColumns = () => [
    {
      title: "Title",
      dataIndex: "courseName",
      key: "title",
      render: (text) => <strong style={{ color: "#45385e" }}>{text}</strong>,
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      render: (val) => <Tag color="#52c41a">₹{val}</Tag>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (val) => <Tag color="#108ee9">{val}</Tag>,
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Trending",
      dataIndex: "isTrending",
      key: "isTrending",
      render: (val) =>
        val ? (
          <Tag color="red" style={{ fontWeight: 600 }}>
            🔥 Trending
          </Tag>
        ) : (
          <Tag color="gray">No</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/admin/courses/edit/${record._id}`}>
            <Button
              style={{
                background: editGradient,
                color: "#fff",
                border: "none",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              ✏️ Edit
            </Button>
          </Link>
          <Popconfirm
            title="Delete this course?"
            onConfirm={() => handleDelete(record._id)}
          >
          <Button
  type="primary"
  danger
  style={{
    color: "#fff",
    border: "none",
    fontWeight: 500,
    borderRadius: "6px",
    padding: "0 15px",
  }}
  onClick={() => handleDelete(record._id)}
>
  🗑 Delete
</Button>

          </Popconfirm>
        </div>
      ),
    },
  ];

  const renderCoursesByCategory = (category) => {
    const filtered = courses.filter((c) => c.category === category);
    if (!filtered.length)
      return (
        <p style={{ textAlign: "center", padding: 20, fontStyle: "italic" }}>
          No courses found.
        </p>
      );
    return (
      <Table
        rowKey="_id"
        columns={getColumns()}
        dataSource={filtered}
        pagination={false}
        bordered
        style={{ backgroundColor: "#fff", borderRadius: 12, padding: 10 }}
      />
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ fontWeight: 600, color: "#45385e" }}>📚 Browse Courses</h2>
        <Link to="/admin/courses/create">
          <Button
            style={{
              background: buttonGradient,
              color: "#fff",
              border: "none",
              fontWeight: 600,
              padding: "0 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            ➕ Add Course
          </Button>
        </Link>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
      ) : (
        <Card
          style={{
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Tabs
            defaultActiveKey={categories[0]}
            centered
            tabBarStyle={{
              fontWeight: 600,
              color: "#45385e",
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            {categories.map((cat) => (
              <Tabs.TabPane tab={cat} key={cat}>
                {renderCoursesByCategory(cat)}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default GetCourses;
