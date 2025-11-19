/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

const ProtectedRoute: React.FC<{ children: JSX.Element; role?: string }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : user.role === "ADMIN" ? <Navigate to="/admin" /> : <Navigate to="/user" />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/  

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard"; // ✅ Added import

// ✅ Protected route wrapper
const ProtectedRoute: React.FC<{ children: JSX.Element; role?: string }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ✅ Login and Register routes *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* ✅ Admin Dashboard *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ User Dashboard *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Milestone Dashboard (for specific project) *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute role="ADMIN">
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/   

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard"; // ✅ Added import

// ✅ Protected route wrapper
const ProtectedRoute: React.FC<{ children: JSX.Element; role?: string }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login and Register *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Milestones *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute>
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />

      {/* Documents *//*}
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute>
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/  

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard";
import UserMilestones from "./pages/UserMilestones";   // ✅ User view milestones
import UserDocuments from "./pages/UserDocuments";     // ✅ User view documents

// ✅ Protected route wrapper
const ProtectedRoute: React.FC<{ children: JSX.Element; role?: string }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login and Register *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin: Milestones & Documents (full control) *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute role="ADMIN">
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute role="ADMIN">
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* User: Milestones & Documents (read-only) *//*}
      <Route
        path="/user/projects/:projectId/milestones"
        element={
          <ProtectedRoute role="MEMBER">
            <UserMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/documents"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDocuments />
          </ProtectedRoute>
        }
      />

      {/* Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/  

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard";
import UserMilestones from "./pages/UserMilestones";
import UserDocuments from "./pages/UserDocuments";
import AllProjects from "./pages/AllProjects"; // ✅ Added AllProjects import

// ✅ Protected route wrapper
const ProtectedRoute: React.FC<{ children: JSX.Element; role?: string }> = ({
  children,
  role,
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login and Register *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ All Projects Page (Accessible to Admins) *//*}
      <Route
        path="/allprojects"
        element={
          <ProtectedRoute role="ADMIN">
            <AllProjects />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin: Milestones & Documents *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute role="ADMIN">
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute role="ADMIN">
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* User: Milestones & Documents (Read-Only) *//*}
      <Route
        path="/user/projects/:projectId/milestones"
        element={
          <ProtectedRoute role="MEMBER">
            <UserMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/documents"
        element={
          <ProtectedRoute role="MEMBER">
            <UserDocuments />
          </ProtectedRoute>
        }
      />

      {/* Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/  

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard";
import UserMilestones from "./pages/UserMilestones";
import UserDocuments from "./pages/UserDocuments";
import AllProjects from "./pages/AllProjects";

// ✅ Updated Protected route wrapper to support multiple roles
const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  // If roles are specified, check if user's role is in the allowed list
  if (roles && roles.length > 0) {
    if (!user.role || !roles.includes(user.role)) {
      // Redirect based on user's actual role
      if (user.role === "ADMIN") return <Navigate to="/admin" />;
      if (user.role === "PI") return <Navigate to="/allprojects" />;
      if (user.role === "MEMBER") return <Navigate to="/user" />;
      return <Navigate to="/login" />;
    }
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login and Register *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : user.role === "PI" ? (
            <Navigate to="/allprojects" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard - ADMIN only *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ All Projects Page - Accessible to ADMIN and PI *//*}
      <Route
        path="/allprojects"
        element={
          <ProtectedRoute roles={["ADMIN", "PI"]}>
            <AllProjects />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard - MEMBER only *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin: Milestones & Documents - ADMIN only *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* User: Milestones & Documents (Read-Only) - MEMBER only *//*}
      <Route
        path="/user/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDocuments />
          </ProtectedRoute>
        }
      />

      {/* Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/  








/*


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard";
import UserMilestones from "./pages/UserMilestones";
import UserDocuments from "./pages/UserDocuments";
import AllProjects from "./pages/AllProjects";
import ManageMembers from "./pages/ManageMembers"; // ✅ NEW IMPORT

// ✅ Updated Protected route wrapper to support multiple roles
const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  // If roles are specified, check if user's role is in the allowed list
  if (roles && roles.length > 0) {
    if (!user.role || !roles.includes(user.role)) {
      // Redirect based on user's actual role
      if (user.role === "ADMIN") return <Navigate to="/admin" />;
      if (user.role === "PI") return <Navigate to="/allprojects" />;
      if (user.role === "MEMBER") return <Navigate to="/user" />;
      return <Navigate to="/login" />;
    }
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login and Register *//*}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : user.role === "PI" ? (
            <Navigate to="/allprojects" />
          ) : (
            <Navigate to="/user" />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard - ADMIN only *//*}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW: Manage Members Page - ADMIN only *//*}
      <Route
        path="/manage-members"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <ManageMembers />
          </ProtectedRoute>
        }
      />

      {/* ✅ All Projects Page - Accessible to ADMIN and PI *//*}
      <Route
        path="/allprojects"
        element={
          <ProtectedRoute roles={["ADMIN", "PI"]}>
            <AllProjects />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard - MEMBER only *//*}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin: Milestones & Documents - ADMIN only *//*}
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* User: Milestones & Documents (Read-Only) - MEMBER only *//*}
      <Route
        path="/user/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDocuments />
          </ProtectedRoute>
        }
      />

      {/* Default fallback *//*}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// ✅ Main App component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;*/

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import MilestoneDashboard from "./pages/MilestoneDashboard";
import DocumentDashboard from "./pages/DocumentDashboard";
import UserMilestones from "./pages/UserMilestones";
import UserDocuments from "./pages/UserDocuments";
import AllProjects from "./pages/AllProjects";
import ManageMembers from "./pages/ManageMembers";
import UserChat from "./pages/UserChat";
import PIChat from "./pages/PIChat";

// Protected route wrapper component to support multiple roles
const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user's role is in the allowed list
  if (roles && roles.length > 0) {
    if (!user.role || !roles.includes(user.role)) {
      // Redirect based on user's actual role
      if (user.role === "ADMIN") {
        return <Navigate to="/admin" replace />;
      }
      if (user.role === "PI") {
        return <Navigate to="/allprojects" replace />;
      }
      if (user.role === "MEMBER") {
        return <Navigate to="/user" replace />;
      }
      // Fallback to login if role is unrecognized
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

// App routes component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES - Login and Register
          ======================================== */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : user.role === "PI" ? (
            <Navigate to="/allprojects" replace />
          ) : (
            <Navigate to="/user" replace />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/login" replace />}
      />

      {/* ========================================
          ADMIN ROUTES - Only accessible by ADMIN
          ======================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-members"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <ManageMembers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MilestoneDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DocumentDashboard />
          </ProtectedRoute>
        }
      />

      {/* ========================================
          PI ROUTES - Accessible by ADMIN and PI
          ======================================== */}
      <Route
        path="/allprojects"
        element={
          <ProtectedRoute roles={["ADMIN", "PI"]}>
            <AllProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pi/chat"
        element={
          <ProtectedRoute roles={["ADMIN", "PI"]}>
            <PIChat />
          </ProtectedRoute>
        }
      />

      {/* ========================================
          MEMBER ROUTES - Only accessible by MEMBER
          ======================================== */}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/chat"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/milestones"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/projects/:projectId/documents"
        element={
          <ProtectedRoute roles={["MEMBER"]}>
            <UserDocuments />
          </ProtectedRoute>
        }
      />

      {/* ========================================
          DEFAULT ROUTES - Redirects and Fallbacks
          ======================================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App component with AuthProvider and Router
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;




