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
    const [applicationInfo, setApplicationInfo] = useState();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const [reviewDate, setReviewDate] = useState('');
    const [reviewTime, setReviewTime] = useState('');

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
                .get(process.env.NEXT_PUBLIC_API_URL + 'getFavorites/' + getCurrentUser().id, { headers: { 'ngrok-skip-browser-warning': 'true' } })
                .then(response => {
                    if (response.data.success) {
                        const favourites = response.data.favorites;
                        setIsFavourite(favourites.find(item => item.request_id == applicationId));
                    }
                })
        }
    }, [applicationId]);

    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + 'getAllRequests', { headers: { 'ngrok-skip-browser-warning': 'true' } })
            .then(response => {
                if (response.data?.success) {
                    const applications = response.data.requests;
                    setApplicationInfo(applications.find(app => app.id === +applicationId));
                }
            })
            .catch(error => alert("Ошибка при загрузке заявок"))
    }, [applicationId]);

    const respondToApplication = () => {
        setIsResponding(true);
    }

    return (
        <div className={styles.container} style={{ background: isResponding ? 'rgba(255, 255, 255, 0.2)' : '#fff' }}>
            {/* <Head>
                <meta httpEquiv="Content-Security-Policy" content={'frame-ancestors https://api.onevisionpay.com'} /> 
            </Head> */}
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
                            <div className="div-2">
                                <div className="div-3">
                                    <div className="div-4">Исполнитель</div>
                                    <div className="div-5">
                                        <img
                                            loading="lazy"
                                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/32beaa5e3701ba7f57358aa42fc89fc3fb327c8d1c1c3334c771c8c3ae1b0f1f?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                            className="img"
                                        />
                                        <div className="div-6">Алексей Быков</div>
                                    </div>
                                </div>
                                <div className="div-7">
                                    <div className="div-8">Дата завершения осмотра</div>
                                    <div className="div-9">10.06.2023</div>
                                </div>
                            </div>
                            <div className="div-10">
                                <div className="div-11">
                                    <div className="column">
                                        <div className="div-12">
                                            <div className='div-13'>Документ</div>
                                            <div className="div-14">Акт осмотра объекта недвижимости</div>
                                            <div className="div-15">
                                                <div className="div-16">
                                                    <img
                                                        loading="lazy"
                                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6d76a1cd38255ad513d100713b356c9940a86c2fd2e72299f5bd0ced23a10480?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                        className="img-2"
                                                    />
                                                    <div className="div-17">Заказ АЛ-001.pdf</div>
                                                </div>
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc9a7201dbe5db465d29c6158f32324597140906f38d63c430cf70ae4a6b6eb2?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-3"
                                                />
                                            </div>
                                            <div className="div-18" style={{ height: 40 }}>
                                                Удостоверение личности ЛПО{" "} <br/>
                                                <span
                                                    style={{
                                                        fontFamily: "Nunito Sans, sans-serif",
                                                        fontWeight: 400,
                                                        fontSize: 16,
                                                        lineHeight: '21.6px',
                                                    }}
                                                >
                                                    (лица присутствовавщего при осмотре)
                                                </span>
                                            </div>
                                            <div className="div-19">
                                                <div className="div-20">
                                                    <div className="column-2">
                                                        <img
                                                            loading="lazy"
                                                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/66d06ba06cd5c7f5703eba0cfdf035e2877e20c0e2e70786763970ac7bf2e55a?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                            className="img-4"
                                                        />
                                                    </div>
                                                    <div className="column-3">
                                                        <img
                                                            loading="lazy"
                                                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/1adab5c1b68ed9b002e88db993c38287ddbd654ea1f82fb2fb0383d4252a0b6e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                            className="img-5"
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column-4">
                                        <div className="div-21">
                                            <div className="div-22"  style={{ height: 40 }}>Факсимиле ЛПО</div>
                                            <div className="div-23">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/40558118c2a05a630714d166c943949a3e51747d6e8e1b5a9625a4e9c2e7a496?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="div-24">
                                <div className="div-25">
                                    <div className="div-26">Фотографии объекта</div>
                                    <div className="div-27">Придомовая инфраструктура</div>
                                </div>
                                <img
                                    loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/de055c78cb6bd3892ab4098cf6b09c84e05ab07b4448bfdb331d869ce400078e?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                    className="img-7"
                                />
                            </div>
                            <div className="div-28">
                                <div className="div-29">
                                    <div className="div-30">
                                        <div className="div-31">
                                            <div className="column-5">
                                                <div className="div-32">
                                                    <img
                                                        loading="lazy"
                                                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/25e3cc886a0985ba3311dee6823032ae2a3e0ba2c6ad96b6c505184f9e9a45c6?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                        className="img-8"
                                                    />
                                                    <div className="div-33">Входная часть</div>
                                                </div>
                                            </div>
                                            <div className="column-6">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ea0bebdaca959581d15cffd042c4d01c4a6ffdb16ad8efea55a9dd7ee8a77637?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-9"
                                                />
                                            </div>
                                            <div className="column-7">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/71df2bf7f656a8a4e0b1364d68eeb1e2ad07bd3aedca822d8bc35664e0ff7036?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="div-34">
                                        <div className="div-35">
                                            <div className="column-8">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6133bcec0cdb41002e6c7908deffeb4009b7a1373bdb800ce849a2407722737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-11"
                                                />
                                            </div>
                                            <div className="column-9">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/32ce998afafd14d9c39712bccd1be5fb145240efa7c8024dc2a5a224864648f9?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-12"
                                                />
                                            </div>
                                            <div className="column-10">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a9b5d06cf410215cdfb8463037195adb58b37a267329fbf528b6038434bf08d5?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-13"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="div-36">Внутренняя часть</div>
                                    <div className="div-37">
                                        <div className="div-38">
                                            <div className="column-11">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a39f4c142bdf9e80e06c8a277669a2d87ca58d922754079121eddf2153f97c75?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-14"
                                                />
                                            </div>
                                            <div className="column-12">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e0c202ac9e9161201f52e735a4f721742b8e57d0cc0797e8f77e4158db9e52ee?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-15"
                                                />
                                            </div>
                                            <div className="column-13">
                                                <img
                                                    loading="lazy"
                                                    srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e2c4d44ac061fda65492862e67871bf7e685570596a1e7b21fb28be703bc0bf1?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                                    className="img-16"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="div-39">Селфи оценщика</div>
                                    <img
                                        loading="lazy"
                                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/99ffd4155eced632828d476d4099cf561fc2dee94a3c21473510b072cc646b2c?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-17"
                                    />
                                </div>
                                <div className="div-40">
                                    <img
                                        loading="lazy"
                                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/d4d01d8191f1fc4697ce9fb1a2570c3fac770816fe069109f559438a1bba5994?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-18"
                                    />
                                    <img
                                        loading="lazy"
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7072f1ddfde0f69e381c813410247529b17662740090c7200709ff75d5d0ffb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-19"
                                    />
                                    <img
                                        loading="lazy"
                                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9a57ddfe7e1552252c25a37c304c3a43bd86e90ac5a71ec1433a77f4e73a51cb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-20"
                                    />
                                    <img
                                        loading="lazy"
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7072f1ddfde0f69e381c813410247529b17662740090c7200709ff75d5d0ffb?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-21"
                                    />
                                    <img
                                        loading="lazy"
                                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ed7d4a761f7417cc116087143a0113ced1140756be802249c7e7ba62c7969737?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                        className="img-22"
                                    />
                                </div>
                            </div>
                            <div className="div-41">
                                <div className="div-42">
                                    Вы должны подтвердить работу исполнителя в течение 2-х рабочих часов
                                </div>
                                <div className="div-43">
                                    В случае отсутствия вашего подтверждения по истечении указанного
                                    времени, оплата будет автоматически перечислена исполнителю.
                                </div>
                            </div>
                            <div className="div-44">
                                <div className="div-45">Отклонить</div>
                                <div className="div-46">Принять</div>
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
            <style jsx>{`
                .div {
                border-radius: 20px;
                box-shadow: 0px 4px 19px 0px rgba(117, 117, 117, 0.16);
                background-color: var(--white, #fff);
                align-self: end;
                display: flex;
                margin-top: 35px;
                width: 820px;
                max-width: 100%;
                flex-direction: column;
                padding: 46px 0;
                }
                .div-2 {
                align-self: stretch;
                display: flex;
                width: 100%;
                align-items: start;
                justify-content: space-between;
                gap: 20px;
                margin: 0 24px;
                }
                @media (max-width: 991px) {
                .div-2 {
                    margin-right: 10px;
                    flex-wrap: wrap;
                }
                }
                .div-3 {
                display: flex;
                margin-top: 4px;
                flex-direction: column;
                }
                .div-4 {
                color: var(--grey, #94a3b8);
                font: 400 14px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-5 {
                display: flex;
                margin-top: 10px;
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
                .div-6 {
                color: var(--black, #3f444a);
                align-self: center;
                flex-grow: 1;
                white-space: nowrap;
                margin: auto 0;
                font: 600 18px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-6 {
                    white-space: initial;
                }
                }
                .div-7 {
                border-radius: 16px;
                border: 1px solid var(--light-mint-green, #92e3a9);
                align-self: stretch;
                display: flex;
                flex-direction: column;
                padding: 15px 17px;
                }
                .div-8 {
                color: var(--black, #3f444a);
                white-space: nowrap;
                font: 600 18px/110% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-8 {
                    white-space: initial;
                }
                }
                .div-9 {
                color: var(--txt, #50575e);
                font: 400 18px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-10 {
                align-self: stretch;
                margin: 52px 20px 0;
                }
                @media (max-width: 991px) {
                .div-10 {
                    max-width: 100%;
                    margin: 40px 10px 0 0;
                }
                }
                .div-11 {
                gap: 20px;
                display: flex;
                }
                @media (max-width: 991px) {
                .div-11 {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0px;
                }
                }
                .column {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 68%;
                margin-left: 0px;
                }
                @media (max-width: 991px) {
                .column {
                    width: 100%;
                }
                }
                .div-12 {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                }
                @media (max-width: 991px) {
                .div-12 {
                    max-width: 100%;
                    margin-top: 27px;
                }
                }
                .div-13 {
                color: #09c18a;
                letter-spacing: 0.64px;
                font: 600 32px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-13 {
                    max-width: 100%;
                }
                }
                .div-14 {
                color: var(--black-for-pics, #263238);
                margin-top: 21px;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-14 {
                    max-width: 100%;
                }
                }
                .div-15 {
                border-radius: 8px;
                border: 1.6px solid var(--grey, #94a3b8);
                display: flex;
                margin-top: 10px;
                justify-content: space-between;
                gap: 11px;
                padding: 20px 42px 20px 22px;
                }
                @media (max-width: 991px) {
                .div-15 {
                    max-width: 100%;
                    flex-wrap: wrap;
                    padding: 0 20px;
                }
                }
                .div-16 {
                display: flex;
                justify-content: space-between;
                gap: 6px;
                }
                @media (max-width: 991px) {
                .div-16 {
                    max-width: 100%;
                    flex-wrap: wrap;
                }
                }
                .img-2 {
                aspect-ratio: 1;
                object-fit: contain;
                object-position: center;
                width: 26px;
                overflow: hidden;
                max-width: 100%;
                }
                .div-17 {
                color: var(--black, #3f444a);
                align-self: start;
                flex-grow: 1;
                flex-basis: auto;
                font: 400 18px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .img-3 {
                aspect-ratio: 0.6;
                object-fit: contain;
                object-position: center;
                width: 9px;
                fill: var(--grey, #94a3b8);
                overflow: hidden;
                align-self: center;
                max-width: 100%;
                margin: auto 0;
                }
                .div-18 {
                color: var(--black, #3f444a);
                margin-top: 31px;
                font: 500 20px/20px Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-18 {
                    max-width: 100%;
                }
                }
                .div-19 {
                margin-top: 18px;
                }
                @media (max-width: 991px) {
                .div-19 {
                    max-width: 100%;
                }
                }
                .div-20 {
                gap: 20px;
                display: flex;
                }
                @media (max-width: 991px) {
                .div-20 {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0px;
                }
                }
                .column-2 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 50%;
                margin-left: 0px;
                }
                @media (max-width: 991px) {
                .column-2 {
                    width: 100%;
                }
                }
                .img-4 {
                aspect-ratio: 1.63;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-4 {
                    margin-top: 10px;
                }
                }
                .column-3 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 50%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-3 {
                    width: 100%;
                }
                }
                .img-5 {
                aspect-ratio: 1.63;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-5 {
                    margin-top: 10px;
                }
                }
                .column-4 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 32%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-4 {
                    width: 100%;
                }
                }
                .div-21 {
                display: flex;
                margin-top: 199px;
                flex-grow: 1;
                flex-direction: column;
                }
                @media (max-width: 991px) {
                .div-21 {
                    margin-top: 40px;
                }
                }
                .div-22 {
                color: var(--black, #3f444a);
                white-space: nowrap;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-22 {
                    white-space: initial;
                }
                }
                .div-23 {
                border-radius: 8px;
                box-shadow: 0px 4px 19px 0px rgba(117, 117, 117, 0.16);
                background-color: var(--white, #fff);
                display: flex;
                margin-top: 15px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 17px 43px 17px 57px;
                }
                @media (max-width: 991px) {
                .div-23 {
                    padding: 0 20px;
                }
                }
                .img-6 {
                aspect-ratio: 1.2;
                object-fit: contain;
                object-position: center;
                width: 143px;
                overflow: hidden;
                }
                .div-24 {
                align-self: stretch;
                display: flex;
                width: 100%;
                justify-content: space-between;
                gap: 20px;
                margin: 51px 20px 0;
                }
                @media (max-width: 991px) {
                .div-24 {
                    flex-wrap: wrap;
                    margin: 40px 10px 0 0;
                }
                }
                .div-25 {
                display: flex;
                flex-direction: column;
                }
                .div-26 {
                color: #09c18a;
                letter-spacing: 0.64px;
                white-space: nowrap;
                font: 600 32px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-26 {
                    white-space: initial;
                }
                }
                .div-27 {
                color: var(--black, #3f444a);
                margin-top: 23px;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .img-7 {
                aspect-ratio: 2.73;
                object-fit: contain;
                object-position: center;
                width: 60px;
                overflow: hidden;
                align-self: end;
                margin-top: 40px;
                max-width: 100%;
                }
                .div-28 {
                align-self: stretch;
                display: flex;
                margin-top: 15px;
                justify-content: space-between;
                gap: 10px;
                }
                @media (max-width: 991px) {
                .div-28 {
                    max-width: 100%;
                    flex-wrap: wrap;
                }
                }
                .div-29 {
                display: flex;
                flex-grow: 1;
                flex-basis: 0%;
                flex-direction: column;
                padding: 0 20px;
                }
                @media (max-width: 991px) {
                .div-29 {
                    max-width: 100%;
                }
                }
                .div-30 {
                align-self: stretch;
                }
                @media (max-width: 991px) {
                .div-30 {
                    max-width: 100%;
                }
                }
                .div-31 {
                gap: 20px;
                display: flex;
                }
                @media (max-width: 991px) {
                .div-31 {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0px;
                }
                }
                .column-5 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 0px;
                }
                @media (max-width: 991px) {
                .column-5 {
                    width: 100%;
                }
                }
                .div-32 {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                }
                @media (max-width: 991px) {
                .div-32 {
                    margin-top: 10px;
                }
                }
                .img-8 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                }
                .div-33 {
                color: var(--black, #3f444a);
                margin-top: 29px;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .column-6 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-6 {
                    width: 100%;
                }
                }
                .img-9 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                }
                @media (max-width: 991px) {
                .img-9 {
                    margin-top: 10px;
                }
                }
                .column-7 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-7 {
                    width: 100%;
                }
                }
                .img-10 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                }
                @media (max-width: 991px) {
                .img-10 {
                    margin-top: 10px;
                }
                }
                .div-34 {
                align-self: stretch;
                margin-top: 17px;
                }
                @media (max-width: 991px) {
                .div-34 {
                    max-width: 100%;
                }
                }
                .div-35 {
                gap: 20px;
                display: flex;
                }
                @media (max-width: 991px) {
                .div-35 {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0px;
                }
                }
                .column-8 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 0px;
                }
                @media (max-width: 991px) {
                .column-8 {
                    width: 100%;
                }
                }
                .img-11 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-11 {
                    margin-top: 10px;
                }
                }
                .column-9 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-9 {
                    width: 100%;
                }
                }
                .img-12 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-12 {
                    margin-top: 10px;
                }
                }
                .column-10 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-10 {
                    width: 100%;
                }
                }
                .img-13 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-13 {
                    margin-top: 10px;
                }
                }
                .div-36 {
                color: var(--black, #3f444a);
                align-self: stretch;
                margin-top: 29px;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-36 {
                    max-width: 100%;
                }
                }
                .div-37 {
                align-self: stretch;
                margin-top: 15px;
                }
                @media (max-width: 991px) {
                .div-37 {
                    max-width: 100%;
                }
                }
                .div-38 {
                gap: 20px;
                display: flex;
                }
                @media (max-width: 991px) {
                .div-38 {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0px;
                }
                }
                .column-11 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 0px;
                }
                @media (max-width: 991px) {
                .column-11 {
                    width: 100%;
                }
                }
                .img-14 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-14 {
                    margin-top: 10px;
                }
                }
                .column-12 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-12 {
                    width: 100%;
                }
                }
                .img-15 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-15 {
                    margin-top: 10px;
                }
                }
                .column-13 {
                display: flex;
                flex-direction: column;
                line-height: normal;
                width: 33%;
                margin-left: 20px;
                }
                @media (max-width: 991px) {
                .column-13 {
                    width: 100%;
                }
                }
                .img-16 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 100%;
                overflow: hidden;
                flex-grow: 1;
                }
                @media (max-width: 991px) {
                .img-16 {
                    margin-top: 10px;
                }
                }
                .div-39 {
                color: var(--black, #3f444a);
                align-self: stretch;
                margin-top: 27px;
                font: 500 20px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                @media (max-width: 991px) {
                .div-39 {
                    max-width: 100%;
                }
                }
                .img-17 {
                aspect-ratio: 1.38;
                object-fit: contain;
                object-position: center;
                width: 220px;
                overflow: hidden;
                align-self: start;
                margin-top: 15px;
                max-width: 100%;
                }
                .div-40 {
                align-self: start;
                display: flex;
                flex-basis: 0%;
                flex-direction: column;
                align-items: center;
                }
                .img-18 {
                aspect-ratio: 0.71;
                object-fit: contain;
                object-position: center;
                width: 113px;
                overflow: hidden;
                }
                .img-19 {
                aspect-ratio: 2.73;
                object-fit: contain;
                object-position: center;
                width: 60px;
                overflow: hidden;
                margin-top: 25px;
                max-width: 100%;
                }
                .img-20 {
                aspect-ratio: 0.71;
                object-fit: contain;
                object-position: center;
                width: 113px;
                overflow: hidden;
                margin-top: 22px;
                }
                .img-21 {
                aspect-ratio: 2.73;
                object-fit: contain;
                object-position: center;
                width: 60px;
                overflow: hidden;
                margin-top: 25px;
                max-width: 100%;
                }
                .img-22 {
                aspect-ratio: 0.71;
                object-fit: contain;
                object-position: center;
                width: 113px;
                overflow: hidden;
                margin-top: 22px;
                }
                .div-41 {
                background-color: var(--blue-grey-for-lines, #dce7fe);
                align-self: stretch;
                display: flex;
                margin-top: 60px;
                flex-direction: column;
                align-items: start;
                padding: 29px 80px;
                }
                @media (max-width: 991px) {
                .div-41 {
                    max-width: 100%;
                    margin-top: 40px;
                    padding: 0 20px;
                }
                }
                .div-42 {
                color: var(--blue, #0075ff);
                margin-left: 18px;
                width: 377px;
                max-width: 100%;
                font: 500 20px/20px Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-43 {
                color: #318fff;
                width: 465px;
                max-width: 100%;
                margin: 6px 0 0 18px;
                font: 400 14px/19px Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-44 {
                align-self: center;
                display: flex;
                gap: 20px;
                margin: 60px 0 22px;
                }
                @media (max-width: 991px) {
                .div-44 {
                    max-width: 100%;
                    flex-wrap: wrap;
                    margin-top: 40px;
                }
                }
                .div-45 {
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
                .div-45 {
                    white-space: initial;
                }
                }
                .div-46 {
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
                .div-46 {
                    white-space: initial;
                }
                }
            `}</style>
        </div>
    );
}