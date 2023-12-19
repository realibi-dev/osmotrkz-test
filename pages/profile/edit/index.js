import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Form from '../../../components/Form';
import FORMS_CONST from '../../../helpers/constants';
import { getCurrentUser, setCurrentUser } from '../../../helpers/user';
import axios from 'axios';

export default function ProfileEdit() {
    const [userData, setUserData] = useState();
    const [avatarUrl, setAvatarUrl] = useState('/profile.png');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser.avatar) {
            setAvatarUrl(process.env.NEXT_PUBLIC_API_URL + 'file/' + currentUser.avatar);
        }
    }, []);

    const fetchUserData = () => {
        const currentUserData = getCurrentUser();
        setUserData(currentUserData);
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const onImageInputChange = (e) => {
        const file = e.target.files[0];
        let currentUserData = getCurrentUser();
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", currentUserData.id);
        if (file) {
            axios.post(process.env.NEXT_PUBLIC_API_URL + 'setUserAvatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (response.data.success) {
                    setCurrentUser(response.data.user);
                    setAvatarUrl(process.env.NEXT_PUBLIC_API_URL + 'file/' + response.data.user.avatar);
                }
            })
            .catch(() => alert("Что-то пошло нетак!"));
        }
    }

    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <div className={styles.box}>
                    <div className={styles.image_fullname}>
                        <div className={styles.image} style={{ backgroundImage: `url(${avatarUrl})` }}></div>
                        <div className={styles.fullname}>
                            {userData?.fio}
                        </div>
                        {/* <Button
                            type={'filled'}
                            onClick={uploadImageHandler}
                            text={'Загрузить фото'}
                            additionalStyles={{ marginTop: 24 }}
                        /> */}
                        <label className={styles.uploadButton}>
                            <input type='file' className={styles.avatarChangeBtn} name='avatar' onChange={onImageInputChange}/>
                            Загрузить фото
                        </label>
                        
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