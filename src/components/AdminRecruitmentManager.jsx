import { useState, useEffect } from 'react';

function AdminRecruitmentManager() {
    const [recruitments, setRecruitments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        startDate: '',
        endDate: '',
        isActive: false,
        courseId: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const RECRUITMENTS_API_URL = 'http://localhost:8081/api/recruitments';
    const COURSES_API_URL = 'http://localhost:8081/api/courses';

    const fetchData = async () => {
        try {
            const [recRes, courRes] = await Promise.all([
                fetch(RECRUITMENTS_API_URL, { credentials: 'include' }),
                fetch(COURSES_API_URL, { credentials: 'include' })
            ]);

            if (recRes.ok && courRes.ok) {
                setRecruitments(await recRes.json());
                setCourses(await courRes.json());
            }
        } catch (err) {
            alert("Błąd pobierania danych: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("Błąd: Data zakończenia nie może być wcześniejsza niż data rozpoczęcia!");
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${RECRUITMENTS_API_URL}/${formData.id}` : RECRUITMENTS_API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    isActive: formData.isActive,
                    courseId: formData.courseId ? parseInt(formData.courseId) : null
                })
            });

            if (response.ok) {
                fetchData();
                resetForm();
                alert(isEditing ? "Zaktualizowano rekrutację!" : "Dodano nową rekrutację!");
            } else {
                const errorText = await response.text();
                alert("Błąd zapisu: " + errorText);
            }
        } catch (err) {
            alert("Błąd zapisu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę rekrutację?")) return;

        try {
            const response = await fetch(`${RECRUITMENTS_API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                alert("Rekrutacja została usunięta!");
                fetchData();
            } else {
                alert("Nie udało się usunąć rekrutacji.");
            }
        } catch (err) {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', startDate: '', endDate: '', isActive: false, courseId: '' });
        setIsEditing(false);
    };

    const startEdit = (rec) => {
        // NOWOŚĆ: Szukamy, czy jakikolwiek kierunek ma przypisaną tę rekrutację
        const assignedCourse = courses.find(c => c.recruitment && c.recruitment.id === rec.id);

        setFormData({
            id: rec.id,
            name: rec.name,
            startDate: rec.startDate,
            endDate: rec.endDate,
            isActive: rec.isActive,
            courseId: assignedCourse ? assignedCourse.id : '' // Wstawiamy jego ID do formularza
        });
        setIsEditing(true);
    };

    // Funkcja pomocnicza do wyświetlania przypisanego kierunku w tabeli
    const getAssignedCourseName = (recId) => {
        const assignedCourse = courses.find(c => c.recruitment && c.recruitment.id === recId);
        return assignedCourse ? assignedCourse.name : <span style={{ color: '#999', fontStyle: 'italic' }}>Brak</span>;
    };

    if (loading) return <div>Ładowanie panelu administratora...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            <h2>Panel Administratora: Moduł Rekrutacji</h2>

            <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{isEditing ? 'Edytuj rekrutację' : 'Otwórz nową rekrutację'}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nazwa rekrutacji:</label>
                    <input
                        type="text"
                        placeholder="np. Letnia Rekrutacja 2026/2027"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box'}}
                        required
                    />

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data rozpoczęcia:</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data zakończenia:</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                    </div>

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Przypisz kierunek (Max 1 na rekrutację):</label>
                    <select
                        value={formData.courseId}
                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
                    >
                        <option value="">-- Wybierz kierunek (opcjonalnie) --</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name} (Limit: {c.placesLimit})</option>
                        ))}
                    </select>

                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            style={{ marginRight: '10px', width: '18px', height: '18px' }}
                        />
                        Rekrutacja jest aktywna (widoczna dla kandydatów)
                    </label>

                    <button type="submit" style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', transition: 'background-color 0.3s ease', marginRight: '10px' }}>
                        {isEditing ? 'Zapisz zmiany' : 'Utwórz rekrutację'}
                    </button>

                    {isEditing && (
                        <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#595959', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                            Anuluj
                        </button>
                    )}
                </form>
            </div>

            {/* LISTA REKRUTACJI */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'center' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nazwa</th>
                        <th style={{ padding: '10px' }}>Przypisany Kierunek</th> {/* NOWA KOLUMNA */}
                        <th style={{ padding: '10px' }}>Okres trwania</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {recruitments.map(rec => (
                        <tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{rec.id}</td>
                            <td style={{ padding: '10px' }}><strong>{rec.name}</strong></td>
                            {/* WYSWIETLANIE KIERUNKU */}
                            <td style={{ padding: '10px', textAlign: 'center' }}>{getAssignedCourseName(rec.id)}</td>
                            <td style={{ padding: '10px', textAlign: 'center', fontSize: '14px' }}>{rec.startDate} <br/> - <br/> {rec.endDate}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <span style={{
                                    backgroundColor: rec.isActive ? '#e6f7ff' : '#fff1f0',
                                    color: rec.isActive ? '#1890ff' : '#f5222d',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}>
                                    {rec.isActive ? 'AKTYWNA' : 'ZAKOŃCZONA'}
                                </span>
                            </td>
                            <td style={{ padding: '10px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <button onClick={() => startEdit(rec)} style={{ padding: '6px 12px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edytuj</button>
                                <button onClick={() => handleDelete(rec.id)} style={{ padding: '6px 12px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminRecruitmentManager;