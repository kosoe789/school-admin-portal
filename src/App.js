// src/App.js

import React from 'react';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import TimetableManagement from './components/TimetableManagement';
import AttendanceManagement from './components/AttendanceManagement';
import GradeManagement from './components/GradeManagement'; // <-- အသစ်ထည့်ရန်
import AnnouncementManagement from './components/AnnouncementManagement'; // <-- အသစ်ထည့်ရန်
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
        <TimetableManagement />
        <hr className="section-divider" />
        <AttendanceManagement />
        <hr className="section-divider" /> {/* <-- အသစ်ထည့်ရန် */}
        <GradeManagement />                 {/* <-- အသစ်ထည့်ရန် */}
        <hr className="section-divider" /> {/* <-- အသစ်ထည့်ရန် */}
        <AnnouncementManagement />          {/* <-- အသစ်ထည့်ရန် */}
      </main>
    </div>
  );
}

export default App;
