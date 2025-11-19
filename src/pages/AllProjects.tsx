/*

import React, { useEffect, useState } from "react";
import { Container, Table, Button, Navbar, Nav, Spinner, Alert, Card, Badge } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
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

interface ProjectFile {
  id: number;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
  projectId: number;
  projectTitle?: string;
}

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjectFiles, setAllProjectFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProjects(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
      return [];
    }
  };

  const fetchAllProjectFiles = async (projectsList: Project[]) => {
    try {
      // Fetch files for all projects
      const filesPromises = projectsList.map(async (project) => {
        try {
          const res = await axiosInstance.get(`/api/projects/${project.id}/files`);
          return res.data.map((file: any) => ({
            ...file,
            projectId: project.id,
            projectTitle: project.title,
          }));
        } catch (err) {
          console.error(`Error fetching files for project ${project.id}:`, err);
          return [];
        }
      });

      const filesArrays = await Promise.all(filesPromises);
      const flattenedFiles = filesArrays.flat();
      setAllProjectFiles(flattenedFiles);
    } catch (err) {
      console.error("Error fetching project files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const projectsList = await fetchProjects();
      await fetchAllProjectFiles(projectsList);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Handle file download
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group files by project
  const getFilesForProject = (projectId?: number) => {
    return allProjectFiles.filter((file) => file.projectId === projectId);
  };

  return (
    <>
      {/* Navbar *//*}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>All Projects</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* ✅ Only show Admin Dashboard link if user is ADMIN *//*}
              {user?.role === 'ADMIN' && (
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              )}
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                {user?.username} ({user?.role})
              </Navbar.Text>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {/* Projects Table *//*}
            <Card className="mb-4">
              <Card.Header>
                <h4>Projects Overview</h4>
              </Card.Header>
              <Card.Body>
                {projects.length === 0 ? (
                  <p>No projects available.</p>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Assigned Users</th>
                        <th>Submitted Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => {
                        const filesCount = getFilesForProject(p.id).length;
                        return (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.title}</td>
                            <td>{p.summary}</td>
                            <td>
                              <Badge bg={p.status === "COMPLETED" ? "success" : "warning"}>
                                {p.status}
                              </Badge>
                            </td>
                            <td>{p.startDate}</td>
                            <td>{p.endDate}</td>
                            <td>{(p.assignedUsers || []).join(", ")}</td>
                            <td>
                              <Badge bg={filesCount > 0 ? "primary" : "secondary"}>
                                {filesCount} file{filesCount !== 1 ? "s" : ""}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* All Submitted Project Files *//*}
            <Card>
              <Card.Header>
                <h4>All Submitted Project Files</h4>
              </Card.Header>
              <Card.Body>
                {allProjectFiles.length === 0 ? (
                  <Alert variant="info">No project files have been submitted yet.</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>File Name</th>
                        <th>Uploaded By</th>
                        <th>Uploaded At</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProjectFiles.map((file) => (
                        <tr key={file.id}>
                          <td>
                            <strong>{file.projectTitle}</strong>
                            <br />
                            <small className="text-muted">ID: {file.projectId}</small>
                          </td>
                          <td>{file.fileName}</td>
                          <td>{file.uploadedBy}</td>
                          <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleDownload(file.fileUrl, file.fileName)}
                            >
                              📥 Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* Files Grouped by Project *//*}
            <Card className="mt-4">
              <Card.Header>
                <h4>Files by Project</h4>
              </Card.Header>
              <Card.Body>
                {projects.map((project) => {
                  const projectFiles = getFilesForProject(project.id);
                  if (projectFiles.length === 0) return null;

                  return (
                    <div key={project.id} className="mb-4">
                      <h5>
                        {project.title} 
                        <Badge bg="primary" className="ms-2">
                          {projectFiles.length} file{projectFiles.length !== 1 ? "s" : ""}
                        </Badge>
                      </h5>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Uploaded By</th>
                            <th>Uploaded At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectFiles.map((file) => (
                            <tr key={file.id}>
                              <td>{file.fileName}</td>
                              <td>{file.uploadedBy}</td>
                              <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleDownload(file.fileUrl, file.fileName)}
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default AllProjects;*/


import React, { useEffect, useState } from "react";
import { Container, Table, Button, Navbar, Nav, Spinner, Alert, Card, Badge } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
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

interface ProjectFile {
  id: number;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
  projectId: number;
  projectTitle?: string;
}

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjectFiles, setAllProjectFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProjects(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
      return [];
    }
  };

  const fetchAllProjectFiles = async (projectsList: Project[]) => {
    try {
      // Fetch files for all projects
      const filesPromises = projectsList.map(async (project) => {
        try {
          const res = await axiosInstance.get(`/api/projects/${project.id}/files`);
          return res.data.map((file: any) => ({
            ...file,
            projectId: project.id,
            projectTitle: project.title,
          }));
        } catch (err) {
          console.error(`Error fetching files for project ${project.id}:`, err);
          return [];
        }
      });

      const filesArrays = await Promise.all(filesPromises);
      const flattenedFiles = filesArrays.flat();
      setAllProjectFiles(flattenedFiles);
    } catch (err) {
      console.error("Error fetching project files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const projectsList = await fetchProjects();
      await fetchAllProjectFiles(projectsList);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Handle file download
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group files by project
  const getFilesForProject = (projectId?: number) => {
    return allProjectFiles.filter((file) => file.projectId === projectId);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>All Projects</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* ✅ Only show Admin Dashboard link if user is ADMIN */}
              {user?.role === 'ADMIN' && (
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              )}
              {/* ✅ NEW: Chat link for PI */}
              {user?.role === 'PI' && (
                <Nav.Link as={Link} to="/pi/chat">Chat</Nav.Link>
              )}
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                {user?.username} ({user?.role})
              </Navbar.Text>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {/* Projects Table */}
            <Card className="mb-4">
              <Card.Header>
                <h4>Projects Overview</h4>
              </Card.Header>
              <Card.Body>
                {projects.length === 0 ? (
                  <p>No projects available.</p>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Assigned Users</th>
                        <th>Submitted Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => {
                        const filesCount = getFilesForProject(p.id).length;
                        return (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.title}</td>
                            <td>{p.summary}</td>
                            <td>
                              <Badge bg={p.status === "COMPLETED" ? "success" : "warning"}>
                                {p.status}
                              </Badge>
                            </td>
                            <td>{p.startDate}</td>
                            <td>{p.endDate}</td>
                            <td>{(p.assignedUsers || []).join(", ")}</td>
                            <td>
                              <Badge bg={filesCount > 0 ? "primary" : "secondary"}>
                                {filesCount} file{filesCount !== 1 ? "s" : ""}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* All Submitted Project Files */}
            <Card>
              <Card.Header>
                <h4>All Submitted Project Files</h4>
              </Card.Header>
              <Card.Body>
                {allProjectFiles.length === 0 ? (
                  <Alert variant="info">No project files have been submitted yet.</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>File Name</th>
                        <th>Uploaded By</th>
                        <th>Uploaded At</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProjectFiles.map((file) => (
                        <tr key={file.id}>
                          <td>
                            <strong>{file.projectTitle}</strong>
                            <br />
                            <small className="text-muted">ID: {file.projectId}</small>
                          </td>
                          <td>{file.fileName}</td>
                          <td>{file.uploadedBy}</td>
                          <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleDownload(file.fileUrl, file.fileName)}
                            >
                              📥 Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* Files Grouped by Project */}
            <Card className="mt-4">
              <Card.Header>
                <h4>Files by Project</h4>
              </Card.Header>
              <Card.Body>
                {projects.map((project) => {
                  const projectFiles = getFilesForProject(project.id);
                  if (projectFiles.length === 0) return null;

                  return (
                    <div key={project.id} className="mb-4">
                      <h5>
                        {project.title} 
                        <Badge bg="primary" className="ms-2">
                          {projectFiles.length} file{projectFiles.length !== 1 ? "s" : ""}
                        </Badge>
                      </h5>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Uploaded By</th>
                            <th>Uploaded At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectFiles.map((file) => (
                            <tr key={file.id}>
                              <td>{file.fileName}</td>
                              <td>{file.uploadedBy}</td>
                              <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleDownload(file.fileUrl, file.fileName)}
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default AllProjects;