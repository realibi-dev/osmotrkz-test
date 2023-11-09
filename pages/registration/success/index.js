import Widget from "../../../components/Widget";
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import styles from '../style.module.css'

export default function RegistrationSuccess() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Widget
                    heading={'Ваши данные отправлены модератору на проверку'}
                    text={'В течении 10 минут вам на почту придет уведомление о регистрации'}
                />
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}