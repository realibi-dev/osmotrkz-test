import { useEffect, useState } from 'react';
import Form from '../../../components/Form';
import FORMS_CONST from '../../../helpers/constants';
import styles from '../style.module.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function SendEmail() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Form formType={'sendEmail'} stepNum={FORMS_CONST.FORM_STEPS.SEND_EMAIL_CODE}/>
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
            <Footer />
            </div>
        </div>
    );
}