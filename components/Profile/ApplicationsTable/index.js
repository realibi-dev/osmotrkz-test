import { useState } from 'react';
import styles from './style.module.css'
import clsx from 'clsx';
import { getCurrentUser } from './../../../helpers/user';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';

function MyResponds() {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const router = useRouter();
    const [tableRows, setTableRows] = useState([]);

    useEffect(() => {
        if (getCurrentUser()) {
            axios
            .get(process.env.NEXT_PUBLIC_API_URL + 'getUserResponses/' + getCurrentUser().id, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
            .then(response => {
                if (response.data?.success) {
                    setTableRows(response.data.userRequests);
                }
            })
            .catch(error => alert("Ошибка при загрузке заявок"))
        }
    }, []);

    const statuses = {
        "created": 'Отклик отправлен',
        "started": 'В работе',
        "finished": 'Завершен',
        "rejected": 'Подтвержден',
    }

    const openApplication = (id, statusId) => {
        console.log(statusId);
        let url = '';
        switch(statusId) {
            case "created":
                url = `/myResponds/${id}`;
                break;
            case "started":
                url = `/myResponds/active/${id}`;
                break;
            case "finished":
                url = `/myResponds/finished/${id}`;
                break;
            case "rejected":
                url = `/myResponds/${id}`;
                break;
        }
        router.push(url);
    }

    return(
        <>
            <tbody>
                <tr>
                    <th>№</th>
                    <th>Заказ</th>
                    <th>Адрес</th>
                    <th>Сроки (до)</th>
                    <th>Бюджет</th>
                    <th>Статус</th>
                </tr>
                {tableRows.length ? (
                    tableRows.map(row => (
                        <tr className={styles.tableRow} onClick={() => openApplication(row.id, row.work_status)}>
                            <td className={styles.tableRowCell}>{row.id}</td>
                            <td className={styles.tableRowCell}>{row.description}</td>
                            <td className={styles.tableRowCell}>{row.address}</td>
                            <td className={styles.tableRowCell}>{moment(row.order_deadline).format('DD.MM.YYYY')} <br/> (с {row.review_time_from?.split(':')?.slice(0, 2)?.join(':')})</td>
                            <td className={styles.tableRowCell}>{parseFloat(row.price)}т</td>
                            <td className={styles.tableRowCell}>{statuses[row.work_status]}</td>
                        </tr>
                    ))
                ) : (
                    <tr className={styles.tableRow}>
                        <td colSpan={6} style={{textAlign: "center"}} className={styles.tableRowCell}>У вас пока нет откликов</td>
                    </tr>
                )}
            </tbody>            
        </>
    );
}

function MyApplications() {
    const router = useRouter();
    const [tableRows, setTableRows] = useState([]);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllRequests', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            if (response.data?.success) {
                setTableRows(response.data.requests.filter(item => item.owner_id == getCurrentUser()?.id));
            }
        })
        .catch(error => alert("Ошибка при загрузке заявок"))
    }, []);

    const statuses = {
        1: 'Опубликован',
        2: 'В работе',
        3: 'Завершен',
        4: 'Самостоятельный осмотр',
    }

    const openApplication = (id, statusId) => {
        let url = '';
        switch(statusId) {
            case 1:
                url = `/myResponds/${id}`;
                break;
            case 2:
                url = `/myResponds/active/${id}`;
                break;
            case 3:
                url = `/myResponds/finished/${id}`;
                break;
            case 4:
                url = `/myResponds/${id}`;
                break;
        }
        url += "?my=true";
        router.push(url);
    }

    return(
        <>
            
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Заказ</th>
                        <th>Адрес</th>
                        <th>Сроки (до)</th>
                        <th>Бюджет</th>
                        <th>Статус</th>
                    </tr>

                    {tableRows.length ? (tableRows.map(row => (
                        <tr className={styles.tableRow} onClick={() => openApplication(row.id, row.status_id)}>
                            <td className={styles.tableRowCell}>{row.id}</td>
                            <td className={styles.tableRowCell}>{row.description}</td>
                            <td className={styles.tableRowCell}>{row.address}</td>
                            <td className={styles.tableRowCell}>{moment(row.order_deadline).format('DD.MM.YYYY')} <br/> (с {row.review_time_from?.split(':')?.slice(0, 2)?.join(':')})</td>
                            <td className={styles.tableRowCell}>{parseFloat(row.price)}т</td>
                            <td className={styles.tableRowCell}>{statuses[row.status_id]}</td>
                        </tr>
                    ))) : 
                        <tr className={styles.tableRow}>
                            <td colSpan={6} style={{textAlign: "center"}} className={styles.tableRowCell}>У вас пока нет заявок</td>
                        </tr>
                    }
                </tbody>
            
        </>
    );
}

function MyFavourites() {
    const router = useRouter();
    const [tableRows, setTableRows] = useState([]);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getFavorites/' + getCurrentUser().id, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            if (response.data?.success) {
                setTableRows(response.data.favorites.filter(item => item.owner_id == getCurrentUser()?.id));
            }
        })
        // .catch(error => alert("Ошибка при загрузке заявок"))
    }, []);

    return(
        <>
            <tbody>
                <tr style={{textAlign:"left"}}>
                    <th>№</th>
                    <th>Заказ</th>
                    <th>Адрес</th>
                    <th>Сроки (до)</th>
                    <th>Бюджет</th>
                </tr>
                {tableRows.length ? (
                    tableRows.map(row => (
                        <tr className={styles.tableRow} onClick={() => router.push('/publishedApplications/' + row.id)}>
                            <td className={styles.tableRowCell}>{row.id}</td>
                            <td className={styles.tableRowCell}>{row.description}</td>
                            <td className={styles.tableRowCell}>{row.address}</td>
                            <td className={styles.tableRowCell}>{moment(row.order_deadline).format('DD.MM.YYYY')} <br/> (с {row.review_time_from?.split(':')?.slice(0, 2)?.join(':')})</td>
                            <td className={styles.tableRowCell}>{parseFloat(row.price)}т</td>
                        </tr>
                    ))                
                ): 
                    <tr className={styles.tableRow}>
                        <td colSpan={5} style={{textAlign: "center"}} className={styles.tableRowCell}>У вас нет ничего в избранных</td>
                    </tr>
                }
            </tbody>
        </>
    );
}

export default function ApplicationsTable({ userInfo }) {
    const [tableRows, setTableRows] = useState([]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [currentUser, setCurrentUser] = useState();
    
    let initialTabs = [
        { id: 1, title: 'Мои отклики' },
        { id: 2, title: 'Мои заявки' },
        { id: 3, title: 'Избранные' },
    ]

    const [tabs, setTabs] = useState(initialTabs);

    const fetchUserData = () => {
        const currentUserData = getCurrentUser();        
        setCurrentUser(currentUserData);
        if(currentUserData.role_id == 1){
            setTabs(tabs.slice(1)); // Если авторизован как заказчик то убираем вкладку
        }
    }
    
    useEffect(() => {
        fetchUserData();        
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {
                    tabs.map(tab => (
                        <div
                            className={clsx(styles.tab, activeTabId === tab.id && styles.activeTab)}
                            onClick={() => setActiveTabId(tab.id)}    
                        >
                            {tab.title}
                        </div>
                    ))
                }
            </div>

            <select className={styles.select}>
                <option>Все</option>
            </select>

            <table className={styles.table}>
                {activeTabId === 1 && <MyResponds />}
                {activeTabId === 2 && <MyApplications />}
                {activeTabId === 3 && <MyFavourites />}
            </table>
        </div>
    );
}