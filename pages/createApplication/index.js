import { useEffect, useState } from 'react';
import styles from './style.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import clsx from 'clsx';
import Button from '../../components/common/Button';
import axios from 'axios';
import { useRouter } from 'next/router'
import { getCurrentUser } from '../../helpers/user';

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

    useEffect(() => {
        if (!getCurrentUser()?.id) {
            router.push('/login');
        }
    });

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
        const payload = {
            owner_id: getCurrentUser()?.id,
            type_id: applicationType,
            description: workDescription,
            tz: tz,
            address: address,
            price: price,
            object_type_id: objectTypeId,
            square: square,
            review_date: reviewDate,
            review_time: reviewTime,
            order_deadline: orderDeadline,
            phone: phone,
            is_moving: haveMovableProperty,
            doc_photo: file,
            kad_number: kadNumber,
            movableProperty: movablePropertyItems.map(item => ({
                title: item.name,
                count: item.quantity,
                unit: item.unit,
            })),
        }

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'addRequest', payload, { headers: { "Content-Type": "multipart/form-data" } })
        .then(() => {
            if (applicationType === APPLICATION_TYPES.PUBLIC) {
                router.push('/createApplication/public/success');
            } else {
                router.push('/createApplication/private/success');
            }
        })
        .catch(data => alert(data.message))
    }

    return (
        <div className={styles.container}>
            <Header />
            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
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
                                        <textarea
                                            rows={1}
                                            placeholder='+7 (___) ___ __ __'
                                            className={styles.textArea}
                                            onChange={e => setPhone(e.target.value)}
                                            value={phone}
                                        >
                                        </textarea>
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
                        movablePropertyItems.map((movableProperty, idx) => {
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
                                </>
                            )
                        })
                    }

                    <Button
                        type={'text'}
                        text={'Добавить еще позиции'}
                        onClick={() => addMovableProperty()}
                        additionalStyles={{}}
                    />
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
                    onClick={() => createApplicationHandler()}
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