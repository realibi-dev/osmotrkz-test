import Link from 'next/link'
import styles from './style.module.css'

export default function Header() {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link href={'/'}>ОСМОТР.KZ</Link>
            </div>
            <ul className={styles.menu}>
                <li className={styles.menu_item}>О нас</li>
                <li className={styles.menu_item}>Опубликованные заявки</li>
                <li className={styles.menu_item}>Скачать приложение</li>
                <li className={styles.menu_item}>Контакты</li>
            </ul>
            <div>
                <div className={styles.login_button}>
                    <a href={'/authorization'}>Вход</a>
                </div>
            </div>
        </div>
    )
}