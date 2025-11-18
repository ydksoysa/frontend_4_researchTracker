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
  Modal,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface User {
  id?: number;
  username: string;
  role: string;
  createdAt?: string;
}

const ManageMembers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<User>({
    username: "",
    role: "MEMBER",
  });
  const [password, setPassword] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Enforce admin-only access
  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for adding new user
  const handleAddNew = () => {
    setForm({ username: "", role: "MEMBER" });
    setPassword("");
    setShowModal(true);
  };

  // Open modal for editing user
  const handleEdit = (u: User) => {
    setForm(u);
    setPassword("");
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ username: "", role: "MEMBER" });
    setPassword("");
  };

  // Submit (add/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (form.id) {
        // Update user (without password change in this example)
        await axiosInstance.put(`/api/users/${form.id}`, {
          username: form.username,
          role: form.role,
        });
        setMessage("✅ User updated successfully!");
      } else {
        // Add new user - Updated route to match backend
        if (!password) {
          setError("Password is required for new users.");
          return;
        }
        await axiosInstance.post("/auth/signup", {
          username: form.username,
          password: password,
          role: form.role,
        });
        setMessage("✅ User added successfully!");
      }

      handleCloseModal();
      fetchUsers();
    } catch (err: any) {
      console.error("Error saving user:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to save user.";
      setError(errMsg);
    }
  };

  // Delete user
  const handleDelete = async (id?: number, username?: string) => {
    if (!id) return;
    
    // Prevent deleting yourself
    if (username === user?.username) {
      setError("❌ You cannot delete your own account!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${username}"?`))
      return;

    try {
      await axiosInstance.delete(`/api/users/${id}`);
      setMessage("🗑️ User deleted successfully.");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get badge color based on role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge bg="danger">Admin</Badge>;
      case "PI":
        return <Badge bg="primary">PI</Badge>;
      case "MEMBER":
        return <Badge bg="success">Member</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Research Tracker (Admin)</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/allprojects">
                Projects
              </Nav.Link>
              <Nav.Link as={Link} to="/manage-members" active>
                Manage Members
              </Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
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
        {message && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Header with Add Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Members</h2>
          <Button variant="primary" onClick={handleAddNew}>
            + Add New Member
          </Button>
        </div>

        {/* Users Table */}
        <Card className="shadow-sm">
          <Card.Body>
            {loading ? (
              <div className="text-center my-3">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : users.length === 0 ? (
              <p>No users available.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={u.username === user?.username}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Add/Edit User Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {form.id ? "Edit User" : "Add New Member"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  disabled={!!form.id} // Disable username editing
                />
              </Form.Group>

              {!form.id && (
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="MEMBER">Member</option>
                  <option value="PI">PI</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {form.id ? "Update User" : "Add User"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default ManageMembers;