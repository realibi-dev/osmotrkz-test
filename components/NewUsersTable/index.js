import styles from './style.module.css';
import Button from '../common/Button';
import axios from 'axios';
import clsx from 'clsx';

export default function NewUsersTable({ users, fetchUsers, activateAccount }) {
    const STATUS_NAMES = {
        1: 'Юр. лицо',
        2: 'Физ. лицо',
    };
    const ROLE_NAMES = {
        1: 'Заказчик',
        2: 'Исполнитель',
    }

    return (
        <table className={styles.table}>
            <tbody>
                <tr className={clsx(styles.header, styles.border_top_left)}>
                    <th className={styles.border_top_left}>ФИО</th>
                    <th>ФИО (ЭЦП)</th>
                    <th>Email</th>
                    <th>Email (ЭЦП)</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th className={styles.border_top_right}>Действие</th>
                </tr>
                {users?.map((user, index) => (
                    <tr className={styles.dataRow}>
                        <td className={ index === users.length-1 && styles.border_bottom_left }>{user.fio}</td>
                        <td>{user.fio_from_ecp}</td>
                        <td>{user.email}</td>
                        <td>{user.email_from_ecp}</td>
                        <td>{user.phone}</td>
                        <td>{ROLE_NAMES[user.role_id]}</td>
                        <td>{STATUS_NAMES[user.status_id]}</td>
                        <td className={ index === users.length-1 && styles.border_bottom_right }>
                            {
                                !user.is_active && (
                                    <Button
                                        additionalStyles={{
                                            fontSize: 12,
                                        }}
                                        type={'text'}
                                        text={'Принять'}
                                        onClick={() => activateAccount(user.id)}
                                    />
                                )
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}