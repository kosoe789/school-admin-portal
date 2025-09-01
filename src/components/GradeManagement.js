// src/components/GradeManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Management.css';

// သင့်ရဲ့ Backend URL အမှန်ကို သေချာစစ်ဆေးပါ
const API_URL = 'https://school-backend-c8gj.onrender.com/api';

const GradeManagement = () => {
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [subject, setSubject] = useState('');
    const [score, setScore] = useState('');
    const [examType, setExamType] = useState('Mid-term');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // ကျောင်းသားစာရင်းကို ဆွဲထုတ်ရန်
        axios.get(`${API_URL}/students`)
            .then(response => setStudents(response.data))
            .catch(err => setError('Failed to fetch students.'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !subject || !score) {
            setError('Please select a student, and enter subject and score.');
            return;
        }
        try {
            const newGrade = { student: selectedStudent, subject, score, examType };
            await axios.post(`${API_URL}/grades`, newGrade);
            setSuccess('Grade added successfully!');
            // Clear form
            setSelectedStudent(''); setSubject(''); setScore(''); setError('');
        } catch (err) {
            setError('Failed to add grade.');
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Grade Management</h2>
            <div className="form-container">
                <h3>Add New Grade</h3>
                <form onSubmit={handleSubmit}>
                    <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                        <option value="">-- Select Student --</option>
                        {students.map(student => (
                            <option key={student._id} value={student._id}>
                                {student.name} ({student.studentId})
                            </option>
                        ))}
                    </select>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (e.g., English)" required />
                    <input type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" required />
                    <select value={examType} onChange={(e) => setExamType(e.target.value)}>
                        <option value="Mid-term">Mid-term</option>
                        <option value="Final">Final</option>
                        <option value="Assignment">Assignment</option>
                    </select>
                    <button type="submit" className="add-button">Add Grade</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
};

export default GradeManagement;

