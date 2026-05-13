import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('currentUser');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8081/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Błąd podczas zamykania sesji w backendzie:", error);
        }
        localStorage.removeItem('currentUser');
        navigate('/login', { replace: true });
    };

    if (!user) return null;

    const containerStyle = {
        maxWidth: '1200px',
        width: '95%',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const welcomeCardStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
        marginBottom: '30px',
        border: '1px solid #f0f0f0'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        width: '100%'
    };

    const mobileGridStyle = window.innerWidth < 900 ? {
        gridTemplateColumns: '1fr'
    } : {};

    const actionCardStyle = {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        border: '1px solid #e8e8e8',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    };

    const buttonStyle = (isPrimary) => ({
        padding: '12px 20px',
        backgroundColor: isPrimary ? '#1890ff' : 'transparent',
        color: isPrimary ? 'white' : '#ff4d4f',
        border: isPrimary ? 'none' : '1px solid #ff4d4f',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        marginTop: '20px',
        width: '100%'
    });

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '10px',
                borderBottom: '1px solid #e8e8e8'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '4px',
                        height: '24px',
                        backgroundColor: '#1890ff',
                        borderRadius: '2px'
                    }}></div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#434343',
                        margin: 0,
                        letterSpacing: '-0.5px'
                    }}>
                        Panel Rekrutacyjny
                    </h1>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ ...buttonStyle(false), padding: '8px 15px', fontSize: '14px', marginTop: 0, width: 'auto' }}
                >
                    Wyloguj się
                </button>
            </div>

            {/* Powitanie */}
            <div style={welcomeCardStyle}>
                <h2 style={{ color: '#1890ff', marginBottom: '10px' }}>Witaj, {user.firstName + ' ' + user.lastName}! 🎉</h2>
                <p style={{ color: '#666', fontSize: '16px' }}>Jesteś zalogowany jako kandydat. Zarządzaj swoją rekrutacją poniżej.</p>
            </div>

            {/* Sekcje Akcji */}
            <div style={{ ...gridStyle, ...mobileGridStyle }}>

                {/* KARTA 1 */}
                <div className="dashboard-card" style={actionCardStyle}>
                    <div>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎓</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Kierunki Studiów</h3>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5' }}>
                            Wybierz interesujące Cię kierunki lub zmień obecne preferencje.
                        </p>
                    </div>
                    <button onClick={() => navigate('/courses')} style={buttonStyle(true)}>
                        Przejdź do kierunków
                    </button>
                </div>

                {/* KARTA 2 */}
                <div className="dashboard-card" style={actionCardStyle}>
                    <div>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>📊</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Wyniki Egzaminów</h3>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5' }}>
                            Uzupełnij wyniki matur oraz oceny ze świadectwa.
                        </p>
                    </div>
                    <button onClick={() => navigate('/results')} style={buttonStyle(true)}>
                        Uzupełnij wyniki
                    </button>
                </div>

                {/* KARTA 3 */}
                <div className="dashboard-card" style={actionCardStyle}>
                    <div>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>👤</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Profil Kandydata</h3>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5' }}>
                            Sprawdź swoje dane osobowe i status dokumentów.
                        </p>
                    </div>
                    <button onClick={() => navigate('/profile')} style={buttonStyle(true)}>
                        Mój profil
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '50px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                <p>W razie problemów z rekrutacją skontaktuj się z biurem obsługi kandydata.</p>
            </div>
        </div>
    );
}

export default Dashboard;