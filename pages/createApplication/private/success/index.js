import Widget from '../../../../components/Widget';
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import styles from '../../style.module.css'

export default function PrivateApplicationCreateSuccess() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Widget
                    heading={'Ваша заявка создана'}
                    text={'Начать осмотр →'}
                />
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}