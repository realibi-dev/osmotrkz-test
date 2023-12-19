import styles from './style.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/common/Button';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { getCurrentUser } from '../../helpers/user';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function PublishedApplication() {
    const router = useRouter()
    const applicationId = router.query.id;
    const [applicationInfo, setApplicationInfo] = useState();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isResponding, setIsResponding] = useState(false);

    const types = {
        1: 'Квартира',
        2: 'Дом',
        3: 'Земельный участок',
        4: 'Коттедж',
        5: 'Дача',
    }

    useEffect(() => {
        if (getCurrentUser()?.id) {
            axios
            .get(process.env.NEXT_PUBLIC_API_URL + 'getFavorites/' + getCurrentUser().id, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
            .then(response => {
                if(response.data.success) {
                    const favourites = response.data.favorites;
                    setIsFavourite(favourites.find(item => item.request_id == applicationId));
                }
            })
        }
    }, []);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllRequests', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            if (response.data?.success) {
                const applications = response.data.requests;
                setApplicationInfo(applications.find(app => app.id === +applicationId));
            }
        })
        .catch(error => alert("Ошибка при загрузке заявок"))
    }, []);

    function openPaymentWidgetHandler() {
        openPaymentWidget({
            api_key: '8590a7d1-cfb1-41bf-9619-1c333a14f960',
            amount: 10,
            currency: "KZT",
            order_id: Math.round(Math.random() * 100000).toString(),
            description: "description",
            payment_type: "pay",
            payment_method: "ecom",
            items: [{
                merchant_id: "f523e618-baf9-46a5-b841-3a7d3451aa46",
                service_id: "b6549f27-2a36-4166-bc94-46f29e026f81",
                merchant_name: "Alibi",
                name: "Example",
                quantity: 1,
                amount_one_pcs: 10,
                amount_sum: 10,
            }],
            user_id: "1",
            email: "realibi.dev@gmail.com",
            phone: "+77774055190",
            success_url: "https://google.com",
            failure_url: "https://youtube.com",
            callback_url: "https://gmail.com",
            payment_lifetime: 600,
            create_recurrent_profile: false,
            recurrent_profile_lifetime: 0,
            lang: "ru",
            extra_params: {},
            payment_gateway_host: "https://api.onevisionpay.com",
            payment_widget_host: "https://widget.onevisionpay.com"
        }, 
        (success) => {alert("uspeh")},
        (error) => {alert("oshibka")});
    }

    const respondToApplication = () => {
        setIsResponding(true);
    }

    return (
        <div className={styles.container} style={{ background: isResponding ? 'rgba(255, 255, 255, 0.2)' : '' }}>
            {/* <Head>
                <meta httpEquiv="Content-Security-Policy" content={'frame-ancestors https://api.onevisionpay.com'} /> 
            </Head> */}
            <script src='https://widget.onevisionpay.com' defer></ script>
            <Header />

            <div
                style={{
                    padding: '0 15%',
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
                        <Link href={'/publishedApplications'}>Опубликованные заявки</Link>
                    </span>
                    <span>
                        <img src={'/arrow-right.png'} width={7} height={10} />
                    </span>
                    <span>Заказ № {applicationId}</span>
                </div>

                {
                    applicationInfo && (
                        <div className={styles.info_container}>
                            <div className={styles.header} style={{ display: 'flex' }}>
                                <div className={styles.userInfo}>
                                    <div
                                        className={styles.userAvatar}
                                        style={{
                                            backgroundImage: `url(${applicationInfo.owner?.avatar || '/application_profile.png'})`,
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
                                    <span style={{ color: '#3F444A' }}>{applicationInfo.tz}</span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '12px 15px',
                                        borderRadius: 16,
                                        border: '1px solid #92E3A9',
                                        flexDirection: 'column',
                                        width: '24%',
                                        color: '#3F444A',
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>Бюджет</span>
                                    <span style={{ color: '#50575E' }}>{parseFloat(applicationInfo.price)} т</span>
                                    <br />
                                    <span style={{ fontWeight: 600 }}>Срок исполнения</span>
                                    <span style={{ color: '#50575E' }}>{moment(applicationInfo.order_deadline).format('DD.MM.YYYY')}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 100, marginBottom: 46 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <span
                                        style={{
                                            color: '#3F444A',
                                            fontSize: 26,
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

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <span
                                        style={{
                                            color: '#3F444A',
                                            fontSize: 26,
                                        }}
                                    >
                                        Сроки осмотра
                                    </span>
                                    <div style={{ display: 'flex', gap: 36 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Дата проведения<br/>осмотра</span>
                                            <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{moment(applicationInfo.review_date).format('DD.MM.YYYY')}<sup></sup></span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#3F444A', fontSize: 14, fontWeight: 400, lineHeight: '14px' }}>Время проведения<br/>осмотра</span>
                                            <span style={{ color: '#50575E', fontSize: 16, fontWeight: 600 }}>{applicationInfo.review_time.split(':').slice(0,2).join(':')}<sup></sup></span>
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

                            <div style={{ textAlign: 'right', marginTop: 40 }}>
                                <Button
                                    type={'filled'}
                                    text={'Отликнуться'}
                                    // onClick={() => respondToApplication()}
                                    onClick={() => openPaymentWidgetHandler()}
                                    additionalStyles={{
                                        width: 340,
                                        height: 50,
                                    }}
                                />
                            </div>
                        </div>
                    )
                }
                

                {/* <Button
                    type={'text'}
                    text={'Создать'}
                    onClick={() => { openPaymentWidgetHandler() }}
                />

                <Footer /> */}
            </div>

            <div style={{
                padding: '0 15%',
                marginTop: 60,
            }}>
                <Footer />
            </div>

            {isResponding && (
                <>
                    <div className={styles.popup}>

                    </div>
                </>
            )}
        </div>
    );
}