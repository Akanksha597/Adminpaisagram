// "use client";
// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Upload,
//   Select,
//   InputNumber,
//   message,
//   Switch,
//   Row,
//   Col,
//   Card,
//   Typography,
//   Divider,
//   DatePicker,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { toast } from "react-toastify";
// const { TextArea } = Input;
// const { Title } = Typography;
// const { Option } = Select;

// const categoryOptions = ["Development", "Database", "Cloud", "SAP"];


// const modeOptions = ["Online", "Offline", "Hybrid"];

// const CreateCourseForm = () => {
//   const [loading, setLoading] = useState(false);
// const handleSubmit = async (values) => {
//   try {
//     setLoading(true);
//     const formData = new FormData();

//     formData.append("courseName", values.courseName);
//     formData.append("timeSlot", values.timeSlot);
//     formData.append("mode", values.mode);
//     formData.append("instructorName", values.instructorName);
//     formData.append("startDate", values.startDate?.toISOString());
//     formData.append("endDate", values.endDate?.toISOString());
//     formData.append("seatsAvailable", values.seatsAvailable);
//     formData.append("isTrending", values.isTrending);
//     formData.append("isUpcomingBatch", values.isUpcomingBatch);
//     formData.append("fee", values.fee);
//     formData.append("contactNumber", values.contactNumber);
//     formData.append("location", values.location);
//     formData.append("category", values.category);
//     formData.append("duration", values.duration);
//     formData.append("description", values.description);

//     if (values.images && values.images.length > 0) {
//       values.images.forEach((file) => {
//         formData.append("images", file.originFileObj);
//       });
//     }

//     if (values.syllabus && values.syllabus.length > 0) {
//       formData.append("syllabus", values.syllabus[0].originFileObj);
//     }

//     const res = await axios.post(
//       "http://localhost:5016/api/v1/courses",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     if (res.data.success) {
//       toast.success("✅ Course created successfully!");
//     } else {
//       toast.error("❌ Failed to create course.");
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("❌ Something went wrong!");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <Card
//       style={{
//         maxWidth: 950,
//         margin: "40px auto",
//         padding: "20px 30px",
//         borderRadius: 12,
//         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//       }}
//     >
//       <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
//         Create New Course
//       </Title>

//       <Form layout="vertical" onFinish={handleSubmit}>
//         <Divider>Course Information</Divider>
//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Course Name"
//               name="courseName"
//               rules={[{ required: true, message: "Please enter course name" }]}
//             >
//               <Input placeholder="Enter course name" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Instructor Name"
//               name="instructorName"
//               rules={[{ required: true, message: "Please enter instructor name" }]}
//             >
//               <Input placeholder="Enter instructor name" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Category"
//               name="category"
//               rules={[{ required: true, message: "Please select a category" }]}
//             >
//               <Select placeholder="Select category">
//                 {categoryOptions.map((cat) => (
//                   <Option key={cat} value={cat}>
//                     {cat}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Mode"
//               name="mode"
//               rules={[{ required: true, message: "Please select mode" }]}
//             >
//               <Select placeholder="Select mode">
//                 {modeOptions.map((m) => (
//                   <Option key={m} value={m}>
//                     {m}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Time Slot"
//               name="timeSlot"
//               rules={[{ required: true, message: "Please enter time slot" }]}
//             >
//               <Input placeholder="e.g. Mon-Wed-Fri 6:00 PM - 9:00 PM" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Location"
//               name="location"
//               rules={[{ required: true, message: "Please enter location" }]}
//             >
//               <Input placeholder="Enter location" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Start Date"
//               name="startDate"
//               rules={[{ required: true, message: "Please select start date" }]}
//             >
//               <DatePicker style={{ width: "100%" }} />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="End Date"
//               name="endDate"
//               rules={[{ required: true, message: "Please select end date" }]}
//             >
//               <DatePicker style={{ width: "100%" }} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Seats Available"
//               name="seatsAvailable"
//               rules={[{ required: true, message: "Please enter seats available" }]}
//             >
//               <InputNumber style={{ width: "100%" }} min={1} />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Fee (₹)"
//               name="fee"
//               rules={[{ required: true, message: "Please enter fee" }]}
//             >
//               <InputNumber style={{ width: "100%" }} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Duration"
//               name="duration"
//               rules={[{ required: true, message: "Please enter duration" }]}
//             >
//               <Input placeholder="e.g. 3 months" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Contact Number"
//               name="contactNumber"
//               rules={[
//                 { required: true, message: "Please enter contact number" },
//                 { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
//               ]}
//             >
//               <Input placeholder="Enter contact number" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           label="Description"
//           name="description"
//           rules={[{ required: true, message: "Please enter course description" }]}
//         >
//           <TextArea rows={4} placeholder="Enter course description" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item label="Trending" name="isTrending" valuePropName="checked">
//               <Switch />
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item label="Upcoming Batch" name="isUpcomingBatch" valuePropName="checked">
//               <Switch />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Divider>Uploads</Divider>
//         <Row gutter={16}>
//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Course Images"
//               name="images"
//               valuePropName="fileList"
//               getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
//             >
//               <Upload multiple beforeUpload={() => false} listType="picture">
//                 <Button icon={<UploadOutlined />}>Upload Images</Button>
//               </Upload>
//             </Form.Item>
//           </Col>

//           <Col xs={24} md={12}>
//             <Form.Item
//               label="Syllabus (PDF)"
//               name="syllabus"
//               valuePropName="fileList"
//               getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
//             >
//               <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>Upload PDF</Button>
//               </Upload>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             size="large"
//             style={{ borderRadius: 8, padding: "0 40px" }}
//           >
//             Create Course
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default CreateCourseForm;



"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  DatePicker,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ✅ for redirect

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const categoryOptions = ["Development", "Database", "Cloud", "SAP",'Testing'];
const modeOptions = ["Online", "Offline", "Hybrid"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CreateCourseForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ navigate hook

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("courseName", values.courseName);
      formData.append("timeSlot", values.timeSlot);
      formData.append("mode", values.mode);
      formData.append("instructorName", values.instructorName);
      formData.append("startDate", values.startDate?.toISOString());
      formData.append("endDate", values.endDate?.toISOString());
      formData.append("seatsAvailable", values.seatsAvailable);
      formData.append("isTrending", values.isTrending);
      formData.append("isUpcomingBatch", values.isUpcomingBatch);
      formData.append("fee", values.fee);
      formData.append("contactNumber", values.contactNumber);
      formData.append("location", values.location);
      formData.append("category", values.category);
      formData.append("duration", values.duration);
      formData.append("description", values.description);

      // Images
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append("images", file.originFileObj);
        });
      }

      // Syllabus
      if (values.syllabus && values.syllabus.length > 0) {
        formData.append("syllabus", values.syllabus[0].originFileObj);
      }

      const res = await axios.post(`${API_BASE_URL}/api/v1/courses`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("✅ Course created successfully!");
        navigate("/admin/courses/list"); // ✅ redirect after success
      } else {
        toast.error("❌ Failed to create course.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        maxWidth: 950,
        margin: "40px auto",
        padding: "20px 30px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Create New Course
      </Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Divider>Course Information</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Course Name"
              name="courseName"
              rules={[{ required: true, message: "Please enter course name" }]}
            >
              <Input placeholder="Enter course name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Instructor Name"
              name="instructorName"
              rules={[{ required: true, message: "Please enter instructor name" }]}
            >
              <Input placeholder="Enter instructor name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                {categoryOptions.map((cat) => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Mode"
              name="mode"
              rules={[{ required: true, message: "Please select mode" }]}
            >
              <Select placeholder="Select mode">
                {modeOptions.map((m) => (
                  <Option key={m} value={m}>{m}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Time Slot"
              name="timeSlot"
              rules={[{ required: true, message: "Please enter time slot" }]}
            >
              <Input placeholder="e.g. Mon-Wed-Fri 6:00 PM - 9:00 PM" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Seats Available"
              name="seatsAvailable"
              rules={[{ required: true, message: "Please enter seats available" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Fee (₹)"
              name="fee"
              rules={[{ required: true, message: "Please enter fee" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input placeholder="e.g. 3 months" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                { required: true, message: "Please enter contact number" },
                { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
              ]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter course description" }]}
        >
          <TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Trending" name="isTrending" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Upcoming Batch" name="isUpcomingBatch" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Uploads</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Course Images"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            >
              <Upload multiple beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Images</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Syllabus (PDF)"
              name="syllabus"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                <Button icon={<UploadOutlined />}>Upload PDF</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ borderRadius: 8, padding: "0 40px" }}
          >
            Create Course
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateCourseForm;

