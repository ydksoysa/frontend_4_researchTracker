import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Form,
  ListGroup,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../api/axiosInstance"; // ✅ Make sure this path is correct
import { useAuth } from "../context/AuthContext";

interface Message {
  id: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  receiverUsername: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Member {
  id: number;
  username: string;
  email: string;
}

const PIChat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/api/users/members");
        setMembers(res.data || []);
      } catch (err) {
        console.error("Error loading members:", err);
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Fetch messages with selected member
  useEffect(() => {
    if (selectedMember && user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // poll every 5s
      return () => clearInterval(interval);
    }
  }, [selectedMember, user]);

  const fetchMessages = async () => {
    if (!selectedMember || !user) return;

    try {
      const res = await axiosInstance.get(
        `/api/messages/conversation/${user.username}/${selectedMember.username}`
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMember || !user) return;

    setSending(true);
    try {
      await axiosInstance.post("/api/messages", {
        senderUsername: user.username,
        receiverUsername: selectedMember.username,
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
      <Card className="mb-4 p-3 bg-primary text-white shadow-sm">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Chat with Members</h2>
            <small>
              Welcome, <strong>{user?.username}</strong>
            </small>
          </div>
          <div>
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate("/allprojects")}
            >
              Back to Dashboard
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <div style={{ display: "flex", gap: 20, height: "calc(100vh - 250px)" }}>
        {/* Left Sidebar */}
        <Card style={{ width: 300, overflowY: "auto" }} className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Team Members</h5>
          </Card.Header>
          <ListGroup variant="flush">
            {loading ? (
              <div className="text-center p-3">
                <Spinner animation="border" size="sm" />
              </div>
            ) : members.length === 0 ? (
              <ListGroup.Item>No members available</ListGroup.Item>
            ) : (
              members.map((member) => (
                <ListGroup.Item
                  key={member.id}
                  action
                  active={selectedMember?.id === member.id}
                  onClick={() => setSelectedMember(member)}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <strong>{member.username}</strong>
                    <br />
                    <small className="text-muted">{member.email}</small>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>

        {/* Right Side - Chat Area */}
        <Card style={{ flex: 1, display: "flex", flexDirection: "column" }} className="shadow-sm">
          {selectedMember ? (
            <>
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  Chat with <Badge bg="primary">{selectedMember.username}</Badge>
                </h5>
              </Card.Header>

              <Card.Body
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 20,
                }}
              >
                {messages.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    No messages yet. Start the conversation!
                  </Alert>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf:
                          msg.senderUsername === user?.username ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                      }}
                    >
                      <Card
                        className={
                          msg.senderUsername === user?.username
                            ? "bg-primary text-white"
                            : "bg-light"
                        }
                      >
                        <Card.Body style={{ padding: "10px 15px" }}>
                          <div style={{ fontSize: 14 }}>{msg.content}</div>
                          <small
                            style={{
                              fontSize: 11,
                              opacity: 0.7,
                              display: "block",
                              marginTop: 5,
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleString()}
                          </small>
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                )}
              </Card.Body>

              <Card.Footer>
                <Form onSubmit={handleSendMessage}>
                  <div style={{ display: "flex", gap: 10 }}>
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
              <Alert variant="secondary">
                <h5>Select a member to start chatting</h5>
                <p className="mb-0">Choose a team member from the list on the left.</p>
              </Alert>
            </Card.Body>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default PIChat;