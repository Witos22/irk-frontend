import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecruitmentList() {
    const navigate = useNavigate();
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:8081/api/recruitments';

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const response = await fetch(API_URL, { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setRecruitments(data);
                } else {
                    console.error("Błąd pobierania rekrutacji");
                }
            } catch (err) {
                console.error("Błąd połączenia z serwerem", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitments();
    }, []);

    if (loading) return <div>Ładowanie naborów...</div>;

    return (
        <div className="dashboard-wrapper">
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <button onClick={() => navigate('/admin-dashboard')} className="back-button">
                    Powrót do panelu
                </button>
            </div>

            <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="header-decorator"></div>
                    <h1 className="header-title">Wybierz Rekrutację</h1>
                </div>
            </div>

            <div className="actions-grid">
                {recruitments.map((rec) => (
                    <div key={rec.id} className="action-card" style={{ borderLeft: rec.isActive ? '4px solid #52c41a' : '4px solid #d9d9d9' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '24px' }}>📂</span>
                                <span style={{
                                    fontSize: '11px',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    backgroundColor: rec.isActive ? '#f6ffed' : '#f5f5f5',
                                    color: rec.isActive ? '#52c41a' : '#8c8c8c',
                                    border: `1px solid ${rec.isActive ? '#b7eb8f' : '#d9d9d9'}`
                                }}>
                                    {rec.isActive ? 'AKTYWNA' : 'ZAKOŃCZONA'}
                                </span>
                            </div>
                            <h3 style={{ marginTop: '15px', textAlign: 'left' }}>{rec.name}</h3>
                            <p style={{ textAlign: 'left', fontSize: '13px', color: '#8c8c8c' }}>
                                📅 {rec.startDate} — {rec.endDate}
                            </p>
                        </div>
                        <button
                            className="btn-dashboard btn-primary"
                            // Przekazujemy ID wybranej rekrutacji w URL
                            onClick={() => navigate(`/admin/candidates/${rec.id}`)}
                        >
                            Zarządzaj kandydatami
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecruitmentList;