import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EVENTS_API = "https://paisagramsbackend.vercel.app/api/events";
const PARTICIPANTS_API = "https://paisagramsbackend.vercel.app/api/participants";
const GROUP_API = "https://paisagramsbackend.vercel.app/api/groups";

function GroupAdminPanel() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [groups, setGroups] = useState([]);

  const [form, setForm] = useState({ eventId: "", participantIds: [] });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all data on mount
  useEffect(() => {
    fetchEvents();
    fetchParticipants();
    fetchGroups();
  }, []);

  // ===========================
  // Fetch events
  // ===========================
const confirmDeleteToast = (onConfirm) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p className="mb-2">Are you sure you want to delete this group?</p>
        <div className="d-flex justify-content-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={closeToast}
          >
            No
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              closeToast();
              onConfirm();
            }}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};

  const fetchEvents = async () => {
    try {
      const res = await fetch(EVENTS_API);
      const data = await res.json();
      setEvents(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch events");
    }
  };

  // ===========================
  // Fetch participants
  // ===========================
  const fetchParticipants = async () => {
    try {
      const res = await fetch(PARTICIPANTS_API);
      const data = await res.json();
      setParticipants(
        Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch participants");
    }
  };

  // ===========================
  // Fetch groups
  // ===========================
  const fetchGroups = async () => {
    try {
      const res = await fetch(GROUP_API);
      const data = await res.json();
      // normalize group data
      setGroups(
        (Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []).map((g) => ({
          ...g,
          participantIds: Array.isArray(g.participantIds) ? g.participantIds : [],
          eventId: g.eventId || {},
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch groups");
    }
  };

  // ===========================
  // Validation
  // ===========================
  const validate = () => {
    const err = {};
    if (!form.eventId) err.eventId = "Please select an event";
    if (!form.participantIds || form.participantIds.length === 0)
      err.participantIds = "Select at least one participant";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ===========================
  // Submit Group (Create/Update)
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...form,
        participantIds: [...new Set(form.participantIds)], // remove duplicates
      };

      if (editId) {
        await fetch(`${GROUP_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Group updated successfully!");
      } else {
        await fetch(GROUP_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Group created successfully!");
      }

      setForm({ eventId: "", participantIds: [] });
      setEditId(null);
      setShowModal(false);
      fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit group");
    }
  };

  // ===========================
  // Edit group
  // ===========================
  const handleEdit = (group) => {
    setForm({
      eventId: group.eventId?._id || "",
      participantIds: group.participantIds.map((p) => p._id),
    });
    setEditId(group._id);
    setShowModal(true);
  };

  // ===========================
  // Delete group
  // ===========================
const handleDelete = (id) => {
  confirmDeleteToast(async () => {
    try {
      const res = await fetch(`${GROUP_API}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success(data.message || "Group deleted successfully!");
      fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete group");
    }
  });
};



  // Toggle checkbox for participants
  const toggleParticipant = (id) => {
    if (form.participantIds.includes(id)) {
      setForm({ ...form, participantIds: form.participantIds.filter((p) => p !== id) });
    } else {
      setForm({ ...form, participantIds: [...form.participantIds, id] });
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="mb-3">
        <Col>
          <h2>Admin Group Panel</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Group
          </Button>
        </Col>
      </Row>

      {/* Groups Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Event</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No groups found</td>
            </tr>
          ) : (
            groups.map((g, index) => (
              <tr key={g._id}>
                <td>{index + 1}</td>
                <td>G{events.find((e) => e._id === g.eventId?._id)?.eventName || "-"}</td>
                <td>
  {g.participantIds.length > 0 ? (
    g.participantIds.map((p, i) => (
      <div key={i}>
        {p.name.trim()}
      </div>
    ))
  ) : (
    "-"
  )}
</td>

                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(g)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(g._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </Table>

      {/* Modal for Add/Edit */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditId(null);
          setForm({ eventId: "", participantIds: [] });
          setErrors({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Group" : "Add Group"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Event Select */}
            <Form.Group className="mb-3">
              <Form.Label>Select Event</Form.Label>
              <Form.Select
                value={form.eventId}
                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                isInvalid={!!errors.eventId}
              >
                <option value="">-- Select Event --</option>
                {events
                  .filter((event) => event.eventCategory === "group") // <-- filter by category
                  .map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.eventName || event.name}
                    </option>
                  ))}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errors.eventId}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Participants Checkboxes */}
            <Form.Group className="mb-3">
              <Form.Label>Select Participants</Form.Label>
              <div className="d-flex flex-column">
                {participants.map((p) => (
                  <Form.Check
                    key={p._id}
                    type="checkbox"
                    label={`${p.name.trim()} (${p.mobile})`}
                    checked={form.participantIds.includes(p._id)}
                    onChange={() => toggleParticipant(p._id)}
                  />
                ))}
              </div>
              {errors.participantIds && (
                <div className="text-danger mt-1">{errors.participantIds}</div>
              )}
            </Form.Group>

            <Button variant="success" type="submit">
              {editId ? "Update Group" : "Create Group"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default GroupAdminPanel;
