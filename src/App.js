// src/App.js - FINAL CHECK

import React from 'react';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import TimetableManagement from './components/TimetableManagement'; // << MUST BE IMPORTED
import AttendanceManagement from './components/AttendanceManagement';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>School Admin Portal</h1>
      </header>
      <main className="main-content">
        <StudentManagement />
        <hr className="section-divider" />
        <TeacherManagement />
        <hr className="section-divider" />
        <TimetableManagement /> {/* << MUST BE HERE */}
        <hr className="section-divider" />
        <AttendanceManagement />
      </main>
    </div>
  );
}

export default App;