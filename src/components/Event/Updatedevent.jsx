import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    eventCategory: "",
    startDate: "",
    endDate: "",
    shortdescription: "",
    description: "",
  });

  /* ---------------- FETCH EVENT ---------------- */
  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch(
        `https://paisagramsbackend.vercel.app/api/events/${id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      const start = data.data.startDate?.slice(0, 10);
      const end = data.data.endDate?.slice(0, 10);

      // 🔥 CHECK EXPIRED
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (end && new Date(end) < today) {
        setIsExpired(true);
      }

      setFormData({
        eventName: data.data.eventName || "",
        eventCategory: data.data.eventCategory || "",
        startDate: start || "",
        endDate: end || "",
        shortdescription: data.data.shortdescription || "",
        description: data.data.description || "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired) {
      toast.error("Expired event cannot be edited");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `https://paisagramsbackend.vercel.app/api/events/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Event updated successfully");
      navigate("/admin/Eventlist");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h4 className="text-center mb-3">Edit Event</h4>

              {/* 🔴 EXPIRED MESSAGE */}
              {isExpired && (
                <Alert variant="danger">
                  This event is completed. Editing is disabled.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Category</Form.Label>
                  <Form.Control
                    value={formData.eventCategory}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    disabled={isExpired}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.startDate}
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={isExpired}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shortdescription"
                    value={formData.shortdescription}
                    onChange={handleChange}
                    disabled={isExpired}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isExpired}
                  />
                </Form.Group>

                {!isExpired && (
                  <Button
                    type="submit"
                    className="float-end"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Event"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditEvent;
