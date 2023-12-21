import styles from './style.module.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function SuccessFullyFinished() {
    return (
        <div className={styles.container}>
            <Header />

            <div
                style={{
                    padding: '0 15%',
                    boxSizing: 'border-box',
                    marginTop: 50,
                }}
            >
                <div className={styles.info_container}>
                    <div className="div">
                        <div className="div-2">
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/109f30d793edf0e509b7514a81c646c05792a0f910a71e5f0da9024f62038fab?apiKey=3ea9e746e5c3496aae786d4b5ac07a65&"
                                className="img"
                            />
                            <div className="div-3">Заказ успешно выполнен</div>
                            <div className="div-4">Вернуться на главную →</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                padding: '0 15%',
                marginTop: 60,
            }}>
                <Footer />
            </div>
            
            <style jsx>{`
                .div {
                border-radius: 20px;
                box-shadow: 0px 4px 19px 0px rgba(117, 117, 117, 0.16);
                background-color: var(--white, #fff);
                display: flex;
                margin-top: 80px;
                width: 780px;
                max-width: 100%;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 50px 60px;
                margin: 80px auto;
                }
                @media (max-width: 991px) {
                .div {
                    margin-top: 40px;
                    padding: 0 20px;
                }
                }
                .div-2 {
                display: flex;
                width: 300px;
                max-width: 100%;
                flex-direction: column;
                margin: 25px 0 42px;
                }
                @media (max-width: 991px) {
                .div-2 {
                    margin-bottom: 40px;
                }
                }
                .img {
                aspect-ratio: 1;
                object-fit: contain;
                object-position: center;
                width: 65px;
                overflow: hidden;
                align-self: center;
                max-width: 100%;
                }
                .div-3 {
                color: var(--black, #3f444a);
                text-align: center;
                letter-spacing: 0.64px;
                width: 300px;
                margin: 22px auto 0;
                font: 600 32px/100% Mazzard, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
                .div-4 {
                color: #09c18a;
                text-align: center;
                margin-top: 39px;
                font: 400 14px/135% Nunito Sans, -apple-system, Roboto, Helvetica,
                    sans-serif;
                }
            `}</style>
        </div>
    );
}