import Footer from '../../components/Footer'
import Header from '../../components/Header'
import RegistrationAuthorizationForm from '../../components/RegitrationAuthorizationForm'
import styles from './style.module.css'

export default function Authorization() {
  return (
    <div className={styles.container}>
        <Header />
        
        <div className={styles.body}>
            <RegistrationAuthorizationForm />
        </div>

        <div style={{ padding: '0 15%', boxSizing: 'border-box' }}>
          <Footer />
        </div>
    </div>
  )
}
