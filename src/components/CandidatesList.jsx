import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CandidatesList() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [courseName, setCourseName] = useState("Informatyka");

    useEffect(() => {
        const mockCandidates = [
            { id: 1, firstName: "Anna", lastName: "Nowak", points: 485, status: "Zakwalifikowany", email: "a.nowak@example.com" },
            { id: 2, firstName: "Piotr", lastName: "Zieliński", points: 472, status: "Lista rezerwowa", email: "p.zielinski@test.pl" },
            { id: 3, firstName: "Katarzyna", lastName: "Wójcik", points: 460, status: "Oczekujący", email: "k.wojcik@poczta.pl" },
            { id: 5, firstName: "Jan", lastName: "Kowalski", points: 452, status: "Oczekujący", email: "j.kowalski@irk.pl" },
            { id: 4, firstName: "Michał", lastName: "Kowalczyk", points: 440, status: "Odrzucony", email: "m.kowalczyk@domain.com" },
        ];

        setCandidates(mockCandidates.sort((a, b) => b.points - a.points));
    }, [courseId]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Zakwalifikowany": return { backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            case "Lista rezerwowa": return { backgroundColor: '#fff7e6', color: '#faad14', border: '1px solid #ffe58f' };
            case "Odrzucony": return { backgroundColor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e' };
            default: return { backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' };
        }
    };

    return (
        <div className="candidates-container">
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <button onClick={() => navigate(-1)} className="back-button">
                    Powrót do listy kierunków
                </button>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e8e8e8'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '4px', height: '30px', backgroundColor: '#1890ff', borderRadius: '2px' }}></div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#262626', margin: 0 }}>
                            Kandydaci: <span style={{ color: '#1890ff' }}>{courseName}</span>
                        </h1>
                        <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>Liczba chętnych: {candidates.length}</p>
                    </div>
                </div>

                <button className="button" style={{
                    backgroundColor: '#0056b3',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }} onClick={() => window.print()}>
                    🖨️ Drukuj listę
                </button>
            </div>
            <div className="candidates-table-card">
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th className="col-rank">Miejsce</th>
                            <th>Imię i Nazwisko</th>
                            <th>Email</th>
                            <th className="col-points">Punkty</th>
                            <th className="col-status">Status</th>
                            <th className="col-actions">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c, index) => (
                            <tr key={c.id} className="table-row-hover">
                                <td className="col-rank" style={{ fontWeight: 'bold', color: index < 3 ? '#1890ff' : '#595959' }}>
                                    {index + 1}.
                                </td>
                                <td style={{ fontWeight: '500' }}>{c.firstName} {c.lastName}</td>
                                <td style={{ color: '#8c8c8c', fontSize: '13px' }}>{c.email}</td>
                                <td className="col-points">
                                    <strong style={{ fontSize: '16px' }}>{c.points}</strong>
                                </td>
                                <td className="col-status">
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        ...getStatusStyle(c.status)
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="col-actions">
                                    <button className="details-button">Szczegóły</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CandidatesList;