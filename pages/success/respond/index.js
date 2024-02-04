import Widget from "../../../components/Widget";
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import styles from './style.module.css'

export default function RegistrationSuccess() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Widget
                    heading={'Спасибо за отклик'}
                    text={
                        <>
                            <span>
                            Вы можете приступать к выполнению заявки. Для выполнения заявки потребуется мобильное приложение
                            </span>
                            <span style={{
                                marginTop: 24,
                                color: '#09C18A',
                                fontSize: 14,
                                fontWeight: 400,
                                display: 'block',
                                lineHeight: '135%',
                            }}>
                                Скачайте приложение для <br/> отслеживания работы →
                            </span>
                        </>
                    }
                />
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}