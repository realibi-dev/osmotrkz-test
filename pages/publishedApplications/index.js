import { useEffect, useState } from 'react';
import styles from './style.module.css';
import globalStyles from '../../styles/Home.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import PublishedApplicationsTable from '../../components/common/PublishedApplicationsTable';

export default function PublishedApplications() {

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.bannerContainer}>
                <span>Разместите свою заявку на осмотр недвижимости</span>
                <button className={styles.bannerButton}>
                    <Link href={'/createApplication'}>
                        Разместить заявку
                    </Link>
                </button>
            </div>

            <h1 className={styles.heading}>Опубликованные заявки</h1>

            

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <PublishedApplicationsTable />
                <br/>
                <br/>
                <br/>
                <Footer />
            </div>
        </div>
    );
}