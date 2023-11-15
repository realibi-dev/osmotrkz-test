import styles from './style.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NewUsersTable from '../../components/NewUsersTable';

export default function Admin(){
    const [newAccounts, setNewAccounts] = useState([]);

    const fetchUsers = async () => {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + 'getAllUsers', { headers: { 'ngrok-skip-browser-warning': 'true'  } });
        const data = await response.data;
        setNewAccounts(data.rows);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const activateAccount = userId => {
        axios
        .patch(process.env.NEXT_PUBLIC_API_URL + 'setAdminStatus', { person_id: userId })
        .then(() => fetchUsers())
        .catch(() => alert('Что-то пошло нетак!'));
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.body}>
                <h1>Заявки на регистрацию аккаунтов</h1>
                <NewUsersTable users={newAccounts} activateAccount={activateAccount} />
            </div>
            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}
