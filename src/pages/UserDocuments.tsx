import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { Download, FileText, ArrowLeft } from "react-bootstrap-icons";
import axiosInstance from "../api/axiosInstance";

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
}

const UserDocuments: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axiosInstance.get(`/api/projects/${projectId}/documents`);
        console.log("Fetched documents:", res.data);
        setDocuments(res.data || []);
        setError("");
      } catch (err: any) {
        console.error("Error fetching documents:", err);
        setError(err.response?.data?.message || "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchDocuments();
  }, [projectId]);

  // Download handler
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container style={{ paddingTop: "25px", maxWidth: "900px" }}>
      {/* Back Button */}
      <Button
        variant="light"
        className="mb-3 shadow-sm"
        onClick={() => navigate("/user")}
        style={{ borderRadius: "8px" }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </Button>

      <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <h2 className="fw-bold" style={{ color: "#144272" }}>
                📁 Project Documents
              </h2>
              <p className="text-muted">View and download all submitted documents.</p>
            </Col>
          </Row>

          {/* Loading State */}
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2 text-muted">Loading documents...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && <Alert variant="danger">{error}</Alert>}

          {/* Empty State */}
          {!loading && !error && documents.length === 0 && (
            <Alert
              variant="info"
              className="text-center"
              style={{ borderRadius: "10px" }}
            >
              No documents available.
            </Alert>
          )}

          {/* Documents Table */}
          {!loading && !error && documents.length > 0 && (
            <Table bordered hover responsive className="mt-3 shadow-sm">
              <thead style={{ backgroundColor: "#E8F5E9" }}>
                <tr>
                  <th>ID</th>
                  <th>Document</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td className="fw-semibold">
                      <FileText className="me-2 text-primary" />
                      {d.fileName}
                      <Badge bg="secondary" className="ms-2">
                        {d.fileType}
                      </Badge>
                    </td>
                    <td>{d.uploadedBy}</td>
                    <td>{new Date(d.uploadedAt).toLocaleString()}</td>
                    <td>
                      <Button
                        size="sm"
                        className="w-100"
                        style={{
                          backgroundColor: "#81C784",
                          border: "none",
                          borderRadius: "6px",
                        }}
                        onClick={() => handleDownload(d.fileUrl, d.fileName)}
                      >
                        <Download size={16} className="me-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDocuments;
