import { useEffect, useState } from 'react';
import styles from './style.module.css'
import clsx from 'clsx';
import axios from 'axios';
import { useRouter } from 'next/router';
import moment from 'moment';
import { getCurrentUser } from './../../../helpers/user';
import { useMediaQuery } from 'react-responsive';

function TableRow({ data, favourites }) {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const router = useRouter();
    const [isFavourite, setIsFavourite] = useState(false);
    
    useEffect(() => {
        setIsFavourite(favourites.find(item => item.request_id === data.id));
    }, [])

    const types = {
        1: 'Квартира',
        2: 'Дом',
        3: 'Земельный участок',
        4: 'Коттедж',
        5: 'Дача',
    }

    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {data.kad_number}
            </td>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {data.description}
            </td>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {types[data.object_type_id]}
            </td>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {data.address}
            </td>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {moment(data.order_deadline).format('DD.MM.YYYY')} <br/> (с {data.review_time.split(':').slice(0, 2).join(':')})
            </td>
            <td className={styles.tableRowCell} onClick={() => router.push('/publishedApplications/' + data.id)}>
                {data.price}т
            </td>
            <td className={clsx(styles.tableRowCell, styles.center)}>
                <div
                    style={{
                        width: 20,
                        height: 20,
                        margin: '0 auto',
                        backgroundImage: `url(${isFavourite ? 'heart-clicked.png' : '/heart-non-clicked.png'})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                    }}
                    onClick={() => {
                        if (isFavourite) {
                            axios
                            .delete(process.env.NEXT_PUBLIC_API_URL + `removeFromFavorites/${getCurrentUser().id}/${data.id}`)
                            .then(response => {
                                console.log(response.data);
                            })

                            setIsFavourite(false);
                        } else {
                            axios
                            .post(process.env.NEXT_PUBLIC_API_URL + 'addToFavorites', { person_id: getCurrentUser().id, request_id: data.id })
                            .then(response => {
                                console.log(response.data);
                            })

                            setIsFavourite(true);
                        }
                    }}
                >
                </div>
            </td>

        </tr>
    );
}

export default function PublishedApplicationsTable({}) {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [allApplications, setAllApplications] = useState();
    const [tableRows, setTableRows] = useState([]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [sortingMethod, setSortingMethod] = useState(0);
    const [filterCity, setFilterCity] = useState(0);
    const [filterType, setFilterType] = useState(0);
    const [citiesList, setCitiesList] = useState([]);
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        if (getCurrentUser()?.id) {
            axios
            .get(process.env.NEXT_PUBLIC_API_URL + 'getFavorites/' + getCurrentUser()?.id, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
            .then(response => {
                if(response.data.success) {
                    setFavourites(response.data.favorites);
                }
            })
        }
    }, []);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllCities', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            setCitiesList(response.data.rows);
        })
    }, []);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllRequests', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            if (response.data?.success) {
                setTableRows(response.data.requests.filter(item => item.type_id == 1));
                setAllApplications(response.data.requests.filter(item => item.type_id == 1));
            }
        })
        .catch(error => alert("Ошибка при загрузке заявок"))
    }, []);

    const filter = () => {
        let items = [...allApplications];
        if (sortingMethod != 0) {
            if (sortingMethod === 'date') {
                items = items.sort((a, b) => {
                    return Number(new Date(a.order_deadline)) - Number(new Date(b.order_deadline));
                });
            } else if (sortingMethod === 'budget') {
                items = items.sort((a, b) => {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
            }
        }

        if (filterCity != 0) {
            items = items.filter(item => item.city_id == filterCity);
        }

        if (filterType != 0) {
            items = items.filter(item => item.object_type_id == filterType);
        }

        setTableRows(items);
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.dropdowns}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: isMobile ? 20 : 0,
                    flexDirection: isMobile ? 'column' : 'gap',
                }}
            >

                <div className={styles.customSelectWrapper}>
                    <select className={clsx(styles.textArea, styles.customSelect)} style={{ width: '100%' }} onChange={e => setSortingMethod(e.target.value)}>
                        <option value={0}>Сортировка</option>
                        <option value={'date'}>По дате</option>
                        <option value={'budget'}>По бюджету</option>
                    </select>
                </div>

                <div className={styles.customSelectWrapper}>
                    <select className={clsx(styles.textArea, styles.customSelect)} style={{ width: '100%' }} onChange={e => setFilterCity(e.target.value)}>
                        <option value={0}>Все города</option>
                        {
                            citiesList.map(city => (<option value={city.id}>{city.name}</option>))
                        }
                    </select>
                </div>

                <div className={styles.customSelectWrapper}>
                    <select className={clsx(styles.textArea, styles.customSelect)} style={{ width: '100%' }} onChange={e => setFilterType(e.target.value)}>
                        <option value={0}>Тип объекта</option>
                        <option value={1}>Квартира</option>
                        <option value={2}>Дом</option>
                        <option value={3}>Земельный участок</option>
                        <option value={4}>Коттедж</option>
                        <option value={5}>Дача</option>
                    </select>
                </div>

                <button className={styles.button} onClick={() => filter()}>Найти</button>
            </div>
            
            {
                tableRows?.length ? (
                    <table className={styles.table}>
                        <tbody>
                            <tr className={styles.tableHeadRow}>
                                <th>№</th>
                                <th>Заказ</th>
                                <th>Тип</th>
                                <th>Адрес</th>
                                <th>Сроки (до)</th>
                                <th>Бюджет</th>
                                <th>Избранное</th>
                            </tr>
                            {
                                tableRows.map(row => (<TableRow favourites={favourites} data={row} />))
                            }
                        </tbody>
                    </table>
                ) : null
            }
        </div>
    );
}