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
        1: 'Опубликован',
        2: 'В работе',
        3: 'Завершен',
        4: 'Самостоятельный осмотр',
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

    function getStatusClass(status) {
        switch (status) {
          case 0: return styles.publishedText;
          case 1: return styles.completedText;
          default: return styles.defaultText;
        }
    }

    return(
        <>
            {tableRows.length ? (
                    tableRows.map(row => (
                        <div className={styles.item} onClick={() => openApplication(row.id, row.work_status)}>
                            <div className={styles.head}>
                                <div className={getStatusClass(row.status_id)}>{statuses[row.work_status]}</div>
                                {row.work_status == 1 && <div className={styles.dot}></div>}
                            </div>

                            <div className={styles.kad}>
                                {row.kad_number}
                            </div>

                            <div className={styles.title}>
                                {row.description}
                            </div>
                                                        
                            <div className={styles.flex}>
                                <div className={styles.budgetBlock}>
                                    <div className={styles.budgetText}>
                                        Бюджет
                                    </div>  
                                    <div className={styles.budget}>
                                        {row.price}
                                    </div>  
                                </div>
                                <div className={styles.deadlineBlock}>
                                    <div className={styles.deadlineText}>
                                        Сроки (до)
                                    </div>  
                                    <div className={styles.deadline}>
                                        {moment(row.order_deadline).format('DD.MM.YYYY')}
                                    </div>  
                                </div>
                            </div>

                            <div className={styles.addressBlock}>
                                <div className={styles.geoIcon}></div>
                                <div className={styles.address}>{row.address}</div>                                
                            </div>  
                        </div>
                    ))
                ) : (
                    <div className={styles.tableRow}>
                        У вас пока нет откликов
                    </div>
                )}
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

    function getStatusClass(status) {
        switch (status) {
          case 0: return styles.publishedText;
          case 1: return styles.completedText;
          default: return styles.defaultText;
        }
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
            {tableRows.length ? (
                    tableRows.map(row => (
                        <div className={styles.item} onClick={() => openApplication(row.id, row.work_status)}>
                            <div className={styles.head}>
                                <div className={getStatusClass(row.status_id)}>{statuses[row.work_status]}</div>
                                {row.work_status == 1 && <div className={styles.dot}></div>}
                            </div>

                            <div className={styles.kad}>
                                {row.kad_number}
                            </div>

                            <div className={styles.title}>
                                {row.description}
                            </div>
                                                        
                            <div className={styles.flex}>
                                <div className={styles.budgetBlock}>
                                    <div className={styles.budgetText}>
                                        Бюджет
                                    </div>  
                                    <div className={styles.budget}>
                                        {row.price}
                                    </div>  
                                </div>
                                <div className={styles.deadlineBlock}>
                                    <div className={styles.deadlineText}>
                                        Сроки (до)
                                    </div>  
                                    <div className={styles.deadline}>
                                        {moment(row.order_deadline).format('DD.MM.YYYY')}
                                    </div>  
                                </div>
                            </div>

                            <div className={styles.addressBlock}>
                                <div className={styles.geoIcon}></div>
                                <div className={styles.address}>{row.address}</div>                                
                            </div>  
                        </div>
                    ))
                ) : (
                    <div className={styles.tableRow}>
                        У вас пока нет откликов
                    </div>
                )}
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
            {tableRows.length ? (
                    tableRows.map(row => (
                        <div className={styles.item} onClick={() => openApplication(row.id, row.work_status)}>                            
                            <div className={styles.kad}>
                                {row.kad_number}
                            </div>

                            <div className={styles.title}>
                                {row.description}
                            </div>
                                                        
                            <div className={styles.flex}>
                                <div className={styles.budgetBlock}>
                                    <div className={styles.budgetText}>
                                        Бюджет
                                    </div>  
                                    <div className={styles.budget}>
                                        {row.price}
                                    </div>  
                                </div>
                                <div className={styles.deadlineBlock}>
                                    <div className={styles.deadlineText}>
                                        Сроки (до)
                                    </div>  
                                    <div className={styles.deadline}>
                                        {moment(row.order_deadline).format('DD.MM.YYYY')}
                                    </div>  
                                </div>
                            </div>

                            <div className={styles.addressBlock}>
                                <div className={styles.geoIcon}></div>
                                <div className={styles.address}>{row.address}</div>                                
                            </div>  
                        </div>
                    ))
                ) : (
                    <div className={styles.tableRow}>
                        У вас пока нет откликов
                    </div>
                )}
        </>
    );
}

export default function ApplicationsTableMobile({ userInfo }) {
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

            <div className={styles.table}>
                {activeTabId === 1 && <MyResponds />}
                {activeTabId === 2 && <MyApplications />}
                {activeTabId === 3 && <MyFavourites />}
            </div>
        </div>
    );
}