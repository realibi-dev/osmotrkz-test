import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer';
import Form from '../../../../components/Form';
import FORMS_CONST from '../../../../helpers/constants';

export default function ResetSuccess() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <h2>success</h2>
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}