import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Card,
  Button,
  Stack,
  Modal,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaUser } from "react-icons/fa";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [userCountMap, setUserCountMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModal, setViewModal] = useState({ show: false, event: null });

  const navigate = useNavigate();

  // ===============================
  // EVENT STATUS LOGIC
  // ===============================
  const getEventStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return "inactive";
    if (today > end) return "expired";
    return "active";
  };

  useEffect(() => {
    fetchEvents();
    fetchUserCounts();
  }, []);

  // ===============================
  // FETCH EVENTS
  // ===============================
  const fetchEvents = async () => {
    try {
      const res = await fetch(
        "https://paisagramsbackend.vercel.app/api/events"
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch events");
      setEvents(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH USER COUNTS
  // ===============================
  const fetchUserCounts = async () => {
    try {
      const res = await fetch(
        "https://paisagramsbackend.vercel.app/api/campaion/"
      );
      const result = await res.json();

      const counts = {};
      (result.data || []).forEach((user) => {
        if (user.eventName) {
          counts[user.eventName] = (counts[user.eventName] || 0) + 1;
        }
      });

      setUserCountMap(counts);
    } catch {
      console.error("Failed to fetch user counts");
    }
  };

  // ===============================
  // DELETE EVENT
  // ===============================
  const confirmDelete = (id) => {
    toast.warn(
      <div>
        <p className="mb-2">Are you sure you want to delete this event?</p>
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(id)}
          >
            Yes
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `https://paisagramsbackend.vercel.app/api/events/${id}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");

      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.dismiss();
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  // ===============================
  // MODAL
  // ===============================
  const handleView = (event) => {
    setViewModal({ show: true, event });
  };

  const handleCloseModal = () => {
    setViewModal({ show: false, event: null });
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Body>
          <Stack direction="horizontal" className="mb-4 justify-content-between">
            <h4 className="mb-0">All Events</h4>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/create-event")}
            >
              + Add Event
            </Button>
          </Stack>

          {loading && (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && events.length === 0 && (
            <Alert variant="info">No events found</Alert>
          )}

          {!loading && events.length > 0 && (
            <Table striped bordered hover responsive className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th className="text-center">Users Responses</th>
                  <th className="text-center">Status</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event, index) => {
                  const status = getEventStatus(
                    event.startDate,
                    event.endDate
                  );

                  return (
                    <tr key={event._id}>
                      <td>{index + 1}</td>
                      <td>{event.eventName}</td>

                      <td>
                        <Badge
                          bg={
                            event.eventCategory === "group"
                              ? "primary"
                              : "success"
                          }
                          className="text-capitalize d-flex align-items-center gap-1"
                        >
                          {event.eventCategory === "group" ? (
                            <FaUsers />
                          ) : (
                            <FaUser />
                          )}
                          {event.eventCategory}
                        </Badge>
                      </td>

                      <td>
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(event.endDate).toLocaleDateString()}
                      </td>

                      <td className="text-center">
                        <Badge bg="dark">
                          {userCountMap[event.eventName] || 0}
                        </Badge>
                      </td>

                      {/* ✅ STATUS FIXED */}
                      <td className="text-center">
                        {status === "active" && (
                          <Badge bg="success">Active</Badge>
                        )}
                        {status === "inactive" && (
                          <Badge bg="warning">Inactive</Badge>
                        )}
                        {status === "expired" && (
                          <Badge bg="danger">Expired</Badge>
                        )}
                      </td>

                      <td>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleView(event)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(`/admin/events/edit/${event._id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => confirmDelete(event._id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          {/* VIEW MODAL */}
          <Modal show={viewModal.show} onHide={handleCloseModal} centered size="lg">
            {viewModal.event && (
              <>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">
                    {viewModal.event.eventName}
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <Card className="shadow-sm p-4">
                    <Stack gap={3}>
                      <div>
                        <strong>Category:</strong>
                        <Badge bg="secondary" className="ms-2 text-capitalize">
                          {viewModal.event.eventCategory}
                        </Badge>
                      </div>

                      <div className="d-flex gap-4">
                        <div>
                          <FaCalendarAlt className="me-1" />
                          <strong>Start:</strong>{" "}
                          {new Date(
                            viewModal.event.startDate
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <FaCalendarAlt className="me-1" />
                          <strong>End:</strong>{" "}
                          {new Date(
                            viewModal.event.endDate
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        <strong>Short Description:</strong>
                        <p className="mt-2 bg-light p-3 rounded">
                          {viewModal.event.shortdescription}
                        </p>
                      </div>

                      <div>
                        <strong>Description:</strong>
                        <p className="mt-2 bg-light p-3 rounded">
                          {viewModal.event.description}
                        </p>
                      </div>
                    </Stack>
                  </Card>
                </Modal.Body>
              </>
            )}
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventList;
