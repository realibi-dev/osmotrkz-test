import { useState } from 'react';
import styles from './style.module.css'
import clsx from 'clsx';
import { getCurrentUser } from './../../../helpers/user';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';

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

    return(
        <>
            {tableRows.length && (
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Заказ</th>
                        <th>Адрес</th>
                        <th>Сроки (до)</th>
                        <th>Бюджет</th>
                        <th>Статус</th>
                    </tr>

                    {tableRows.map(row => (
                        <tr className={styles.tableRow} onClick={() => router.push('/publishedApplications/' + row.id)}>
                            <td className={styles.tableRowCell}>{row.kad_number}</td>
                            <td className={styles.tableRowCell}>{row.description}</td>
                            <td className={styles.tableRowCell}>{row.address}</td>
                            <td className={styles.tableRowCell}>{moment(row.order_deadline).format('DD.MM.YYYY')} <br/> (с {row.review_time.split(':').slice(0, 2).join(':')})</td>
                            <td className={styles.tableRowCell}>{parseFloat(row.price)}т</td>
                            <td className={styles.tableRowCell}>Опубликован</td>
                        </tr>
                    ))}
                </tbody>
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
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Заказ</th>
                        <th>Адрес</th>
                        <th>Сроки (до)</th>
                        <th>Бюджет</th>
                    </tr>

                    {tableRows.map(row => (
                        <tr className={styles.tableRow} onClick={() => router.push('/publishedApplications/' + row.id)}>
                            <td className={styles.tableRowCell}>{row.kad_number}</td>
                            <td className={styles.tableRowCell}>{row.description}</td>
                            <td className={styles.tableRowCell}>{row.address}</td>
                            <td className={styles.tableRowCell}>{moment(row.order_deadline).format('DD.MM.YYYY')} <br/> (с {row.review_time.split(':').slice(0, 2).join(':')})</td>
                            <td className={styles.tableRowCell}>{parseFloat(row.price)}т</td>
                        </tr>
                    ))}
                </tbody>
            ): null}
        </>
    );
}

export default function ApplicationsTable({ userInfo }) {
    const tabs = [
        { id: 1, title: 'Мои отклики' },
        { id: 2, title: 'Мои заявки' },
        { id: 3, title: 'Избранные' },
    ]

    const [tableRows, setTableRows] = useState([]);
    const [activeTabId, setActiveTabId] = useState(1);

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
                {activeTabId === 2 && <MyApplications />}
                {activeTabId === 3 && <MyFavourites />}
            </table>
        </div>
    );
}