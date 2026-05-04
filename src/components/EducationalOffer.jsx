import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EducationalOffer() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/courses', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`Błąd podczas pobierania kierunków: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError(err.message);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const toggleDetails = (courseId) => {
        setExpandedCourseId(prevId => (prevId === courseId ? null : courseId));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Ładowanie oferty edukacyjnej...</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>Oferta Edukacyjna</h2>
            {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px', marginBottom: '15px' }}>
                Błąd: {error}. Nie udało się pobrać kierunków z serwera.
            </p>}

            <div style={{ marginTop: '20px' }}>
                {courses.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {courses.map(course => (
                            <li key={course.id} style={{
                                padding: '15px 20px',
                                borderBottom: '1px solid #eee',
                                backgroundColor: '#fff',
                                transition: 'background-color 0.2s',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <span style={{ fontSize: '18px', color: '#333', fontWeight: 'bold' }}>{course.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <button
                                            onClick={() => toggleDetails(course.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                                color: '#555',
                                                transform: expandedCourseId === course.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease',
                                                padding: '0 5px'
                                            }}
                                            aria-expanded={expandedCourseId === course.id}
                                            aria-controls={`details-${course.id}`}
                                        >
                                            {expandedCourseId === course.id ? '▲' : '▼'}
                                        </button>
                                        <button
                                            onClick={handleRegisterClick}
                                            style={{
                                                padding: '8px 15px',
                                                backgroundColor: '#1890ff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                transition: 'background-color 0.3s ease',
                                                flexShrink: 0
                                            }}
                                        >
                                            Rejestracja
                                        </button>
                                    </div>
                                </div>
                                {expandedCourseId === course.id && (
                                    <div id={`details-${course.id}`} style={{
                                        marginTop: '10px',
                                        paddingTop: '10px',
                                        borderTop: '1px solid #eee',
                                        fontSize: '15px',
                                        color: '#666'
                                    }}>
                                        {course.description && <p style={{ margin: '0 0 5px 0' }}>{course.description}</p>}
                                        {course.placesLimit !== undefined && course.placesLimit !== null ? (
                                            <p style={{ margin: '0' }}>Limit miejsc: {course.placesLimit}</p>
                                        ) : (
                                            <p style={{ margin: '0' }}>Brak informacji o limicie miejsc.</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && !error && <p style={{ textAlign: 'center', color: '#777' }}>Brak dostępnych kierunków.</p>
                )}
            </div>
        </div>
    );
}

export default EducationalOffer;
