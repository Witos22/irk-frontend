import { useState, useEffect } from 'react';

function AdminEducationManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        // --- WALIDACJA 1: Liczby w nazwie ---
        if (/\d/.test(formData.name)) {
            alert("Błąd: Nazwa kierunku nie może zawierać cyfr.");
            return;
        }

        // --- WALIDACJA 2: Limit miejsc > 0 ---
        if (formData.placesLimit <= 0) {
            alert("Błąd: Limit miejsc musi być większy od 0.");
            return;
        }

        // --- WALIDACJA 3: Unikalność nazwy ---
        const nameExists = courses.some(c =>
            c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== formData.id
        );

        if (nameExists) {
            alert(`Błąd: Kierunek o nazwie "${formData.name}" już istnieje w systemie.`);
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
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                alert("Kierunek został usunięty pomyślnie!");
                fetchCourses();
            } else {
                alert("Nie udało się usunąć kierunku.");
            }} catch (err) {
                alert("Błąd usuwania: " + err.message);
            }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', placesLimit: 0 });
        setIsEditing(false);
    };

    const startEdit = (course) => {
        setFormData(course);
        setIsEditing(true);
    };

    if (loading) return <div>Ładowanie panelu administratora...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            <h2>Panel Administratora: Oferta Edukacyjna</h2>

            {/* FORMULARZ EDYCJI/DODAWANIA */}
            <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{isEditing ? 'Edytuj kierunek' : 'Dodaj nowy kierunek'}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nazwa kierunku"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', marginTop: '20px'}}
                        required
                    />
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Limit miejsc:</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={formData.placesLimit}
                        onChange={(e) => setFormData({...formData, placesLimit: parseInt(e.target.value)})}
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#52c41a',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#73d13d'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#52c41a'}
                    >
                        {isEditing ? 'Zapisz zmiany' : 'Dodaj kierunek'}
                    </button>
                    {isEditing && <button onClick={resetForm}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#595959',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                      e.target.style.color = '#40a9ff';
                      e.target.style.borderColor = '#40a9ff';
                  }}
                  onMouseOut={(e) => {
                      e.target.style.color = '#595959';
                      e.target.style.borderColor = '#d9d9d9';
                  }}>Anuluj</button>}
                </form>
            </div>

            {/* LISTA KIERUNKÓW Z OPCJAMI EDYCJI */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{
                        borderBottom: '2px solid #ddd',
                        textAlign: 'center'
                    }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Nazwa</th>
                        <th style={{ padding: '10px' }}>Limit miejsc</th>
                        <th style={{ padding: '10px' }}>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{course.id}</td>
                            <td><strong>{course.name}</strong></td>
                            <td><strong>{course.placesLimit}</strong></td>
                            <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => startEdit(course)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#1890ff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 2px 0 rgba(5, 145, 255, 0.1)'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
                                >
                                    Edytuj
                                </button>

                                <button
                                    onClick={() => handleDelete(course.id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#ff4d4f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 2px 0 rgba(255, 38, 5, 0.06)'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff7875'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminEducationManager;