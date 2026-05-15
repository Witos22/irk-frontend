import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecruitmentList() {
    const navigate = useNavigate();
    const [recruitments, setRecruitments] = useState([]);

    useEffect(() => {
        const mockRecruitments = [
            { id: 1, name: "Informatyka - Studia I stopnia", startDate: "2024-06-01", endDate: "2024-07-15", isActive: true },
            { id: 2, name: "Prawo - Jednolite Magisterskie", startDate: "2024-06-01", endDate: "2024-07-20", isActive: true },
            { id: 3, name: "Zarządzanie - Studia Zaoczne", startDate: "2024-08-01", endDate: "2024-09-10", isActive: false },
        ];
        setRecruitments(mockRecruitments);
    }, []);

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
                            onClick={() => navigate(`/admin/candidates`)}
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