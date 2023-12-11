import Widget from '../../../../components/Widget';
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import styles from '../../style.module.css'
import Link from 'next/link';

export default function PublicApplicationCreateSuccess() {
    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.body}>
                <Widget
                    heading={'Ваша заявка опубликована'}
                    text={<Link style={{ color: "#09C18A" }} href={'/publishedApplications'}>Перейти к опубликованным заявкам →</Link>}
                />
            </div>

            <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </div>
    );
}