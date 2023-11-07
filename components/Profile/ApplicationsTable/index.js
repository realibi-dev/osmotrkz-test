import { useState } from 'react';
import styles from './style.module.css'
import clsx from 'clsx';

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
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Заказ</th>
                        <th>Адрес</th>
                        <th>Сроки (до)</th>
                        <th>Бюджет</th>
                        <th>Статус</th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}