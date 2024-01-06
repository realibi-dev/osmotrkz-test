import styles from './style.module.css';
import { useMediaQuery } from 'react-responsive';

export default function Footer() {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

    return (
        <div className={styles.container}>
            <div style={{ width: isMobile ? '100%' : '25%' }} className={styles.column}>
                <div className={styles.logo}>
                    ОСМОТР.KZ
                </div>
                <div className={styles.text}>
                    Личный кабинет
                </div>
                <div className={styles.text}>
                    Пользовательское соглашение
                </div>
                <div className={styles.text}>
                    Правила размещения заявок
                </div>
                <div className={styles.text}>
                    Написать в службу поддержки
                </div>
                <div style={{ marginTop: isMobile ? 0 : 20 }} className={styles.text}>
                    2023 Осмотр.kz
                </div>
            </div>
            <div style={{ width: isMobile ? '100%' : '30%', marginTop: isMobile ? 40 : 0, }} className={styles.column}>
                <div className={styles.text}>
                    Наши соц. сети
                </div>
                <div className={styles.text}>
                    <a className={styles.link_icon} href='https://web.telegram.org/'>
                        <img src={'/telegram.png'} height={24} />
                    </a>
                    <a className={styles.link_icon} href='https://www.instagram.com/'>
                        <img src={'/instagram.png'} height={24} />
                    </a>
                    <a className={styles.link_icon} href='https://ru-ru.facebook.com/'>
                        <img src={'/facebook.png'} height={24} />
                    </a>
                </div>
            </div>
            <div style={{ width: isMobile ? '100%' : '15%', marginTop: isMobile ? 40 : 0, marginBottom: isMobile ? 40 : 0 }} className={styles.column}>
                <div className={styles.text}>
                    Контакты <br/>
                    +7 700 000 00 00
                </div>
                <div className={styles.text}>
                    Адрес <br/>
                    Рыскулова 54
                </div>
            </div>
        </div>
    );
}