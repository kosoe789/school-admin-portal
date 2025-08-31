// src/components/AnnouncementManagement.js

import React, { useState } from 'react';
import axios from 'axios';
import './Management.css';

const API_URL = 'https://school-backend-cl8g.onrender.com/api/announcements';

const AnnouncementManagement = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, { title, content });
            setSuccess('Announcement posted successfully!');
            setTitle(''); setContent(''); setError('');
        } catch (err) {
            setError('Failed to post announcement.');
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Announcement Management</h2>
            <div className="form-container">
                <h3>Post New Announcement</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required rows="4"></textarea>
                    <button type="submit" className="add-button">Post Announcement</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
};

export default AnnouncementManagement;
