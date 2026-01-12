import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Event = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventCategory: "",
    eventName: "",
    startDate: "",
    endDate: "",
    shortdescription: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://paisagramsbackend.vercel.app/api/events/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setMessage("✅ Event created successfully");

      setTimeout(() => {
        navigate("/admin/Eventlist");
      }, 1000);

      setFormData({
        eventCategory: "",
        eventName: "",
        startDate: "",
        endDate: "",
        shortdescription: "",
        description: "",
      });
      setValidated(false);
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold text-primary">
                Create Events
              </h3>

              {message && (
                <div className="alert alert-info text-center">{message}</div>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Event Category */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Event Category <span className="text-danger">*</span>
                  </Form.Label>
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
                  <Form.Control.Feedback type="invalid">
                    Event category is required
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Event Name */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Event Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Event name is required
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Dates */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Start Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Start date is required
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        End Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        End date is required
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Short Description */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Short Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="shortdescription"
                    value={formData.shortdescription}
                    onChange={handleChange}
                    placeholder="Event short description"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Short description is required
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event description"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-sm btn-primary float-end"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Create Events"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Event;
