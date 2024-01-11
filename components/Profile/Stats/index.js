import styles from './style.module.css'
import Button from '../../../components/common/Button'
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../helpers/user';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/router';

export default function Stats({ userData, createApplicationHandler }) {
    const router = useRouter();
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [avatarUrl, setAvatarUrl] = useState('/profile.png');
    const [city, setCity] = useState('Не указан');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser.avatar) {
            setAvatarUrl(process.env.NEXT_PUBLIC_API_URL + 'file/' + currentUser.avatar);
        }

        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllCities', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(data => {
            if (data.status === 200) {
                setCity(data.data.rows.find(item => item.id == currentUser?.city_id)?.name);
            }
        })
    }, [userData]);

    return (
        <div className={styles.stats}>
            <div className={styles.profile_data}>
                <div className={styles.image_fullname}>
                    <div className={styles.image} style={{ backgroundImage: `url(${avatarUrl})` }}></div>
                    <div className={styles.fullname}>
                        {userData?.fio}
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.info_row}>
                        <span>Дата регистрации: </span>
                        <span>{moment(userData?.reg_date).format('DD.MM.YYYY')}</span>
                    </div>
                    <div className={styles.info_row} style={{ marginTop: isMobile ? 20 : 0 }}>
                        <span>Город: </span>
                        <span>{city}</span>
                    </div>
                </div>
                <div style={{ marginTop: isMobile ? 20 : 0 }}>
                    <a className={styles.profile_edit_link} href='/profile/edit'>Редактировать профиль</a>
                </div>
            </div>

            <div className={styles.orders_data}>
                <div className={styles.orders_info}>
                    <div>
                        <span>0</span>
                        <span>Выполненные заказы</span>
                    </div>
                    <div>
                        <span>0</span>
                        <span>Всего заработано (₸)</span>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div>
                        <Button
                            type={'filled'}
                            onClick={createApplicationHandler}
                            text={'Разместить заявку'}
                        />
                    </div>
                    <div>
                        <Button
                            type={'text'}
                            onClick={() => router.push('/registration')}
                            text={'Стать исполнителем'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}