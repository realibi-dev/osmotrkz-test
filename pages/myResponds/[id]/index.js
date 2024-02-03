import styles from './style.module.css'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer';
import Button from '../../../components/common/Button';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { getCurrentUser } from '../../../helpers/user';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import clsx from 'clsx';
import ClickAwayListener from 'react-click-away-listener';
import { useMediaQuery } from 'react-responsive';

export default function RespondApplication() {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const router = useRouter()
    const applicationId = router.query.id;
    const [applicationInfo, setApplicationInfo] = useState();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const [respondFinishDate, setRespondFinishDate] = useState('');

    const [responseId, setResponseId] = useState();

    const types = {
        1: 'Квартира',
        2: 'Земельный участок',
        3: 'Коттедж',
        4: 'Частный дом',
        5: 'Магазин',
        6: 'СТО',
        7: 'Производственная база',
        8: 'Административно-бытовой комплекс',
        9: 'Торговый дом',
    }

    useEffect(() => {
        if (getCurrentUser()?.id) {
            if (applicationId){                
                axios
                .get(process.env.NEXT_PUBLIC_API_URL + 'getFavorites/' + getCurrentUser().id, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
                .then(response => {
                    if(response.data.success) {
                        const favourites = response.data.favorites;
                        setIsFavourite(favourites.find(item => item.id == applicationId));
                    }
                })
            }
            
        }
    }, [applicationId]);

    useEffect(() => {
        if (applicationId){
            axios
            .get(process.env.NEXT_PUBLIC_API_URL + 'getAllRequests', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
            .then(response => {
                if (response.data?.success) {
                    const applications = response.data.requests;
                    setApplicationInfo(applications.find(app => app.id === +applicationId));
                }
            })
            .catch(error => alert("Ошибка при загрузке заявок"))
        }
        
    }, [applicationId]);

    // useEffect(() => {
    //     const currentUser = getCurrentUser();
    //     if (applicationId) {
    //         axios
    //         .get(process.env.NEXT_PUBLIC_API_URL + 'getResponsesForOrder/' + applicationId, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
    //         .then(response => {
    //             setResponseId(response?.data?.userRequests.find(item => item.owner_id == currentUser.id).id);
    //             console.log("asd", response?.data?.userRequests.find(item => item.owner_id == currentUser.id).id);
    //         })
    //         .catch(error => alert("Ошибка при загрузке заявок"))
    //     }
    // }, [applicationId]);

    const respondToApplication = () => {
        setIsResponding(true);
    }

    return (
        applicationInfo && (
            <div className={styles.container} style={{ background: isResponding ? 'rgba(255, 255, 255, 0.2)' : '' }}>
                {/* <Head>
                    <meta httpEquiv="Content-Security-Policy" content={'frame-ancestors https://api.onevisionpay.com'} /> 
                </Head> */}
                <script src='https://widget.onevisionpay.com' defer></ script>
                <Header />

                <div
                    style={{
                        padding: isMobile ? '0 8%' : '0 15%',
                        boxSizing: 'border-box',
                        marginTop: 50,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 20,
                            color: '#3F444A',
                            fontFamily: 'Nunito_Sans',
                            marginBottom: 30,
                        }}
                    >
                        <span>
                            <Link href={'/profile'}>Мои отклики</Link>
                        </span>
                        <span>
                            <img src={'/arrow-right.png'} width={7} height={10} />
                        </span>
                        <span>Заказ № {applicationId}</span>
                    </div>

                    {
                        applicationInfo && applicationInfo.type_id == 2 && (
                            <div className={styles.info_container}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 30,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10,
                                            width: '60%',
                                        }}
                                    >
                                        <span className={styles.title}>{applicationInfo.description}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 46 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <span
                                            style={{
                                                color: '#09C18A',
                                                fontSize: 22,
                                            }}
                                        >
                                            Информация об объекте
                                        </span>
                                        <div style={{ display: 'flex', gap: 36 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Тип объекта</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{types[applicationInfo.object_type_id]}<sup></sup></span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Площадь объекта</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{applicationInfo.square} м<sup>2</sup></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: isMobile ? 40 : 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <span
                                            style={{
                                                color: '#09C18A',
                                                fontSize: 22,
                                            }}
                                        >
                                            Документы
                                        </span>
                                        <div style={{ display: 'flex', gap: 20 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Кадастровый номер</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{applicationInfo.kad_number}<sup></sup></span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Техпаспорт</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>
                                                    <img src='/document.png' width={20} height={20} style={{ marginRight: 10 }} />
                                                    {applicationInfo.doc_photo}<sup></sup>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 10, color: '#3F444A', fontSize: 18, fontWeight: 600 }}>
                                    Адрес: <span style={{ fontWeight: 400 }}>{applicationInfo.address}</span>
                                </div>

                                <YMaps>
                                    <Map
                                    width={'100%'}
                                        defaultState={{
                                            center: applicationInfo.latitude ? [applicationInfo.latitude, applicationInfo.longitude] : [51.1801, 71.446],
                                            zoom: applicationInfo.latitude ? 17 : 10,
                                            controls: ['zoomControl'],
                                        }}
                                        modules={['control.ZoomControl']}
                                    >
                                        {applicationInfo.latitude && (<Placemark defaultGeometry={[applicationInfo.latitude, applicationInfo.longitude]} />)}
                                    </Map>
                                </YMaps>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginTop: 42,
                                }}>
                                    <span style={{
                                        textAlign: 'center',
                                        color: '#50575E',
                                        fontSize: 14,
                                        lineHeight: '135%',
                                    }}>
                                        Для того чтобы приступить к выполнению заказа <br />
                                        необходимо скачать мобильное приложение
                                    </span>

                                    <div style={{ flexDirection: isMobile ? 'column' : 'row', display: 'flex', gap: 20, marginTop: 20 }}>
                                        <Button
                                            // type={'text'}
                                            text={'Отменить'}
                                            onClick={() => {}}
                                            additionalStyles={{
                                                width: 210,
                                                height: 50,
                                                backgroundColor: '#fff',
                                                border: '1px solid #94A3B8',
                                                fontSize: 16,
                                                color: '#94A3B8',
                                            }}
                                        />
                                        <Button
                                            type={'filled'}
                                            text={'Перейти в приложение'}
                                            onClick={() => {}}
                                            additionalStyles={{
                                                width: 210,
                                                height: 50,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    
                    {
                        applicationInfo && applicationInfo.type_id == 1 && (
                            <div className={styles.info_container}>
                                <div className={styles.header} style={{ display: 'flex' }}>
                                    <div className={styles.userInfo}>
                                        <div
                                            className={styles.userAvatar}
                                            style={{
                                                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}file/${applicationInfo?.owner?.avatar || '/application_profile.png'})`,
                                            }}
                                        >
                                        </div>
                                        <div className={styles.userName}>
                                            {applicationInfo.owner?.fio}
                                        </div>
                                    </div>
                                    <div
                                        className={styles.favouriteButton}
                                        style={{ backgroundImage: `url(${isFavourite ? '/heart-clicked.png' : '/heart-non-clicked.png'})` }}
                                        onClick={() => {
                                            if (isFavourite) {
                                                axios
                                                .delete(process.env.NEXT_PUBLIC_API_URL + `removeFromFavorites/${getCurrentUser().id}/${applicationInfo.id}`)
                                                .then(response => {
                                                    console.log(response.data);
                                                })
                    
                                                setIsFavourite(false);
                                            } else {
                                                axios
                                                .post(process.env.NEXT_PUBLIC_API_URL + 'addToFavorites', { person_id: getCurrentUser().id, request_id: applicationInfo.id })
                                                .then(response => {
                                                    console.log(response.data);
                                                })
                    
                                                setIsFavourite(true);
                                            }
                                        }}
                                    >

                                    </div>
                                </div>
                                
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 40,
                                        flexDirection: isMobile ? 'column' : 'row',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10,
                                            width: isMobile ? '100%' : '60%',
                                        }}
                                    >
                                        <span className={styles.title}>{applicationInfo.description}</span>
                                        <span style={{ color: '#3F444A' }}>{applicationInfo.tz}</span>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            padding: '12px 15px',
                                            borderRadius: 16,
                                            border: '1px solid #92E3A9',
                                            flexDirection: 'column',
                                            width: isMobile ? '100%' : '24%',
                                            color: '#3F444A',
                                            marginTop: isMobile ? 60 : 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: 600 }}>Бюджет</span>
                                        <span style={{ color: '#50575E' }}>{parseFloat(applicationInfo.price)} т</span>
                                        <br />
                                        <span style={{ fontWeight: 600 }}>Срок исполнения</span>
                                        <span style={{ color: '#50575E' }}>{moment(applicationInfo.order_deadline).format('DD.MM.YYYY')}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 46 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <span
                                            style={{
                                                color: '#3F444A',
                                                fontSize: 26,
                                            }}
                                        >
                                            Информация об <br /> объекте
                                        </span>
                                        <div style={{ display: 'flex', gap: 36, flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Тип объекта</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{types[applicationInfo.object_type_id]}<sup></sup></span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Площадь объекта</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{applicationInfo.square} м<sup>2</sup></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: '#94A3B8',
                                        width: 1,
                                        height: 'auto',
                                        marginTop: isMobile ? 60 : 0,
                                    }}></div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <span
                                            style={{
                                                color: '#3F444A',
                                                fontSize: 26,
                                            }}
                                        >
                                            Сроки осмотра
                                        </span>
                                        <div style={{ display: 'flex', gap: 36, flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Дата проведения<br/>осмотра</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{ moment(applicationInfo.order_deadline).isValid() ? moment(applicationInfo.order_deadline).format('DD.MM.YYYY') : "Дата не указана"}<sup></sup></span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Время проведения<br/>осмотра</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>С {applicationInfo?.review_time_from ? applicationInfo?.review_time_from?.split(':').slice(0,2).join(':') : ""} До {applicationInfo?.review_time_to ? applicationInfo?.review_time_to?.split(':').slice(0,2).join(':') : ""}<sup></sup></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: '#94A3B8',
                                        width: 1,
                                        height: 'auto',
                                        marginTop: isMobile ? 60 : 0,
                                    }}></div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <span
                                            style={{
                                                color: '#3F444A',
                                                fontSize: 26,
                                            }}
                                        >
                                            Документы
                                        </span>
                                        <div style={{ display: 'flex', gap: 36, flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Техпаспорт</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>
                                                    <img src='/document.png' width={20} height={20} style={{ marginRight: 10 }} />
                                                    {applicationInfo.doc_photo}<sup></sup>
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Кадастровый номер строения</span>
                                                <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{applicationInfo.kad_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 10, color: '#3F444A', fontSize: 18, fontWeight: 600 }}>
                                    Адрес: <span style={{ fontWeight: 400 }}>{applicationInfo.address}</span>
                                </div>

                                <YMaps>
                                    <Map
                                    width={'100%'}
                                        defaultState={{
                                            center: applicationInfo.latitude ? [applicationInfo.latitude, applicationInfo.longitude] : [51.1801, 71.446],
                                            zoom: applicationInfo.latitude ? 17 : 10,
                                            controls: ['zoomControl'],
                                        }}
                                        modules={['control.ZoomControl']}
                                    >
                                        {applicationInfo.latitude && (<Placemark defaultGeometry={[applicationInfo.latitude, applicationInfo.longitude]} />)}
                                    </Map>
                                </YMaps>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginTop: 42,
                                }}>
                                    <span style={{
                                        textAlign: 'center',
                                        color: '#50575E',
                                        fontSize: 14,
                                        lineHeight: '135%',
                                    }}>
                                        Для того чтобы приступить к выполнению заказа <br />
                                        необходимо скачать мобильное приложение
                                    </span>

                                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 20, marginTop: 20 }}>
                                        <Button
                                            // type={'text'}
                                            text={'Отменить'}
                                            // onClick={() => respondToApplication()}
                                            onClick={() => {
                                                axios
                                                .post(process.env.NEXT_PUBLIC_API_URL + 'rejectResponse', { id: + responseId })
                                                .then(({ data }) => {
                                                    if (data.success) {
                                                        alert("Вы отказались от этой заявки. Заявка вернется в список опубликованных заявок.");
                                                        router.push("/publishedApplications");
                                                    } else {
                                                        alert("Что-то пошло нетак!");
                                                    }
                                                })
                                                .catch(data => {
                                                    alert(data.message);
                                                })
                                            }}
                                            additionalStyles={{
                                                width: 210,
                                                height: 50,
                                                backgroundColor: '#fff',
                                                border: '1px solid #94A3B8',
                                                fontSize: 16,
                                                color: '#94A3B8',
                                            }}
                                        />
                                        <Button
                                            type={'filled'}
                                            text={'Перейти в приложение'}
                                            // onClick={() => respondToApplication()}
                                            onClick={() => {}}
                                            additionalStyles={{
                                                width: 210,
                                                height: 50,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    
                </div>

                <div style={{
                    padding: '0 15%',
                    marginTop: 60,
                }}>
                    <Footer />
                </div>

                {isResponding && (
                    <div className={styles.popupBack}>
                        <ClickAwayListener onClickAway={() => setIsResponding(false)}>
                            <div className={styles.popup} style={{ color: '#3F444A', textAlign: 'center' }}>
                                <div style={{ textAlign: 'center', fontSize: 22 }}>{applicationInfo?.description}</div>
                                <div style={{
                                    width: '40%',
                                    margin: '25px auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                }}>
                                    <div>Срок исполнения</div>
                                    <div className={styles.customDateInputWrapper}>
                                        <input
                                            type='date'
                                            className={clsx(styles.textArea, styles.customDateInput)}
                                            onChange={e => setRespondFinishDate(e.target.value)}
                                            value={respondFinishDate}
                                        />
                                    </div>
                                </div>

                                <Button
                                    text={'Откликнуться'}
                                    type={'filled'}
                                    additionalStyles={{ width: 300 }}
                                />
                            </div>
                        </ClickAwayListener>
                    </div>
                )}
            </div>
        )
    );
}