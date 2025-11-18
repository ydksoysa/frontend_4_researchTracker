import React, { useEffect, useState } from "react";
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
      {/* Top Bar */}
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

export default UserDashboard;



