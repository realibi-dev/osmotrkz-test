import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Stats from '../../components/Profile/Stats';
import ApplicationsTable from '../../components/Profile/ApplicationsTable';
import { getCurrentUser } from '../../helpers/user'

export default function Profile() {
    const [userData, setUserData] = useState();

    const fetchUserData = () => {
        const currentUserData = getCurrentUser();
        setUserData(currentUserData);
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const createApplicationHandler = () => {

    }

    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Stats userData={userData} createApplicationHandler={() => {}} />
                <br/><br/><br/>
                <ApplicationsTable userInfo />
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}