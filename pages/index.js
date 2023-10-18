import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <div className={styles.top_banner}>
          <div className={styles.left_side}>
            <h1 className={styles.heading_text}>
              Платформа для <br/>
              специалистов по <br/>
              оценке недвижимости
            </h1>
            <p className={styles.subtitle}>
              Делегируйте задания и расширьте свою <br/>
              возможность принимать больше <br/>
              заказов в любом месте
            </p>
            <button className={styles.button}>
              <Link href={'/authorization'}>
                Зарегистрироваться
              </Link>
            </button>
          </div>
          <div className={styles.right_side}>
            <img src={'/man_board.png'} height={400}/>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
