import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Table,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface Project {
  id?: number;
  title: string;
  summary: string;
  status: string;
  startDate: string;
  endDate: string;
  assignedUsers?: string[];
}

interface UserOption {
  value: string;
  label: string;
}

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({
    title: "",
    summary: "",
    status: "PLANNING",
    startDate: "",
    endDate: "",
    assignedUsers: [],
  });

  const [users, setUsers] = useState<UserOption[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Admin guard
  useEffect(() => {
    if (user?.role !== "ADMIN") navigate("/login");
  }, [user, navigate]);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/users");
        setUsers(res.data.map((u: any) => ({ value: u.username, label: u.username })));
      } catch {}
    };
    loadUsers();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (p: Project) => {
    setForm(p);
    setAssignedUsers((p.assignedUsers || []).map((u) => ({ value: u, label: u })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        assignedUsers: assignedUsers.map((u) => u.value),
      };

      if (form.id) {
        await axiosInstance.put(`/api/projects/${form.id}`, payload);
        setMessage("Project updated successfully!");
      } else {
        await axiosInstance.post("/api/projects", payload);
        setMessage("Project added successfully!");
      }

      setForm({
        title: "",
        summary: "",
        status: "PLANNING",
        startDate: "",
        endDate: "",
        assignedUsers: [],
      });

      setAssignedUsers([]);
      fetchProjects();
    } catch (err) {
      setError("Failed to save project.");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure?")) return;

    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      setMessage("Project deleted successfully.");
      fetchProjects();
    } catch {
      setError("Failed to delete project.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- LIGHT GREEN BUTTON ---
  const lightGreenBtn = {
    backgroundColor: "#90EE90",
    border: "none",
    color: "black",
    fontWeight: 600,
    width: "120px",
  };

  const actionBtn = {
    width: "120px",
    fontWeight: 600,
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
        <Container>
          <Navbar.Brand className="fw-bold text-primary fs-4">
            Research Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/allprojects">Projects</Nav.Link>
              <Nav.Link as={Link} to="/manage-members">Manage Members</Nav.Link>
            </Nav>

            <Nav>
              <Navbar.Text className="me-3 text-dark fw-semibold">
                {user?.username} ({user?.role})
              </Navbar.Text>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* FORM SECTION */}
        <Card className="shadow-sm mb-4 border-0">
          <Card.Body>
            <h4 className="fw-bold mb-3 text-primary">
              {form.id ? "Edit Project" : "Add New Project"}
            </h4>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Control
                    name="title"
                    placeholder="Project Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={4}>
                  <Form.Control
                    name="summary"
                    placeholder="Summary"
                    value={form.summary}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={4}>
                  <Form.Select name="status" value={form.status} onChange={handleChange}>
                    <option value="PLANNING">PLANNING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </Form.Select>
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-semibold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={12}>
                  <Form.Label className="fw-semibold">Assign Users</Form.Label>
                  <Select
                    isMulti
                    options={users}
                    value={assignedUsers}
                    onChange={(val: any) => setAssignedUsers(val)}
                  />
                </Col>

                <Col xs={12}>
                  <Button type="submit" variant="primary" className="w-100 py-2">
                    {form.id ? "Update Project" : "Add Project"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* PROJECT TABLE */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4 className="fw-bold text-primary mb-3">Project List</h4>

            {loading ? (
              <div className="text-center my-3">
                <Spinner animation="border" />
              </div>
            ) : projects.length === 0 ? (
              <p>No projects available.</p>
            ) : (
              <Table bordered hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Summary</th>
                    <th>Status</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Assigned</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.title}</td>
                      <td>{p.summary}</td>
                      <td>{p.status}</td>
                      <td>{p.startDate}</td>
                      <td>{p.endDate}</td>
                      <td>{(p.assignedUsers || []).join(", ")}</td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">

                          <Button
                            style={lightGreenBtn}
                            size="sm"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </Button>

                          <Button
                            style={lightGreenBtn}
                            size="sm"
                            onClick={() => navigate(`/projects/${p.id}/milestones`)}
                          >
                            Milestones
                          </Button>

                          <Button
                            style={lightGreenBtn}
                            size="sm"
                            onClick={() => navigate(`/projects/${p.id}/documents`)}
                          >
                            Documents
                          </Button>

                          <Button
                            style={actionBtn}
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminDashboard;

