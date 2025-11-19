

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, Alert, Card } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface Document {
  id?: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

const DocumentDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch all documents for this project
  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/${projectId}/documents`);
      console.log("Fetched documents:", res.data);
      setDocuments(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDocuments();
    }
  }, [projectId]);

  // ✅ Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axiosInstance.post(
        `/api/projects/${projectId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload response:", response.data);
      setMessage("✅ File uploaded successfully!");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("formFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      await fetchDocuments();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle delete (ADMIN only)
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axiosInstance.delete(`/api/documents/${id}`);
      setMessage("🗑️ Document deleted successfully.");
      setError("");
      await fetchDocuments();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.response?.data || "Failed to delete document.");
    }
  };

  // ✅ Handle download
  const handleDownload = (fileUrl: string, fileName: string) => {
    // Open in new tab or download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* ✅ Upload Form */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4>Upload Document</h4>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)}
                disabled={uploading}
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* ✅ Documents Table */}
      <Card>
        <Card.Body>
          <h4>Documents</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Uploaded At</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.fileName}</td>
                    <td>{d.fileType}</td>
                    <td>{new Date(d.uploadedAt).toLocaleString()}</td>
                    <td>{d.uploadedBy}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        className="me-2"
                        onClick={() => handleDownload(d.fileUrl, d.fileName)}
                      >
                        Download
                      </Button>
                      {/* ✅ Only show Delete for Admin */}
                      {user?.role === "ADMIN" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(d.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No documents found.
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

export default DocumentDashboard;
