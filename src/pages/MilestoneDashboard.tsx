
import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, Alert, Card } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Milestone {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface ProjectFile {
  id?: number;
  fileName: string;
  uploadedBy: string;
  uploadedAt?: string;
  fileUrl?: string;
}

const MilestoneDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [finalProjects, setFinalProjects] = useState<ProjectFile[]>([]);
  const [form, setForm] = useState<Milestone>({ title: "", description: "", dueDate: "", completed: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchMilestones = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${projectId}/milestones`);
      setMilestones(res.data);
    } catch {
      setError("Failed to load milestones");
    }
  };

  const fetchFinalProjects = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${projectId}/files`);
      console.log("Fetched files:", res.data);
      setFinalProjects(res.data);
    } catch (err) {
      console.error("Error fetching final projects:", err);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchFinalProjects();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (form.id) await axiosInstance.put(`/api/milestones/${form.id}`, form);
      else await axiosInstance.post(`/api/projects/${projectId}/milestones`, form);

      setMessage(form.id ? "✅ Milestone updated!" : "✅ Milestone added!");
      setForm({ title: "", description: "", dueDate: "", completed: false });
      fetchMilestones();
    } catch {
      setError("Error saving milestone");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/api/milestones/${id}`);
      setMessage("Deleted!");
      fetchMilestones();
    } catch {
      setError("Failed to delete milestone");
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Data
  const completedCount = milestones.filter((m) => m.completed).length;
  const pendingCount = milestones.length - completedCount;

  const chartData = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ["#28a745", "#dc3545"];

  return (
    <Container className="mt-4">
      {/* Back Button */}
      <div className="mb-3">
        <Button variant="secondary" onClick={() => navigate("/admin")}>
          ← Back to Admin Dashboard
        </Button>
      </div>

      {message && <Alert variant="success" dismissible onClose={() => setMessage("")}>{message}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4>{form.id ? "Edit Milestone" : "Add Milestone"}</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Button type="submit" className="w-100" variant="primary">
              {form.id ? "Update" : "Add"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h4>Milestones</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due</th>
                <th>Completed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.title}</td>
                  <td>{m.description}</td>
                  <td>{m.dueDate}</td>
                  <td>{m.completed ? "✅" : "❌"}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => setForm(m)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ height: 300 }}>
            <h5 className="text-center mt-4">Current Progress In Milestone Completion</h5>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4>Final Project Submissions</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Uploaded By</th>
                <th>Uploaded At</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {finalProjects.length > 0 ? (
                finalProjects.map((fp) => (
                  <tr key={fp.id}>
                    <td>{fp.fileName}</td>
                    <td>{fp.uploadedBy}</td>
                    <td>{new Date(fp.uploadedAt!).toLocaleString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDownload(fp.fileUrl!, fp.fileName)}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No final projects submitted
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MilestoneDashboard;







