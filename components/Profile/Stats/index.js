import styles from './style.module.css'
import Button from '../../../components/common/Button'
import moment from 'moment';

export default function Stats({ userData, createApplicationHandler }) {
    return (
        <div className={styles.stats}>
            <div className={styles.profile_data}>
                <div className={styles.image_fullname}>
                    <div className={styles.image} style={{ backgroundImage: 'url(/profile.png)' }}></div>
                    <div className={styles.fullname}>
                        {userData?.fio} {!userData?.is_active && <span>(не активен)</span>}
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.info_row}>
                        <span>Дата регистрации: </span>
                        <span>{moment(userData?.reg_date).format('DD.MM.YYYY')}</span>
                    </div>
                    <div className={styles.info_row}>
                        <span>Город: </span>
                        <span>Нур-Султан</span>
                    </div>
                </div>
                <div>
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
                            onClick={createApplicationHandler}
                            text={'Стать исполнителем'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}