import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Form from '../../../components/Form';
import FORMS_CONST from '../../../helpers/constants';
import Button from '../../../components/common/Button';
import { getCurrentUser } from '../../../helpers/user';

export default function ProfileEdit() {
    const [userData, setUserData] = useState();

    const fetchUserData = () => {
        const currentUserData = getCurrentUser();
        setUserData(currentUserData);
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const uploadImageHandler = () => {

    }

    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <div className={styles.box}>
                    <div className={styles.image_fullname}>
                        <div className={styles.image} style={{ backgroundImage: 'url(/profile.png)' }}></div>
                        <div className={styles.fullname}>
                            {userData?.fio}
                        </div>
                        <Button
                            type={'filled'}
                            onClick={uploadImageHandler}
                            text={'Загрузить фото'}
                            additionalStyles={{ marginTop: 24 }}
                        />
                    </div>
                    <div>
                        <Form
                            formType={'profileEdit'}
                            isNeedBackgroundImages={false}
                            isNeedHeader={false}
                            removeOutline={true}
                            stepNum={FORMS_CONST.FORM_STEPS.PROFILE_EDIT}
                        />
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}