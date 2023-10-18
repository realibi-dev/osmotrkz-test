import styles from './style.module.css'

export default function Footer() {
    return (
        <div className={styles.container}>
            <div style={{ width: '25%' }} className={styles.column}>
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
                <div style={{ marginTop: 20 }} className={styles.text}>
                    2023 Осмотр.kz
                </div>
            </div>
            <div style={{ width: '30%' }} className={styles.column}>
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
            <div style={{ width: '15%' }} className={styles.column}>
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