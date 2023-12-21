import styles from './style.module.css'
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Button from '../../../../components/common/Button';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { getCurrentUser } from '../../../../helpers/user';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import clsx from 'clsx';
import ClickAwayListener from 'react-click-away-listener';

export default function PublishedApplication() {
    const router = useRouter()
    const applicationId = router.query.id;
    const [responds, setResponds] = useState([]);
    
    const fetchData = () => {
        axios
        .get(process.env.NEXT_PUBLIC_API_URL + 'getResponsesForOrder/' + applicationId, { headers: { 'ngrok-skip-browser-warning': 'true'  } })
        .then(response => {
            console.log(response.data.responses);
            if(response.data.success) {
                setResponds(response.data.responses);
            }
        })
    }

    useEffect(() => {
        if (applicationId){
            fetchData();
        }
    }, [applicationId]);

    return (
        <div className={styles.container}>
            <div className={styles.popupBack}>
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
                            <Link href={'/publishedApplications'}>Отклики</Link>
                        </span>
                        <span>
                            <img src={'/arrow-right.png'} width={7} height={10} />
                        </span>
                        <span>Заказ № {applicationId}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 34,
                    }}>
                        {responds.map(respond => (
                            <div className="div">
                                <div className="div-2">На вашу заявку откликнулись</div>
                                <div className="div-3">
                                    <div className="div-4">
                                        <div className="div-5">Исполнитель</div>
                                        <div className="div-6">
                                            {/* <img
                                                loading="lazy"
                                                src={process.env.NEXT_PUBLIC_API_URL + `file/${respond.customer.avatar}`}
                                                className="img"
                                            /> */}
                                            <div
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: '50%',
                                                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}file/${respond.customer.avatar})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                            >

                                            </div>
                                            <div className="div-7">{respond.customer.fio}</div>
                                        </div>
                                    </div>
                                    <div className="div-8">
                                        <div className="div-9">Дата выполнения</div>
                                        <div className="div-10">{moment(respond.finish_date).format('DD.MM.YYYY')}</div>
                                    </div>
                                </div>

                                {respond.work_status === "created" && !respond.is_declined && (
                                    <>
                                        <div className="div-11">
                                            <Button
                                                text={'Отклонить'}
                                                type={''}
                                                additionalStyles={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #94A3B8',
                                                    color: '#94A3B8',
                                                    fontSize: 16,
                                                }}
                                                onClick={() => {
                                                    axios.post(process.env.NEXT_PUBLIC_API_URL + `respondToResponse`, {
                                                        response_id: +respond.id,
                                                        approve: false,
                                                    }).then(() => {
                                                        fetchData();
                                                    }).catch(() => {
                                                        alert("Ошибка отправки ответа");
                                                    })
                                                }}
                                            />
                                            <Button
                                                text={'Принять'}
                                                type={'filled'}
                                                onClick={() => {
                                                    axios.post(process.env.NEXT_PUBLIC_API_URL + `respondToResponse`, {
                                                        response_id: +respond.id,
                                                        approve: true,
                                                    }).then(() => {
                                                        fetchData();
                                                    }).catch(() => {
                                                        alert("Ошибка отправки ответа");
                                                    })
                                                }}
                                            />
                                        </div>
                                    </>
                                )}

                                {respond.work_status === "started" && (
                                    <>
                                        <div style={{ marginTop: 40 }}>
                                            <p style={{textAlign: 'center',color: 'green' }}>Отклик уже одобрен вами</p>
                                        </div>
                                    </>
                                )}

                                {respond.is_declined && (
                                    <>
                                        <div style={{ marginTop: 40 }}>
                                            <p style={{textAlign: 'center',color: 'red' }}>Отклик отлонен вами</p>
                                        </div>
                                    </>
                                )}

                                {respond.work_status === "finished" && (
                                    <>
                                        <div style={{ marginTop: 40 }}>
                                            <p style={{textAlign: 'center',color: 'green' }}>Исполнитель уже завершил заказ</p>
                                        </div>
                                    </>
                                )}

                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    padding: '0 15%',
                    marginTop: 60,
                }}>
                    <Footer />
                </div>
            </div>

            <style jsx>{`
                .div {
                border-radius: 20px;
                box-shadow: 0px 4px 19px 0px rgba(117, 117, 117, 0.16);
                background-color: var(--white, #fff);
                display: flex;
                width: 700px;
                max-width: 100%;
                flex-direction: column;
                padding: 36px 80px;
                }
                @media (max-width: 991px) {
                .div {
                    padding: 20px;
                }
                }
                .div-2 {
                color: var(--black, #3f444a);
                text-align: center;
                font: 600 28px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-2 {
                    max-width: 100%;
                }
                }
                .div-3 {
                display: flex;
                margin-top: 26px;
                align-items: start;
                justify-content: space-between;
                gap: 20px;
                }
                @media (max-width: 991px) {
                .div-3 {
                    max-width: 100%;
                    flex-wrap: wrap;
                }
                }
                .div-4 {
                display: flex;
                margin-top: 4px;
                flex-grow: 1;
                flex-basis: 0%;
                flex-direction: column;
                }
                .div-5 {
                color: var(--black, #3f444a);
                font: 400 14px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-6 {
                display: flex;
                margin-top: 5px;
                justify-content: space-between;
                gap: 3px;
                }
                .img {
                aspect-ratio: 1;
                object-fit: contain;
                object-position: center;
                width: 43px;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                max-width: 100%;
                }
                .div-7 {
                color: var(--black, #3f444a);
                align-self: center;
                flex-grow: 1;
                white-space: nowrap;
                margin: auto 0;
                font: 600 18px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-7 {
                    white-space: initial;
                }
                }
                .div-8 {
                border-radius: 16px;
                border: 1px solid var(--light-mint-green, #92e3a9);
                align-self: stretch;
                display: flex;
                flex-grow: 1;
                flex-basis: 0%;
                flex-direction: column;
                padding: 15px 51px 15px 15px;
                }
                @media (max-width: 991px) {
                .div-8 {
                    padding-right: 20px;
                }
                }
                .div-9 {
                color: var(--black, #3f444a);
                white-space: nowrap;
                font: 600 18px/110% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-9 {
                    white-space: initial;
                }
                }
                .div-10 {
                color: var(--txt, #50575e);
                font: 400 18px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-11 {
                display: flex;
                margin-top: 40px;
                justify-content: space-between;
                gap: 20px;
                }
                @media (max-width: 991px) {
                .div-11 {
                    max-width: 100%;
                    flex-wrap: wrap;
                }
                }
                .div-12 {
                color: var(--grey, #94a3b8);
                text-align: center;
                white-space: nowrap;
                justify-content: center;
                border-radius: 40px;
                border: 1px solid var(--grey, #94a3b8);
                background-color: var(--white, #fff);
                flex-grow: 1;
                padding: 19px 10px;
                font: 600 20px/110% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-12 {
                    white-space: initial;
                }
                }
                .div-13 {
                color: var(--white, #fff);
                text-align: center;
                white-space: nowrap;
                justify-content: center;
                border-radius: 40px;
                background-color: var(--mint-green, #00cf91);
                flex-grow: 1;
                padding: 19px 10px;
                font: 600 20px/110% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-13 {
                    white-space: initial;
                }
                }
            `}</style>
        </div>
    );
}