// src/components/TimetableManagement.js - FINAL CORRECTED VERSION (AGAIN)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Management.css';

const API_URL = 'http://localhost:5000/api';

// <<< FIX #1: Define a default, empty schedule structure >>>
const initialScheduleState = {
    Monday: Array(5).fill({ subject: '', teacher: '' }),
    Tuesday: Array(5).fill({ subject: '', teacher: '' }),
    Wednesday: Array(5).fill({ subject: '', teacher: '' }),
    Thursday: Array(5).fill({ subject: '', teacher: '' }),
    Friday: Array(5).fill({ subject: '', teacher: '' }),
};

const TimetableManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('Grade 1');
    // <<< FIX #2: Initialize state with the default structure >>>
    const [schedule, setSchedule] = useState(initialScheduleState);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const periods = ['09:00 - 09:45', '09:45 - 10:30', '11:00 - 11:45', '11:45 - 12:30', '01:30 - 02:15'];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const teachersRes = await axios.get(`${API_URL}/teachers`);
                setTeachers(teachersRes.data);
            } catch (err) {
                setError('Failed to fetch teachers.');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (selectedGrade) {
                try {
                    const response = await axios.get(`${API_URL}/timetables?grade=${selectedGrade}`);
                    // If data exists and has a schedule, use it. Otherwise, use the initial empty state.
                    if (response.data && response.data.schedule) {
                        setSchedule(response.data.schedule);
                    } else {
                        setSchedule(initialScheduleState); // Reset to empty schedule
                    }
                } catch (err) {
                    // If no timetable is found (404 error), just reset to an empty schedule.
                    setSchedule(initialScheduleState);
                    console.log(`No timetable found for ${selectedGrade}, starting fresh.`);
                }
            }
        };
        fetchTimetable();
    }, [selectedGrade]);

    const handlePeriodChange = (day, periodIndex, field, value) => {
        // <<< FIX #3: Ensure schedule is an object before proceeding >>>
        setSchedule(prevSchedule => {
            const newSchedule = { ...prevSchedule };
            const newPeriods = [...newSchedule[day]];
            newPeriods[periodIndex] = { ...newPeriods[periodIndex], [field]: value };
            newSchedule[day] = newPeriods;
            return newSchedule;
        });
    };

    const handleSaveTimetable = async () => {
        setError('');
        setSuccess('');
        try {
            const payload = {
                grade: selectedGrade,
                schedule: schedule,
            };
            await axios.post(`${API_URL}/timetables`, payload);
            setSuccess('Timetable saved successfully!');
        } catch (err) {
            setError('Failed to save timetable.');
            console.error(err);
        }
    };

    return (
        <div className="management-container">
            <h2>Timetable Management</h2>
            <div className="form-container">
                <label htmlFor="grade-select">Select Grade:</label>
                <select id="grade-select" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            <div className="list-container timetable-grid">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            {/* <<< FIX #4: Check if schedule is not null before mapping >>> */}
                            {schedule && Object.keys(schedule).map(day => <th key={day}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map((period, periodIndex) => (
                            <tr key={period}>
                                <td>{period}</td>
                                {schedule && Object.keys(schedule).map(day => (
                                    <td key={`${day}-${periodIndex}`}>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            value={schedule[day]?.[periodIndex]?.subject || ''}
                                            onChange={(e) => handlePeriodChange(day, periodIndex, 'subject', e.target.value)}
                                        />
                                        <select
                                            value={schedule[day]?.[periodIndex]?.teacher || ''}
                                            onChange={(e) => handlePeriodChange(day, periodIndex, 'teacher', e.target.value)}
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSaveTimetable} className="add-button" style={{ marginTop: '20px' }}>Save Timetable</button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default TimetableManagement;
