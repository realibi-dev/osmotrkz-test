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
import { useMediaQuery } from 'react-responsive';
import MapWithSearch from '../../components/common/MapWithSearch';

export default function CreateApplication() {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
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
    const [reviewTimeStart, setReviewTimeStart] = useState();
    const [reviewTimeFinish, setReviewTimeFinish] = useState();
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
    const [documents, setDocuments] = useState([
        {
            tehpassport: '',
            kad_number: '',
        }
    ]);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [cityId, setCityId] = useState();
    const [citiesList, setCitiesList] = useState([]);
    const [isPerformer, setisPerformer] = useState(true);

    useEffect(() => {
        if (!getCurrentUser()?.id) {
            router.push('/login');
        } else {
            setisPerformer(getCurrentUser()?.role_id === 2);
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

    const changeDocuments = (idx, fieldName, value) => {
        setDocuments(prev => prev.map((item, index) => {
            if (index === idx) {
                return {
                    ...item,
                    [fieldName]: value,
                }
            }

            return item;
        }))
    }

    const addDocument = () => {
        setDocuments(prev => [...prev, { tehpassport: '', kad_number: '' }])
    }

    const removeDocument = idx => {
        const documentItems = [...documents];
        documentItems.splice(idx, 1);
        setDocuments(documentItems);
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
        formData.append("tehpassports", JSON.stringify(documents));
        formData.append("movableProperty", haveMovableProperty ? JSON.stringify(movablePropertyItems.map(item => ({ title: item.name,count: item.quantity,unit: item.unit }))) : []);
        formData.append("status_id", applicationType === APPLICATION_TYPES.PUBLIC ? 1 : 4);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("city_id", cityId);

        if (applicationType === APPLICATION_TYPES.PUBLIC) {
            formData.append("review_time_from", reviewTimeStart);
            formData.append("review_time_to", reviewTimeFinish);
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

    function loadPaymentScript(src, attempts) {
        if (attempts <= 0) return; // Остановить попытки, если достигнут лимит
    
        var script = document.createElement('script');
        script.src = src;
        script.defer = true;
    
        script.onload = () => {
        console.log('Скрипт успешно загружен');
        };
    
        script.onerror = () => {
        console.error('Ошибка при загрузке скрипта, пытаемся еще раз');
        // Повторная попытка с уменьшением количества оставшихся попыток
        loadPaymentScript(src, attempts - 1);
        };
    
        document.head.appendChild(script);
    }

    useEffect(() => {
        loadPaymentScript('https://widget.onevisionpay.com', 5);
    }, []);            

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
                // success_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                // failure_url: "https://osmotrkz.vercel.app/createApplication/public/success",
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

                    {
                        isPerformer ? (
                            <div className={styles.flex}>
                                <div style={{ width: isMobile ? '100%' : '48%', display: 'flex', alignItems: 'flex-start', gap: 10, borderRight: isMobile ? 'none' : '1px solid #DCE7FE' }}>
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
                        ) : (
                            <div className={styles.flex}>
                                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    {/* <input type='radio' id='applicationType' /> */}
                                    <input className={applicationType === APPLICATION_TYPES.PUBLIC ? styles.radio_item_checked : styles.radio_item} checked={applicationType === APPLICATION_TYPES.PUBLIC} type={'radio'} onClick={() => setApplicationType(APPLICATION_TYPES.PUBLIC)} />
                                    <label for='applicationType' className={styles.label} style={{ display: 'block' }}>
                                        Публичная заявка <br/>
                                        <span className={styles.labelSub}>
                                            Вашу заявку выполнит один из
                                            исполнителей платформы
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    }

                    
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
                        {/* <YMaps>
                            <CustomMap width={'100%'} height={320} handleClick={saveCoordinates} />                             
                        </YMaps> */}
                        <MapWithSearch apiKey={process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY} suggestApiKey={process.env.NEXT_PUBLIC_YANDEX_SUGGESTION_KEY}/>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
                            <label>Тип объекта<sup></sup></label>

                            <div className={styles.customSelectWrapper}>
                                <select className={clsx(styles.textArea, styles.customSelect)} onChange={e => setObjectTypeId(e.target.value)} value={objectTypeId}>
                                    <option value={1}>Квартира</option>
                                    <option value={2}>Земельный участок</option>
                                    <option value={3}>Коттедж</option>
                                    <option value={4}>Частный дом</option>
                                    <option value={5}>Магазин</option>
                                    <option value={6}>СТО</option>
                                    <option value={7}>Производственная база</option>
                                    <option value={8}>Административно-бытовой комплекс</option>
                                    <option value={9}>Торговый дом</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
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
                                <div>

                                </div>

                                <div className={styles.flex}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
                                        <label>Время проведения осмотра (C)</label>
                                        <input
                                            type='time'
                                            className={clsx(styles.textArea, styles.customTimeInput)}
                                            onChange={e => setReviewTimeStart(e.target.value)}
                                            value={reviewTimeStart}
                                            max={'16:00'}
                                            min={'09:00'}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
                                        <label>Время проведения осмотра (До)</label>
                                        <input
                                            type='time'
                                            className={clsx(styles.textArea, styles.customTimeInput)}
                                            onChange={e => setReviewTimeFinish(e.target.value)}
                                            value={reviewTimeFinish}
                                            max={'16:00'}
                                            min={'09:00'}
                                        />
                                    </div>
                                </div>
                                

                                <div className={styles.flex}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
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

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25, width: isMobile ? '100%' : '48%' }}>
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
                                                    <option value={'Литры'}>Литры</option>
                                                    <option value={'Метры'}>Метры</option>
                                                    <option value={'Киллограм'}>Киллограм</option>
                                                    <option value={'Ватты'}>Ватты</option>
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
                                </>
                            )
                        })
                    }

                    {
                        haveMovableProperty && (
                            <Button
                                type={'text'}
                                text={'Добавить еще позиции'}
                                onClick={() => addMovableProperty()}
                                additionalStyles={{}}
                                disabled={!haveMovableProperty}
                            />
                        )
                    }
                    
                </div>

                <div className={styles.formsContainer}>
                    <div className={clsx(styles.formHeading)}>
                        <div className={styles.number_tag}>4</div>
                        <span>Документы</span>
                    </div>

                    {
                        documents.map((document, idx) => (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            ...(movablePropertyItems.length > 1 && { justifyContent: 'space-between' })
                                        }}
                                    >
                                        <label>Документы (прикрепите фотографию первой страницы техпаспорта)</label>
                                        {
                                            documents.length > 1 && (
                                                <>
                                                    <Button
                                                        type={'text'}
                                                        text={'Удалить'}
                                                        onClick={() => removeDocument(idx)}
                                                        additionalStyles={{ margin: 0, width: 'auto', height: 'auto', color: '#a50000' }}
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                    <label className={styles.custom_file_input}>
                                        <input type={'file'} className={clsx(styles.textArea)} onChange={e => changeDocuments(idx, 'tehpassport', e.target.files[0])} />
                                        {
                                            document.tehpassport && (
                                                <>
                                                    <img src='/tick.png' width={20} height={20} />
                                                    Файл загружен
                                                    {/* <div className={styles.file_loaded_icon}></div> */}
                                                </>
                                            )
                                        }
                                        {
                                            !document.tehpassport && (
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
                                        onChange={e => changeDocuments(idx, 'kad_number', e.target.value)}
                                        value={document.kad_number}
                                    >
                                    </textarea>
                                </div>

                                { documents.length && idx !== documents.length-1 && (
                                    <>
                                        <hr className={styles.dividerHr} />
                                        <br />
                                    </>
                                ) }
                            </>
                        ))
                    }
                    
                    <Button
                        type={'text'}
                        text={'Добавить еще документ'}
                        onClick={() => addDocument()}
                        additionalStyles={{}}
                    />
                   
                </div>

                <Button
                    type={'filled'}
                    text={'Опубликовать'}
                    onClick={() => openPaymentWidgetHandler(+price)}
                    additionalStyles={{
                        width: isMobile ? '100%' : '20%',
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