import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Form from '../../components/Form'
import styles from './style.module.css'

export default function Authorization() {
  return (
    <div className={styles.container}>
        <Header />
        
        <div className={styles.body}>
            <Form formType={'registrationAuthorization'} />
        </div>

        <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
          <Footer />
        </div>
    </div>
  )
}
