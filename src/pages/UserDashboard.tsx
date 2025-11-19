/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface Project {
  id?: number;
  title: string;
  summary: string;
  status: string;
  startDate: string;
  endDate: string;
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get(`/api/projects/user/${user?.username}`);
        setProjects(res.data || []);
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) fetchProjects();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container style={{ paddingTop: "20px", paddingBottom: "40px" }}>
      <Card
        className="mb-4 shadow-sm text-white"
        style={{
          padding: "25px",
          background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
          borderRadius: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700 }}>User Dashboard</h2>
            <small style={{ opacity: 0.9 }}>
              Welcome, <strong>{user?.username}</strong> ({user?.role})
            </small>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <Button variant="light" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3 className="mb-3" style={{ color: "#1e293b" }}>
        My Assigned Projects
      </h3>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : projects.length === 0 ? (
        <Alert variant="info">No assigned projects available.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {projects.map((p) => (
            <Col key={p.id}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px" }}>
                <Card.Body>
                  <h5 style={{ fontWeight: 700 }}>{p.title}</h5>
                  <p style={{ fontSize: "14px", color: "#475569" }}>{p.summary}</p>

                  <div className="mb-2">
                    <strong>Status:</strong> {p.status}
                  </div>

                  <small className="text-muted">
                    {p.startDate} → {p.endDate}
                  </small>

                 <div className="mt-3 d-flex gap-2">
  <Button
    size="sm"
    style={{
      backgroundColor: "#1e3a8a",
      borderColor: "#1e3a8a",
      color: "white",
    }}
    onClick={() => navigate(`/user/projects/${p.id}/milestones`)}
  >
    Milestones
  </Button>

  <Button
    size="sm"
    style={{
      backgroundColor: "#1e3a8a",
      borderColor: "#1e3a8a",
      color: "white",
    }}
    onClick={() => navigate(`/user/projects/${p.id}/documents`)}
  >
    Documents
  </Button>
</div>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default UserDashboard;*/


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Table, Button, Alert, Spinner, Badge, Row, Col } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface Project {
  id?: number;
  title: string;
  summary: string;
  status: string;
  startDate: string;
  endDate: string;
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get(`/api/projects/user/${user?.username}`);
        setProjects(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.username) fetchProjects();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "success";
      case "in progress": return "primary";
      case "pending": return "warning";
      case "on hold": return "secondary";
      default: return "info";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Container fluid style={{ padding: "20px 40px", maxWidth: "1400px" }}>
      {/* Top Bar */}
      <Card className="mb-4 shadow-sm border-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center text-white">
          <div>
            <h2 className="mb-1" style={{ fontWeight: 600 }}>Research Tracker</h2>
            <small>
              Welcome back, <strong>{user?.username}</strong>
              <Badge bg="light" text="dark" className="ms-2">{user?.role}</Badge>
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={() => navigate("/user/chat")}>💬 Chat with PI</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Overview */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted mb-1">Total Projects</h6>
                <h2 style={{ color: "#667eea", fontWeight: 700 }}>{projects.length}</h2>
              </div>
              <div style={{ fontSize: "40px", opacity: 0.3 }}>📊</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted mb-1">In Progress</h6>
                <h2 style={{ color: "#10b981", fontWeight: 700 }}>{projects.filter(p => p.status.toLowerCase() === "in progress").length}</h2>
              </div>
              <div style={{ fontSize: "40px", opacity: 0.3 }}>🚀</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted mb-1">Completed</h6>
                <h2 style={{ color: "#f59e0b", fontWeight: 700 }}>{projects.filter(p => p.status.toLowerCase() === "completed").length}</h2>
              </div>
              <div style={{ fontSize: "40px", opacity: 0.3 }}>✅</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      {/* Projects Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h3 className="mb-0">My Assigned Projects</h3>
          <Badge bg="secondary">{projects.length} {projects.length === 1 ? "Project" : "Projects"}</Badge>
        </Card.Header>

        {loading ? (
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-muted">Loading your projects...</p>
          </Card.Body>
        ) : projects.length === 0 ? (
          <Card.Body className="text-center py-5">
            <div style={{ fontSize: "60px", marginBottom: "20px", opacity: 0.3 }}>📁</div>
            <h4 className="text-muted">No Projects Assigned</h4>
            <p className="text-muted mb-0">You don't have any projects assigned yet. Contact your PI for assignments.</p>
          </Card.Body>
        ) : (
          <Card.Body className="p-0">
            <div style={{ overflowX: "auto" }}>
              <Table hover responsive className="mb-0">
                <thead className="bg-light" style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Summary</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td><Badge bg="light" text="dark">#{project.id}</Badge></td>
                      <td style={{ fontWeight: 500 }}>{project.title}</td>
                      <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#64748b" }}>
                        {project.summary}
                      </td>
                      <td><Badge bg={getStatusBadge(project.status)} style={{ fontSize: "12px", padding: "6px 12px" }}>{project.status}</Badge></td>
                      <td style={{ color: "#64748b" }}>{formatDate(project.startDate)}</td>
                      <td style={{ color: "#64748b" }}>{formatDate(project.endDate)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 flex-wrap justify-content-center">
                          <Button variant="outline-primary" size="sm" onClick={() => navigate(`/user/projects/${project.id}/milestones`)}>
                            📋 Milestones
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => navigate(`/user/projects/${project.id}/documents`)}>
                            📄 Documents
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Quick Actions */}
      {projects.length > 0 && (
        <Card className="mt-4 shadow-sm border-0" style={{ background: "#f8fafc" }}>
          <Card.Body className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => navigate("/user/chat")}>💬 Message PI</Button>
            <Button variant="outline-secondary" onClick={() => window.location.reload()}>🔄 Refresh Projects</Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserDashboard;



