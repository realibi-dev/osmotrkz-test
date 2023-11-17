import Link from 'next/link'
import Head from 'next/head'
import styles from './style.module.css'
import { getCurrentUser, resetCurrentSession } from './../../helpers/user' 
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'

export default function Header() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [userNameExpanded, setUserNameExpanded] = useState(false);
    const [balanceExpanded, setBalanceExpanded] = useState(false);

    useEffect(() => {
        setCurrentUser(getCurrentUser());
    }, []);

    const handleLogout = () => {
        resetCurrentSession();
        router.push("/login");
    }

    const handleProfileClick = () => {
        router.push("/profile");
    }

    const handleBalanceChargeClick = () => {

    }

    const handleBalanceWithdrawClick = () => {

    }

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
                {currentUser && (
                    <div className={styles.userData}>
                        <div className={styles.balance} onClick={() => setBalanceExpanded(prevValue => !prevValue)}>
                            <img src={'/wallet.png'} height={26} />
                            <span>{currentUser.balance || 0}</span>
                            <div className={clsx(styles.dropdown, balanceExpanded ? styles.show : styles.hide)}>
                                <div className={styles.dropdown_item} onClick={handleBalanceChargeClick}>
                                    Пополнить баланс
                                </div>
                                <div className={styles.dropdown_item} onClick={handleBalanceWithdrawClick}>
                                    Вывод средств
                                </div>
                            </div>
                        </div>
                        <div className={styles.userName} onClick={() => setUserNameExpanded(prevValue => !prevValue)}>
                            <img src={'/user.png'} height={26} />
                            <span>{currentUser.fio}</span>
                            <div className={clsx(styles.dropdown, userNameExpanded ? styles.show : styles.hide)}>
                                <div className={styles.dropdown_item} onClick={handleProfileClick}>
                                    Личный кабинет
                                </div>
                                <div className={styles.dropdown_item} onClick={handleLogout}>
                                    Выход
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!currentUser && (
                    <div className={styles.login_button}>
                        <a href={'/login'}>Вход</a>
                    </div>
                )}
            </div>
        </div>
    )
}