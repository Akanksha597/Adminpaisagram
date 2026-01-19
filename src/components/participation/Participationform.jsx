import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://paisagramsbackend.vercel.app/api/participants";

function ParticipationAdmin() {
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
      toast.error("Failed to fetch participants");
    }
  };

  // Validation
  const validate = () => {
    const err = {};
    if (!form.name || form.name.length < 3) err.name = "Name must be at least 3 characters";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = "Enter valid 10-digit mobile number";

    // Check for duplicate mobile number
    const duplicate = participants.find(
      (p) => p.mobile === form.mobile && p._id !== editId
    );
    if (duplicate) err.mobile = "Mobile number already exists";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Participant updated successfully!");
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Participant added successfully!");
      }
      setForm({ name: "", mobile: "" });
      setEditId(null);
      setShowModal(false);
      fetchParticipants();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to submit participant");
    }
  };

  const handleEdit = (participant) => {
    setForm({ name: participant.name, mobile: participant.mobile });
    setEditId(participant._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        toast.success("Participant deleted successfully!");
        fetchParticipants();
      } catch (err) {
        console.error("Error deleting participant:", err);
        toast.error("Failed to delete participant");
      }
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="mb-3">
        <Col>
          <h2>Admin Participation Panel</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)} variant="primary">
            <FaPlus /> Add Participant
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No participants found.
              </td>
            </tr>
          )}
          {participants.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.mobile}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(p)}>
                  <FaEdit /> Edit
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditId(null);
          setForm({ name: "", mobile: "" });
          setErrors({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Participant" : "Add Participant"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                isInvalid={!!errors.mobile}
              />
              <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="success" type="submit">
              {editId ? "Update" : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ParticipationAdmin;
