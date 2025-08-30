// src/components/TeacherManagement.js - FINAL CORRECTED VERSION

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Management.css'; // Using the shared CSS

// <<< FIX #2: Define the correct API URL >>>
const API_URL = 'https://school-gudu.onrender.com/api/teachers';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(API_URL);
            setTeachers(response.data);
        } catch (err) {
            setError('Failed to fetch teachers.');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !subject || !teacherId) {
            setError('Name, Subject, and Teacher ID are required.');
            return;
        }

        try {
            const newTeacher = { name, subject, teacherId, contact };
            await axios.post(API_URL, newTeacher);
            setSuccess('Teacher added successfully!');
            fetchTeachers(); // Refresh the list
            // Clear form fields
            setName('');
            setSubject('');
            setTeacherId('');
            setContact('');
        } catch (err) {
            setError('Failed to add teacher.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setSuccess('Teacher deleted successfully!');
            fetchTeachers(); // Refresh the list
        } catch (err) {
            setError('Failed to delete teacher.');
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Teacher Management</h2>

            {/* Add New Teacher Form */}
            <div className="form-container">
                <h3>Add New Teacher</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Teacher Name" required />
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required />
                    <input type="text" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} placeholder="Teacher ID (e.g., T001)" required />
                    <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" />
                    <button type="submit" className="add-button">Add Teacher</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>

            {/* Current Teachers List */}
            <div className="list-container">
                <h3>Current Teachers</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Teacher ID</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.subject}</td>
                                    <td>{teacher.teacherId}</td>
                                    <td>{teacher.contact}</td>
                                    <td>
                                        <button onClick={() => handleDelete(teacher._id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No teachers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherManagement;
