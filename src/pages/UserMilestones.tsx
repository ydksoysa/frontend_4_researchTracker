import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Form,
  Card,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

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

const UserMilestones: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchMilestones = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${projectId}/milestones`);
      setMilestones(res.data);
    } catch {
      setError("Failed to load milestones");
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${projectId}/files`);
      setProjectFiles(res.data);
    } catch {
      setError("Failed to load project files");
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchFiles();
  }, [projectId]);

  const updateStatus = async (id: number, completed: boolean) => {
    try {
      await axiosInstance.put(`/api/milestones/${id}/status`, { completed });
      setMessage("Milestone status updated");
      fetchMilestones();
    } catch {
      setError("Failed to update status");
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("uploadedBy", user.username || "Unknown");

    setUploading(true);
    try {
      await axiosInstance.post(`/api/projects/${projectId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File uploaded successfully!");
      fetchFiles();
      setSelectedFile(null);

      const fileInput: any = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.response?.data || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Light green button
  const lightGreen = {
    backgroundColor: "#90EE90",
    border: "none",
    color: "#000",
    fontWeight: 600,
  };

  return (
    <Container className="mt-4">
      {/* Back Button */}
      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => navigate("/user")}
      >
        ← Back 
      </Button>

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
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Row>
        {/* Milestones Section */}
        <Col md={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h4 className="fw-bold text-primary">My Milestones</h4>
              <p className="text-muted mb-3">
                Track your project progress and mark milestones as completed.
              </p>

              <Table bordered hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Milestone</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.title}</strong>
                        <br />
                        <span className="text-muted small">
                          {m.description}
                        </span>
                      </td>

                      <td>{m.dueDate}</td>

                      <td>
                        {m.completed ? (
                          <Badge bg="success">Completed</Badge>
                        ) : (
                          <Badge bg="warning" text="dark">
                            Pending
                          </Badge>
                        )}
                      </td>

                      <td className="text-center">
                        <Button
                          size="sm"
                          style={lightGreen}
                          onClick={() => updateStatus(m.id!, !m.completed)}
                        >
                          {m.completed ? "Mark Pending" : "Mark Done"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* File Upload Section */}
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h4 className="fw-bold text-primary">Final Project Upload</h4>
              <p className="text-muted mb-3">
                Upload final documents, reports, or deliverables.
              </p>

              <Form onSubmit={handleFileUpload}>
                <Form.Control
                  id="fileInput"
                  type="file"
                  className="mb-3"
                  onChange={(e) =>
                    setSelectedFile(
                      (e.target as HTMLInputElement).files?.[0] || null
                    )
                  }
                  required
                  disabled={uploading}
                />

                <Button
                  type="submit"
                  style={lightGreen}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
              </Form>

              <hr />

              <h5 className="fw-bold mt-3">Uploaded Files</h5>

              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                <Table bordered hover responsive className="mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>File</th>
                      <th>By</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectFiles.length > 0 ? (
                      projectFiles.map((f) => (
                        <tr key={f.id}>
                          <td>{f.fileName}</td>
                          <td>{f.uploadedBy}</td>
                          <td>
                            <Button
                              size="sm"
                              style={lightGreen}
                              onClick={() =>
                                handleDownload(f.fileUrl!, f.fileName)
                              }
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No files uploaded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserMilestones;




