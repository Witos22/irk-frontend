import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const adminString = localStorage.getItem('currentUser');
    const admin = adminString ? JSON.parse(adminString) : null;

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/admin/login');
    };

    return (
        <div style={{ padding: '20px', border: '2px solid red' }}>
            <h2 style={{ color: 'red' }}>Panel Administratora</h2>
            {admin && admin.role === 'ADMIN' ? (
                <div>
                    <p>Zalogowano jako: <strong>{admin.email}</strong></p>
                    <div style={{
                            margin: '20px 0',
                            padding: '15px',
                            backgroundColor: '#fff5f5',
                            borderRadius: '8px',
                            border: '1px solid #ffa39e'
                        }}>
                            <h3>Zarządzanie Systemem</h3>
                            <button
                                onClick={() => navigate('/admin/courses')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    marginRight: '10px',
                                    marginLeft: '10px',
                                    marginTop: '10px'

                                }}
                            >
                                Edytuj Ofertę Edukacyjną
                            </button>
                        </div>
                    <button onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'red',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '1px solid #ff4d4f',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                        }}
                    >
                        Wyloguj Admina
                    </button>
                </div>
            ) : (
                <p>Brak uprawnień! <button onClick={() => navigate('/admin/login')}>Zaloguj</button></p>
            )}
        </div>
    );
}

export default AdminDashboard;