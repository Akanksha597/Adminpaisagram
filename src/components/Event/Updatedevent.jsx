import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventCategory: "",
    startDate: "",
    endDate: "",
    shortdescription: "",
    description: "",
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`https://paisagramsbackend.vercel.app/api/events/${id}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to load event");

      setFormData({
        eventName: result.data.eventName || "",
        eventCategory: result.data.eventCategory || "",
        startDate: result.data.startDate?.slice(0, 10) || "",
        endDate: result.data.endDate?.slice(0, 10) || "",
        shortdescription: result.data.shortdescription || "",
        description: result.data.description || "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`https://paisagram-backend.vercel.app/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Update failed");

      toast.success("Event updated successfully!");
      navigate("/admin/Eventlist");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold text-primary">
                Update Event
              </h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Category</Form.Label>
                  <Form.Select
                    name="eventCategory"
                    value={formData.eventCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="group">Group</option>
                    <option value="individual">Individual</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
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
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shortdescription"
                    value={formData.shortdescription}
                    onChange={handleChange}
                    placeholder="Event short description"
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
                    placeholder="Event description"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-sm btn-primary  float-end"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update Event"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditEvent;