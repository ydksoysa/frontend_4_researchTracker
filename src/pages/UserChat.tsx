import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, ListGroup, Alert, Spinner, Badge } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: number;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface PI {
  id: number;
  username: string;
  role: string;
}

const UserChat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pis, setPis] = useState<PI[]>([]);
  const [selectedPI, setSelectedPI] = useState<PI | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Fetch all PIs
  useEffect(() => {
    const fetchPIs = async () => {
      try {
        const res = await axiosInstance.get("/api/users/pis");
        setPis(res.data || []);
      } catch (err) {
        console.error("Error loading PIs:", err);
        setError("Failed to load PIs.");
      } finally {
        setLoading(false);
      }
    };
    fetchPIs();
  }, []);

  // Fetch messages with selected PI
  useEffect(() => {
    if (selectedPI && user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // auto-refresh
      return () => clearInterval(interval);
    }
  }, [selectedPI, user]);

  const fetchMessages = async () => {
    if (!selectedPI || !user) return;
    try {
     const res = await axiosInstance.get(
  `/api/messages/conversation/${user.username}/${selectedPI.username}`
);

      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPI || !user) return;

    setSending(true);
    try {
      await axiosInstance.post("/api/messages", {
        senderUsername: user.username,
        receiverUsername: selectedPI.username,
        content: newMessage.trim(),
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container style={{ paddingTop: 20, paddingBottom: 40, maxWidth: 1200 }}>
      {/* Top Bar */}
      <Card className="mb-4 p-3 bg-primary text-white shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Chat with PI</h2>
            <small>Welcome, <strong>{user?.username}</strong></small>
          </div>
          <div>
            <Button variant="outline-light" className="me-2" onClick={() => navigate("/user")}>
              Dashboard
            </Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </Card>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      <div className="d-flex" style={{ gap: 20, height: "calc(100vh - 250px)" }}>
        {/* Sidebar - PIs */}
        <Card style={{ width: 300, overflowY: "auto" }} className="shadow-sm">
          <Card.Header className="bg-light"><h5>PIs</h5></Card.Header>
          <ListGroup variant="flush">
            {loading ? (
              <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>
            ) : pis.length === 0 ? (
              <ListGroup.Item>No PIs available</ListGroup.Item>
            ) : (
              pis.map((pi) => (
                <ListGroup.Item
                  key={pi.id}
                  action
                  active={selectedPI?.id === pi.id}
                  onClick={() => setSelectedPI(pi)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{pi.username}</strong>
                  <br /><small className="text-muted">{pi.role}</small>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 d-flex flex-column shadow-sm">
          {selectedPI ? (
            <>
              <Card.Header className="bg-light">
                <h5>Chat with <Badge bg="primary">{selectedPI.username}</Badge></h5>
              </Card.Header>
              <Card.Body style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: 20 }}>
                {messages.length === 0 ? (
                  <Alert variant="info" className="text-center">No messages yet.</Alert>
                ) : messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{ alignSelf: msg.senderUsername === user?.username ? "flex-end" : "flex-start", maxWidth: "70%" }}
                  >
                    <Card className={msg.senderUsername === user?.username ? "bg-primary text-white" : "bg-light"}>
                      <Card.Body style={{ padding: "10px 15px" }}>
                        <div style={{ fontSize: 14 }}>{msg.content}</div>
                        <small style={{ fontSize: 11, opacity: 0.7, display: "block", marginTop: 5 }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </small>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Card.Body>

              <Card.Footer>
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex" style={{ gap: 10 }}>
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <Button type="submit" variant="primary" disabled={sending || !newMessage.trim()}>
                      {sending ? <Spinner animation="border" size="sm" /> : "Send"}
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </>
          ) : (
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Alert variant="secondary">Select a PI to start chatting.</Alert>
            </Card.Body>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default UserChat;