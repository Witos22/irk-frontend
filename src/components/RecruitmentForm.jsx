import { useState, useEffect } from 'react';

function RecruitmentForm() {
    const [activeRecruitments, setActiveRecruitments] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const RECRUITMENTS_URL = 'http://localhost:8081/api/recruitments/active';
    const APPLICATIONS_URL = 'http://localhost:8081/api/applications';

    const fetchData = async () => {
        try {
            const [recRes, appRes] = await Promise.all([
                fetch(RECRUITMENTS_URL, { credentials: 'include' }),
                fetch(`${APPLICATIONS_URL}/my`, { credentials: 'include' })
            ]);

            if (recRes.ok && appRes.ok) {
                setActiveRecruitments(await recRes.json());
                setMyApplications(await appRes.json());
            }
        } catch (err) {
            console.error("Błąd pobierania danych", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (recruitmentId) => {
        if (!window.confirm("Czy na pewno chcesz złożyć aplikację na ten nabór?")) return;

        try {
            const response = await fetch(`${APPLICATIONS_URL}/${recruitmentId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Aplikacja została złożona pomyślnie!");
                fetchData(); // Odświeżamy dane po aplikacji
            } else if (response.status === 409) {
                const errorMsg = await response.text();
                alert(errorMsg); // "Już złożyłeś aplikację..."
            } else {
                alert("Wystąpił błąd podczas składania aplikacji.");
            }
        } catch (err) {
            alert("Błąd połączenia z serwerem.");
        }
    };

    // Funkcja sprawdzająca, czy kandydat już ma aplikację na dany nabór
    const hasApplied = (recruitmentId) => {
        return myApplications.some(app => app.recruitment.id === recruitmentId);
    };

    if (loading) return <div>Ładowanie dostępnych rekrutacji...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            <h2>Wybór Rekrutacji</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>
                Poniżej znajduje się lista aktywnych naborów. Wybierz ten, który Cię interesuje i złóż aplikację.
            </p>

            {/* SEKCJA: AKTYWNE REKRUTACJE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {activeRecruitments.map(rec => {
                    const applied = hasApplied(rec.id);
                    return (
                        <div key={rec.id} style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h3 style={{ marginTop: 0, color: '#1890ff' }}>{rec.name}</h3>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                <strong>Od:</strong> {rec.startDate} <br/>
                                <strong>Do:</strong> {rec.endDate}
                            </p>

                            <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
                                {applied ? (
                                    <button disabled style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5', color: '#a8a8a8', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'not-allowed', fontWeight: 'bold' }}>
                                        ✓ Aplikacja złożona
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApply(rec.id)}
                                        style={{ width: '100%', padding: '10px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Złóż aplikację
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {activeRecruitments.length === 0 && (
                    <p style={{ color: '#999' }}>Brak aktywnych rekrutacji w tym momencie.</p>
                )}
            </div>

            {/* SEKCJA: MOJE APLIKACJE (HISTORIA) */}
            <hr style={{ border: 'none', borderTop: '2px dashed #eee', marginBottom: '30px' }} />

            <h2>Moje Zgłoszenia</h2>
            {myApplications.length === 0 ? (
                <p style={{ color: '#999' }}>Nie złożyłeś jeszcze żadnej aplikacji.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fafafa', textAlign: 'left' }}>
                            <th style={{ padding: '12px 15px' }}>ID Zgłoszenia</th>
                            <th style={{ padding: '12px 15px' }}>Rekrutacja</th>
                            <th style={{ padding: '12px 15px' }}>Data Złożenia</th>
                            <th style={{ padding: '12px 15px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myApplications.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#555' }}>#{app.id}</td>
                                <td style={{ padding: '12px 15px' }}>{app.recruitment.name}</td>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#777' }}>
                                    {new Date(app.createdAt).toLocaleString('pl-PL')}
                                </td>
                                <td style={{ padding: '12px 15px' }}>
                                    <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default RecruitmentForm;