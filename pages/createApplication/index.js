import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { YMaps } from '@pbe/react-yandex-maps';
import clsx from 'clsx';
import Button from '../../components/common/Button';
import axios from 'axios';
import { useRouter } from 'next/router'
import { getCurrentUser } from '../../helpers/user';
import CustomMap from '../../components/common/CustomMap';
import InputMask from 'react-input-mask';
import { BeatLoader } from 'react-spinners';

export default function CreateApplication() {
    const router = useRouter();
    const APPLICATION_TYPES = {
        PUBLIC: 1,
        SELF: 2,
    };

    const [applicationType, setApplicationType] = useState(APPLICATION_TYPES.PUBLIC);
    const [workDescription, setWorkDescription] = useState('');
    const [tz, setTz] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState(0);
    const [objectTypeId, setObjectTypeId] = useState(1);
    const [square, setSquare] = useState(0);
    const [reviewDate, setReviewDate] = useState();
    const [reviewTime, setReviewTime] = useState();
    const [orderDeadline, setOrderDeadline] = useState();
    const [phone, setPhone] = useState();
    const [haveMovableProperty, setHaveMovableProperty] = useState(false);
    const [movablePropertyItems, setMovablePropertyItems] = useState([
        {
            name: '',
            quantity: 0,
            unit: 'Штук',
        }
    ]);
    const [file, setFile] = useState();
    const [kadNumber, setKadNumber] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [cityId, setCityId] = useState();
    const [citiesList, setCitiesList] = useState([]);

    useEffect(() => {
        if (!getCurrentUser()?.id) {
            router.push('/login');
        }
    });

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getAllCities', { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            setCitiesList(response.data.rows);
        })
    }, []);

    const changeMovableProperty = (idx, fieldName, value) => {
        setMovablePropertyItems(prev => prev.map((item, index) => {
            if (index === idx) {
                return {
                    ...item,
                    [fieldName]: value,
                }
            }

            return item;
        }))
    }

    const addMovableProperty = () => {
        setMovablePropertyItems(prev => [...prev, { name: '', quantity: 0, unit: 'Штук' }])
    }

    const removeMovableProperty = idx => {
        const propertyItems = [...movablePropertyItems];
        propertyItems.splice(idx, 1);
        setMovablePropertyItems(propertyItems);
    }

    const createApplicationHandler = async () => {

        const formData = new FormData();
        formData.append("owner_id", getCurrentUser()?.id);
        formData.append("type_id", applicationType);
        formData.append("description", workDescription);
        formData.append("tz", tz);
        formData.append("address", address);
        formData.append("object_type_id", objectTypeId);
        formData.append("square", square);
        formData.append("phone", phone);
        formData.append("is_moving", haveMovableProperty);
        formData.append("doc_photo", file);
        formData.append("kad_number", kadNumber);
        formData.append("movableProperty", haveMovableProperty ? movablePropertyItems.map(item => ({ title: item.name,count: item.quantity,unit: item.unit })) : []);
        formData.append("status_id", applicationType === APPLICATION_TYPES.PUBLIC ? 1 : 4);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("city_id", cityId);

        if (applicationType === APPLICATION_TYPES.PUBLIC) {
            formData.append("review_date", reviewDate);
            formData.append("review_time", reviewTime);
            formData.append("price", price);
            formData.append("order_deadline", orderDeadline);
        }

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'addRequest', formData, { headers: { "Content-Type": "multipart/form-data" } })
        .then(() => {
            if (applicationType === APPLICATION_TYPES.PUBLIC) {
                router.push('/createApplication/public/success');
            } else {
                router.push('/createApplication/private/success');
            }
        })
        .catch(data => alert(data.message))
    }

    const saveCoordinates = (latitude, longitude) => {
        setLatitude(latitude);
        setLongitude(longitude);
    }

    function openPaymentWidgetHandler(priceToPay) {
        if (getCurrentUser().id && latitude !== 0 && longitude !== 0) {
            openPaymentWidget({
                api_key: '8590a7d1-cfb1-41bf-9619-1c333a14f960',
                amount: priceToPay,
                currency: "KZT",
                order_id: Math.round(Math.random() * 100000).toString(),
                description: "description",
                payment_type: "pay",
                payment_method: "ecom",
                items: [{
                    merchant_id: "f523e618-baf9-46a5-b841-3a7d3451aa46",
                    service_id: "b6549f27-2a36-4166-bc94-46f29e026f81",
                    merchant_name: "Merchant name",
                    name: "Example",
                    quantity: 1,
                    amount_one_pcs: priceToPay,
                    amount_sum: priceToPay,
                }],
                user_id: getCurrentUser().id.toString(),
                email: getCurrentUser().email,
                phone: getCurrentUser().phone,
                success_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                failure_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                callback_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                payment_lifetime: 600,
                create_recurrent_profile: false,
                recurrent_profile_lifetime: 0,
                lang: "ru",
                extra_params: {},
                payment_gateway_host: "https://api.onevisionpay.com",
                payment_widget_host: "https://widget.onevisionpay.com",
                test_mode: 1,
            }, 
            (success) => {
                createApplicationHandler();
            },
            (error) => { alert(error) });
        } else {
            alert("Возможно, вы не авторизованы, или не указали координаты на карте")
        }
    }

    return (
        <div className={styles.container}>
            <script src='https://widget.onevisionpay.com' defer></ script>
            <Header />
            <div style={{ padding: '0 10%', boxSizing: 'border-box' }}>
                <h1 className={styles.heading}>Разместите вашу заявку</h1>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading, styles.greenBackground)}>
                        Какого типа заявку вы хотите создать?
                    </div>

                    <div className={styles.flex}>
                        <div style={{ width: '48%', display: 'flex', alignItems: 'flex-start', gap: 10, borderRight: '1px solid #DCE7FE' }}>
                            {/* <input type='radio' id='applicationType' /> */}
                            <input className={applicationType === APPLICATION_TYPES.PUBLIC ? styles.radio_item_checked : styles.radio_item} checked={applicationType === APPLICATION_TYPES.PUBLIC} type={'radio'} onClick={() => setApplicationType(APPLICATION_TYPES.PUBLIC)} />
                            <label for='applicationType' className={styles.label} style={{ display: 'block' }}>
                                Публичная заявка <br/>
                                <span className={styles.labelSub}>
                                    Вашу заявку выполнит один из <br/>
                                    исполнителей платформы
                                </span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <input className={applicationType === APPLICATION_TYPES.SELF ? styles.radio_item_checked : styles.radio_item} checked={applicationType === APPLICATION_TYPES.SELF} type={'radio'} onClick={() => setApplicationType(APPLICATION_TYPES.SELF)} />
                            <label for='applicationType' className={styles.label} style={{ display: 'block' }}>
                                Самостоятельный осмотр <br/>
                                <span className={styles.labelSub}>
                                    Вы создадите заявку для <br/>
                                    самостоятельного осмотра
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading)}>
                        <div className={styles.number_tag}>1</div>
                        <span>Описание</span>
                    </div>

                    {
                        applicationType === APPLICATION_TYPES.PUBLIC && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                    <label>Описание работы</label>
                                    <textarea
                                        rows={4}
                                        placeholder='Дайте краткое описание работы'
                                        className={styles.textArea}
                                        onChange={e => setWorkDescription(e.target.value)}
                                        value={workDescription}
                                    >
                                    </textarea>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                    <label>Техническое задание</label>
                                    <textarea
                                        rows={4}
                                        placeholder='Подробно опишите все условия заказа'
                                        className={styles.textArea}
                                        onChange={e => setTz(e.target.value)}
                                        value={tz}
                                    >
                                    </textarea>
                                </div>
                            </>
                        )
                    }

                    {
                        applicationType === APPLICATION_TYPES.SELF && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                    <label>Описание заявки</label>
                                    <textarea
                                        rows={4}
                                        placeholder='Дайте краткое описание вашей заявки'
                                        className={styles.textArea}
                                        onChange={e => setWorkDescription(e.target.value)}
                                        value={workDescription}
                                    >
                                    </textarea>
                                </div>
                            </>
                        )
                    }
                    
                </div>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading)}>
                        <div className={styles.number_tag}>2</div>
                        <span>Информация об осмотре недвижимости</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                        <label>Адрес</label>
                        <textarea
                            rows={1}
                            placeholder='Адрес места осмотра'
                            className={styles.textArea}
                            onChange={e => setAddress(e.target.value)}
                            value={address}
                        >
                        </textarea>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                        <label>Город</label>
                        <div className={styles.customSelectWrapper}>
                            <select className={clsx(styles.textArea, styles.customSelect)} onChange={e => setCityId(e.target.value)} value={cityId}>
                                {
                                    citiesList.map(city => (
                                        <option value={city.id}>{city.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <YMaps>
                            <CustomMap width={'100%'} height={320} handleClick={saveCoordinates} />
                        </YMaps>
                    </div>

                    {
                        applicationType === APPLICATION_TYPES.PUBLIC && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                    <label>Цена</label>
                                    <textarea
                                        rows={1}
                                        placeholder='Укажите ориентировочную цену на заказ'
                                        className={styles.textArea}
                                        onChange={e => setPrice(e.target.value)}
                                        value={price}
                                    >
                                    </textarea>
                                </div>
                            </>
                        )
                    }
                   

                    <div className={styles.flex}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                            <label>Тип объекта<sup></sup></label>

                            <div className={styles.customSelectWrapper}>
                                <select className={clsx(styles.textArea, styles.customSelect)} onChange={e => setObjectTypeId(e.target.value)} value={objectTypeId}>
                                    <option value={1}>Квартира</option>
                                    <option value={2}>Дом</option>
                                    <option value={3}>Земельный участок</option>
                                    <option value={4}>Коттедж</option>
                                    <option value={5}>Дача</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                            <label>Площадь объекта, м<sup>2</sup></label>
                            <textarea
                                rows={1}
                                placeholder=''
                                className={styles.textArea}
                                onChange={e => setSquare(+e.target.value)}
                                value={square}
                            >
                            </textarea>
                        </div>
                    </div>

                    {
                        applicationType === APPLICATION_TYPES.PUBLIC && (
                            <>
                                <div className={styles.flex}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                        <label>Дата проведения осмотра</label>
                                        {/* <textarea
                                            rows={1}
                                            placeholder=''
                                            className={styles.textArea}
                                        >
                                        </textarea> */}

                                        <div className={styles.customDateInputWrapper}>
                                            <input
                                                type='date'
                                                className={clsx(styles.textArea, styles.customDateInput)}
                                                onChange={e => setReviewDate(e.target.value)}
                                                value={reviewDate}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                        <label>Время проведения осмотра</label>
                                        <input
                                            type='time'
                                            className={clsx(styles.textArea, styles.customTimeInput)}
                                            onChange={e => setReviewTime(e.target.value)}
                                            value={reviewTime}
                                        />
                                    </div>
                                </div>

                                <div className={styles.flex}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                        <label>
                                            Срок исполнения осмотра <br/>
                                            <span className={styles.labelSubSmall}>(до какого числа исполнитель должен сдать работу)</span>
                                        </label>
                                        <div className={styles.customDateInputWrapper}>
                                            <input
                                                type='date'
                                                className={clsx(styles.textArea, styles.customDateInput)}
                                                onChange={e => setOrderDeadline(e.target.value)}
                                                value={orderDeadline}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                        <label>Контакные данные<br/>собственника объекта</label>
                                        <InputMask
                                            placeholder='+7(___)___-__-__'
                                            value={phone}
                                            className={styles.textArea}
                                            type={'text'}
                                            onChange={e => setPhone(e.target.value)}
                                            mask="+7(999)999-99-99"
                                            maskChar="_"
                                            style={{ padding: 17 }}
                                        />
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading)}>
                        <div className={styles.number_tag}>3</div>
                        <span>Движимое имущество</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Имеется ли движимое имущество для осмотра?</span>
                        <input className={styles.checkbox_item} checked={haveMovableProperty} type={'checkbox'} onClick={() => setHaveMovableProperty(!haveMovableProperty)} />
                    </div>
                    
                    <hr className={styles.dividerHr} />
                    <br />

                    {
                        haveMovableProperty && movablePropertyItems.map((movableProperty, idx) => {
                            return (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                ...(movablePropertyItems.length > 1 && { justifyContent: 'space-between' })
                                            }}
                                        >
                                            <label>Наименование</label>
                                            {
                                                movablePropertyItems.length > 1 && (
                                                    <>
                                                        <Button
                                                            type={'text'}
                                                            text={'Удалить'}
                                                            onClick={() => removeMovableProperty(idx)}
                                                            additionalStyles={{ margin: 0, width: 'auto', height: 'auto', color: '#a50000' }}
                                                        />
                                                    </>
                                                )
                                            }
                                        </div>
                                        
                                        <textarea
                                            rows={1}
                                            placeholder=''
                                            className={styles.textArea}
                                            value={movableProperty.name}
                                            onChange={e => changeMovableProperty(idx, 'name', e.target.value)}
                                        >
                                        </textarea>
                                    </div>

                                    <div className={styles.flex}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                            <label>Количество</label>
                                            <textarea
                                                rows={1}
                                                placeholder=''
                                                className={styles.textArea}
                                                value={movableProperty.quantity}
                                                onChange={e => changeMovableProperty(idx, 'quantity', e.target.value)}
                                            >
                                            </textarea>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: '48%' }}>
                                            <label>Единица измерения</label>
                                            <div className={styles.customSelectWrapper}>
                                                <select
                                                    className={clsx(styles.textArea, styles.customSelect)}
                                                    value={movableProperty.unit}
                                                    onChange={e => changeMovableProperty(idx, 'unit', e.target.value)}
                                                >
                                                    <option value={'Штук'}>Штук</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    { movablePropertyItems.length && idx !== movablePropertyItems.length-1 && (
                                        <>
                                            <hr className={styles.dividerHr} />
                                            <br />
                                        </>
                                    ) }

                                    <Button
                                        type={'text'}
                                        text={'Добавить еще позиции'}
                                        onClick={() => addMovableProperty()}
                                        additionalStyles={{}}
                                        disabled={!haveMovableProperty}
                                    />
                                </>
                            )
                        })
                    }
                </div>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading)}>
                        <div className={styles.number_tag}>4</div>
                        <span>Документы</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                        <label>Документы (прикрепите фотографию первой страницы техпаспорта)</label>
                        <label className={styles.custom_file_input}>
                            <input type={'file'} className={clsx(styles.textArea)} onChange={e => setFile(e.target.files[0])} />
                            {
                                file && (
                                    <>
                                        Файл загружен
                                    </>
                                )
                            }
                            {
                                !file && (
                                    <>
                                        <img src='/download.png' width={20} height={20} />
                                        Добавить файл
                                    </>
                                )
                            }
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                        <label>Кадастровый номер строения</label>
                        <textarea
                            rows={1}
                            placeholder='XX : XX : XXXXXX : XX'
                            className={styles.textArea}
                            onChange={e => setKadNumber(e.target.value)}
                            value={kadNumber}
                        >
                        </textarea>
                    </div>
                </div>

                <Button
                    type={'filled'}
                    text={'Опубликовать'}
                    onClick={() => openPaymentWidgetHandler(+price)}
                    additionalStyles={{
                        width: '20%',
                        textAlign: 'center',
                        display: 'block',
                        margin: '0 auto',
                        marginBottom: 80,
                    }}
                />

                <Footer />
            </div>
        </div>
    );
}