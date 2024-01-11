import Link from 'next/link'
import Head from 'next/head'
import styles from './style.module.css'
import { getCurrentUser, resetCurrentSession } from './../../helpers/user' 
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive';

export default function Header() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [userNameExpanded, setUserNameExpanded] = useState(false);
    const [balanceExpanded, setBalanceExpanded] = useState(false);
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [menuExpanded, setMenuExpanded] = useState(false);

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
        router.push("/addBalance");
    }

    const handleBalanceWithdrawClick = () => {

    }

    const renderMobileHeaderAuthorized = () => {
        return (
            <div>
                <div className={styles.mobileContainer} style={{ backgroundColor: '#fff' }}>
                    <div className={styles.mobileLogo} style={{ backgroundColor: '#fff' }}>
                        <Link href={'/'}>ОСМОТР.KZ</Link>
                    </div>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            backgroundImage: `url(/burger.png)`,
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => setMenuExpanded(!menuExpanded)}
                    >
                    </div>
                </div>

                <div className={styles.mobileContainer} style={{ display: menuExpanded ? 'block' : 'none' }}>
                    <div>
                        <ul className={styles.menu} style={{ flexDirection: 'column' }}>
                            <li className={styles.menu_item_mobile}>О нас</li>
                            <li className={styles.menu_item_mobile}>
                                <Link href={'/publishedApplications'}>
                                    Опубликованные заявки
                                </Link>
                            </li>
                            <li className={styles.menu_item_mobile}>Скачать приложение</li>
                            <li className={styles.menu_item_mobile}>Контакты</li>
                            <li className={styles.menu_item_mobile}>Баланс: {currentUser.balance || 0} KZT</li>
                            <li className={styles.menu_item_mobile} onClick={() => handleProfileClick()}>Личный кабинет</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    const renderMobileHeaderUnauthorized = () => {
        return (
            <div>
                <div className={styles.mobileContainer} style={{ backgroundColor: '#fff' }}>
                    <div className={styles.mobileLogo} style={{ backgroundColor: '#fff' }}>
                        <Link href={'/'}>ОСМОТР.KZ</Link>
                    </div>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            backgroundImage: `url(/burger.png)`,
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => setMenuExpanded(!menuExpanded)}
                    >
                    </div>
                </div>

                <div className={styles.mobileContainer} style={{ display: menuExpanded ? 'block' : 'none' }}>
                    <div>
                        <ul className={styles.menu} style={{ flexDirection: 'column' }}>
                            <li className={styles.menu_item_mobile}>О нас</li>
                            <li className={styles.menu_item_mobile}>
                                <Link href={'/publishedApplications'}>
                                    Опубликованные заявки
                                </Link>
                            </li>
                            <li className={styles.menu_item_mobile}>Скачать приложение</li>
                            <li className={styles.menu_item_mobile}>Контакты</li>
                            <li className={styles.menu_item_mobile}>
                                <a href={'/login'}>Вход</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    const renderDesktopHeaderUnauthorized = () => {
        return (
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href={'/'}>ОСМОТР.KZ</Link>
                </div>
                <div>
                    <ul className={styles.menu}>
                        <li className={styles.menu_item}>О нас</li>
                        <li className={styles.menu_item}>
                            <Link href={'/publishedApplications'}>
                                Опубликованные заявки
                            </Link>
                        </li>
                        <li className={styles.menu_item}>Скачать приложение</li>
                        <li className={styles.menu_item}>Контакты</li>
                    </ul>
                </div>
                <div className={styles.login_button}>
                    <a href={'/login'}>Вход</a>
                </div>
            </div>
        );
    }

    const renderDesktopHeaderAuthorized = () => {
        return (
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href={'/'}>ОСМОТР.KZ</Link>
                </div>
                <div>
                    <ul className={styles.menu}>
                        <li className={styles.menu_item}>
                            <Link href={'/publishedApplications'}>
                                Опубликованные заявки
                            </Link>
                        </li>
                        <li className={styles.menu_item}>О нас</li>
                        <li className={styles.menu_item}>Правила</li>
                    </ul>
                </div>
                <div className={styles.userData} style={{ marginLeft: 60 }}>
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
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>OSMOTR.KZ</title>
            </Head>
            
            {currentUser && !isMobile && renderDesktopHeaderAuthorized()}
            {!currentUser && !isMobile && renderDesktopHeaderUnauthorized()}
            {!currentUser && isMobile && renderMobileHeaderUnauthorized()}
            {currentUser && isMobile && renderMobileHeaderAuthorized()}
        </>
    )
}