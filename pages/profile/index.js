import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Stats from '../../components/Profile/Stats';
import ApplicationsTable from '../../components/Profile/ApplicationsTable';
import ApplicationsTableMobile from '../../components/Profile/ApplicationsTableMobile';
import { getCurrentUser } from '../../helpers/user';
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();
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
                <Stats userData={userData} createApplicationHandler={() => { router.push('/createApplication') }} />
                <br/><br/><br/>

                <div className={styles.mobileOnly}>
                    <ApplicationsTable userInfo />
                </div>
                <div className={styles.desktopOnly}>
                    <ApplicationsTableMobile userInfo />
                </div>
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}