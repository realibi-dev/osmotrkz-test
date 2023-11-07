import { useEffect, useState } from 'react';
import Form from '../../../components/Form';
import FORMS_CONST from '../../../helpers/constants';
import styles from '../style.module.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ResetPassword() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Form formType={'resetPassword'} stepNum={FORMS_CONST.FORM_STEPS.RESET_PASSWORD}/>
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
            <Footer />
            </div>
        </div>
    );
}