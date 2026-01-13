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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModal, setViewModal] = useState({ show: false, event: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://paisagramsbackend.vercel.app/api/events");
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch events");
      setEvents(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    toast.warn(
      <div>
        <p className="mb-2">Are you sure you want to delete this ?</p>
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
      const res = await fetch(`https://paisagramsbackend.vercel.app/api/events/${id}`, {
        method: "DELETE",
      });
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
            <Button variant="primary" onClick={() => navigate("/admin/AddEvent")}>
              + Add Events
            </Button>
          </Stack>

          {loading && (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && events.length === 0 && (
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
             
                 

                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={event._id}>
                    <td>{index + 1}</td>
                    <td>{event.eventName}</td>
                    <td>
                      <Badge
                        bg={event.eventCategory === "group" ? "primary" : "success"}
                        className="text-capitalize d-flex align-items-center gap-1"
                      >
                        {event.eventCategory === "group" ? <FaUsers /> : <FaUser />}
                        {event.eventCategory}
                      </Badge>
                    </td>
                    <td>{new Date(event.startDate).toLocaleDateString()}</td>
                    <td>{new Date(event.endDate).toLocaleDateString()}</td>
                  
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
                ))}
              </tbody>
            </Table>
          )}

          {/* Attractive modal for viewing full event details */}
          <Modal show={viewModal.show} onHide={handleCloseModal} centered size="lg">
            {viewModal.event && (
              <>
                <Modal.Header closeButton className=" text-black">
                  <Modal.Title className="fs-4 fw-bold">
                    {viewModal.event.eventName}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Card className="shadow-sm p-4 rounded">
                    <Stack gap={3}>
                      {/* Category */}
                      <div className="d-flex align-items-center gap-2">
                        <strong>Category:</strong>
                        <Badge
                          bg={
                            viewModal.event.eventCategory === "group"
                              ? "primary"
                              : "success"
                          }
                          className="text-capitalize d-flex align-items-center gap-1"
                        >
                          {viewModal.event.eventCategory === "group" ? (
                            <FaUsers />
                          ) : (
                            <FaUser />
                          )}
                          {viewModal.event.eventCategory}
                        </Badge>
                      </div>

                      {/* Dates */}
                      <div className="d-flex gap-4">
                        <div>
                          <FaCalendarAlt className="me-1" />
                          <strong>Start:</strong>{" "}
                          {new Date(viewModal.event.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          <FaCalendarAlt className="me-1" />
                          <strong>End:</strong>{" "}
                          {new Date(viewModal.event.endDate).toLocaleDateString()}
                        </div>
                      </div>
                       <div>
                        <strong>shortdescription:</strong>
                        <p className="mt-2 bg-light p-3 rounded shadow-sm">
                          {viewModal.event.shortdescription}
                        </p>
                      </div>

                      {/* Description */}
                      <div>
                        <strong>Description:</strong>
                        <p className="mt-2 bg-light p-3 rounded shadow-sm">
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