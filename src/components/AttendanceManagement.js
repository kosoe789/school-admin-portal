// src/components/AttendanceManagement.js - FINAL WORKING VERSION

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Management.css';

const API_URL = 'https://school-backend-c8gj.onrender.com/api';

const AttendanceManagement = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [selectedGrade, setSelectedGrade] = useState('Grade 1');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

    // Fetch students when grade changes
    useEffect(() => {
        if (selectedGrade) {
            fetchStudentsByGrade(selectedGrade);
        }
    }, [selectedGrade]);

    // Fetch existing attendance records when students or date change
    useEffect(() => {
        if (students.length > 0 && selectedDate) {
            fetchAttendanceRecords();
        }
    }, [students, selectedDate]);

    const fetchStudentsByGrade = async (grade) => {
        try {
            const response = await axios.get(`${API_URL}/students?grade=${grade}`);
            setStudents(response.data);
        } catch (err) {
            setError('Failed to fetch students for this grade.');
            setStudents([]);
        }
    };

    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${API_URL}/attendance?grade=${selectedGrade}&date=${selectedDate}`);
            const records = response.data;
            const attendanceMap = {};
            records.forEach(record => {
                // Ensure studentId is an object and has _id
                if (record.studentId && record.studentId._id) {
                    attendanceMap[record.studentId._id] = record.status;
                }
            });
            // Set default for students who don't have a record yet
            students.forEach(student => {
                if (!attendanceMap[student._id]) {
                    attendanceMap[student._id] = 'Present';
                }
            });
            setAttendance(attendanceMap);
        } catch (err) {
            // If fetching fails, just default everyone to 'Present'
            const defaultAttendance = {};
            students.forEach(student => {
                defaultAttendance[student._id] = 'Present';
            });
            setAttendance(defaultAttendance);
        }
    };

    // This function now saves the record for a SINGLE student immediately upon change.
    const handleStatusChange = async (studentId, newStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: newStatus }));
        setError('');
        setSuccess('');

        const payload = {
            date: selectedDate,
            grade: selectedGrade,
            studentId: studentId,
            status: newStatus,
        };

        try {
            await axios.post(`${API_URL}/attendance`, payload);
            setSuccess(`Record for student ${studentId} updated.`); // Give feedback
        } catch (err) {
            setError(`Failed to save record for student ${studentId}.`);
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Attendance Management</h2>
            <div className="form-container" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div>
                    <label htmlFor="grade-select">Select Grade:</label>
                    <select id="grade-select" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date-select">Select Date:</label>
                    <input
                        type="date"
                        id="date-select"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="list-container">
                <h3>Record Attendance for {selectedGrade} on {selectedDate}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.studentId}</td>
                                    <td>
                                        <select
                                            value={attendance[student._id] || 'Present'}
                                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                            <option value="Leave">Leave</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No students found for this grade.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* The main save button is no longer needed as changes are saved instantly */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default AttendanceManagement;
