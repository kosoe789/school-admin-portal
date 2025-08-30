// src/components/StudentManagement.js - FINAL CORRECTED VERSION

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Management.css'; // Using the shared CSS

// <<< FIX #1: Define the correct API URL >>>
const API_URL = 'https://school-backend-c8gj.onrender.com/api/students';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [studentId, setStudentId] = useState('');
    const [parentName, setParentName] = useState('');
    const [parentContact, setParentContact] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_URL);
            setStudents(response.data);
        } catch (err) {
            setError('Failed to fetch students.');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !grade || !studentId) {
            setError('Name, Grade, and Student ID are required.');
            return;
        }

        try {
            const newStudent = { name, grade, studentId, parentName, parentContact };
            await axios.post(API_URL, newStudent);
            setSuccess('Student added successfully!');
            fetchStudents(); // Refresh the list
            // Clear form fields
            setName('');
            setGrade('');
            setStudentId('');
            setParentName('');
            setParentContact('');
        } catch (err) {
            setError('Failed to add student.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setSuccess('Student deleted successfully!');
            fetchStudents(); // Refresh the list
        } catch (err) {
            setError('Failed to delete student.');
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Student Management</h2>

            {/* Add New Student Form */}
            <div className="form-container">
                <h3>Add New Student</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" required />
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade (e.g., Grade 1)" required />
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID" required />
                    <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent Name" />
                    <input type="text" value={parentContact} onChange={(e) => setParentContact(e.target.value)} placeholder="Parent Contact" />
                    <button type="submit" className="add-button">Add Student</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>

            {/* Student List Table */}
            <div className="list-container">
                <h3>Student List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Grade</th>
                            <th>Student ID</th>
                            <th>Parent Name</th>
                            <th>Parent Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.grade}</td>
                                    <td>{student.studentId}</td>
                                    <td>{student.parentName}</td>
                                    <td>{student.parentContact}</td>
                                    <td>
                                        <button onClick={() => handleDelete(student._id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentManagement;
