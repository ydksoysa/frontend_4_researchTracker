import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProjectsPlaceholder: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{padding:24}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1>Projects</h1>
        <div>
          <span style={{marginRight:12}}>{user?.username} ({user?.role})</span>
          <button onClick={logout} style={{padding:'6px 10px'}}>Logout</button>
        </div>
      </header>
      <div>
        <p>This is a placeholder Projects page. Replace with project list UI that calls the backend.</p>
      </div>
    </div>
  );
};

export default ProjectsPlaceholder;
