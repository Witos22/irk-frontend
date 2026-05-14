import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminEducationManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ id: null, name: '', placesLimit: 0 });
    const [isEditing, setIsEditing] = useState(false);

    const API_URL = 'http://localhost:8081/api/courses';

    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL, { credentials: 'include' });
            if (!response.ok) throw new Error('Błąd pobierania danych');
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (/\d/.test(formData.name)) {
            alert("Błąd: Nazwa kierunku nie może zawierać cyfr.");
            return;
        }
        if (formData.placesLimit <= 0) {
            alert("Błąd: Limit miejsc musi być większy od 0.");
            return;
        }
        const nameExists = courses.some(c =>
            c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== formData.id
        );
        if (nameExists) {
            alert(`Błąd: Kierunek o nazwie "${formData.name}" już istnieje.`);
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchCourses();
                resetForm();
                alert(isEditing ? "Zaktualizowano kierunek!" : "Dodano nowy kierunek!");
            }
        } catch (err) {
            alert("Błąd zapisu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten kierunek?")) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
            if (response.ok) { fetchCourses(); }
        } catch (err) { alert("Błąd usuwania: " + err.message); }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', placesLimit: 0 });
        setIsEditing(false);
    };

    const startEdit = (course) => {
        setFormData(course);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Ładowanie...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-content-card">

                {/* Nawigacja górna */}
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <button onClick={() => navigate(-1)} className="back-button">
                        Powrót do panelu
                    </button>
                </div>

                {/* Nagłówek strony */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                    <div style={{ width: '4px', height: '30px', backgroundColor: '#1890ff', borderRadius: '2px' }}></div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                        Zarządzanie Ofertą <span style={{ color: '#1890ff' }}>Edukacyjną</span>
                    </h1>
                </div>

                {/* Sekcja Formularza */}
                <div className="admin-form-section">
                    <h3 style={{ marginBottom: '20px', color: '#1890ff' }}>
                        {isEditing ? '📝 Edytuj kierunek' : '➕ Dodaj nowy kierunek'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: '20px'
                    }}>
                        <div style={{ flex: '3', minWidth: '300px' }}>
                            <label>Nazwa kierunku</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label>Limit miejsc</label>
                            <input
                                type="number"
                                value={formData.placesLimit}
                                onChange={(e) => setFormData({...formData, placesLimit: parseInt(e.target.value)})}
                                required
                            />
                        </div>
                        <button type="submit" className="primary-button" style={{ height: '46px', padding: '0 30px' }}>
                            {isEditing ? 'Zapisz' : 'Dodaj'}
                        </button>
                        {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="cancel-button"
                                >
                                    Anuluj
                                </button>
                            )}
                    </form>
                </div>

                {/* Sekcja Tabeli */}
                <div className="admin-table-wrapper">
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th className="col-id">ID</th>
                                    <th className="col-name">Nazwa Kierunku</th>
                                    <th className="col-limit">Limit Miejsc</th>
                                    <th className="col-actions">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id} className="table-row-hover">
                                        <td className="col-id" style={{ color: '#8c8c8c' }}>#{course.id}</td>
                                        <td className="col-name"><strong>{course.name}</strong></td>
                                        <td className="col-limit">
                                            <span style={{
                                                backgroundColor: '#e6f7ff',
                                                color: '#1890ff',
                                                padding: '5px 12px',
                                                borderRadius: '15px',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}>
                                                {course.placesLimit}
                                            </span>
                                        </td>
                                        <td className="col-actions">
                                            <div className="actions-container">
                                                <button onClick={() => startEdit(course)} className="link-button" style={{ color: '#1890ff' }}>Edytuj</button>
                                                <button onClick={() => handleDelete(course.id)} className="link-button" style={{ color: '#ff4d4f' }}>Usuń</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEducationManager;