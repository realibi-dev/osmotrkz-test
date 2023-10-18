import Link from 'next/link'
import Head from 'next/head'
import styles from './style.module.css'

export default function Header() {
    return (
        <div className={styles.container}>
            <Head>
                <title>OSMOTR.KZ</title>
            </Head>
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