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
              <Link href={'/registration'}>
                Зарегистрироваться
              </Link>
            </button>
          </div>
          <div className={styles.right_side}>
            <img src={'/main_image.png'} height={400}/>
          </div>
        </div>
      </div>

      <div className={styles.grey_back}>
        <h2 className={styles.section_heading}>Почему выбирают нас?</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className={styles.card}>
            <div className={styles.card_left_side} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 14 }}>
              <p className={styles.card_heading} style={{ textAlign: 'left' }}>Эффективность</p>
              <p className={styles.card_text}>
                Получайте быстрый доступ к широкому спектру 
                заданий на осмотр недвижимости и оптимизируйте 
                свою работу, выбирая проекты, которые соответствуют 
                вашим навыкам и предпочтениям.
              </p>
            </div>
            <div
              className={styles.card_right_side}
              style={{
                backgroundImage: `url(/card1.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
              }}
            >
            </div>
          </div>

          <div className={styles.card}>
            <div
              className={styles.card_right_side}
              style={{
                backgroundImage: `url(/card2.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left',
              }}
            >
            </div>
            <div className={styles.card_left_side} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 14 }}>
              <p className={styles.card_heading} style={{ textAlign: 'left' }}>Гибкость и удобство</p>
              <p className={styles.card_text}>
                Будьте свободны в управлении своим рабочим графиком и 
                местом работы. Вы можете передавать задания другим 
                специалистам или брать на себя дополнительные проекты, 
                даже находясь вдали от места недвижимости.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.card_left_side} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 14 }}>
              <p className={styles.card_heading} style={{ textAlign: 'left' }}>Развитие <br/> профессиональной сети</p>
              <p className={styles.card_text}>
                Возможность общаться и обмениваться опытом с другими 
                экспертами по оценке недвижимости, расширяя свою профессиональную 
                сеть и создавая новые деловые контакты.
              </p>
            </div>
            <div
              className={styles.card_right_side}
              style={{
                backgroundImage: `url(/card3.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
              }}
            >
            </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>

      <div className={styles.body} style={{ paddingBottom: 80 }}>
        <h2 className={styles.section_heading}>Как это работает?</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <div className={styles.line_left_side}>
            <div style={{ width: 380, marginTop: 150 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                }}
              >
                Создайте заявку <br /> на осмотр
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                Оставьте заявку на осмотр объекта недвижимости, 
                чтобы получить отклик от специалиста.
              </div>
            </div>

            <div style={{ width: 380, marginTop: 274 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                }}
              >
                Ожидайте отклика <br /> от исполнителя
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                После создания заявки, ожидайте отклика со стороны 
                исполнителя, готового провести осмотр недвижимости.
              </div>
            </div>

            <div style={{ width: 380, marginTop: 330 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                }}
              >
                Подтвердите <br/> работу исполнителя
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                После осмотра вам необходимо будет одобрить 
                работу исполнителя и получить PDF документ, 
                содержащий заполненные данные об осмотре недвижимости. 
                При успешной сдаче работы исполнителем, на его 
                виртуальный счет будут перечислены деньги. 
              </div>
            </div>
          </div>

          <div className={styles.line_container}>
            <div className={styles.line}></div>
            <div className={styles.line_number} style={{ top: -21 }}>1</div>
            <div className={styles.line_number} style={{ top: 150 }}>2</div>
            <div className={styles.line_number} style={{ top: 356 }}>3</div>
            <div className={styles.line_number} style={{ top: 573 }}>4</div>
            <div className={styles.line_number} style={{ top: 777 }}>5</div>
            <div className={styles.line_number} style={{ top: 1050 }}>6</div>
          </div>

          <div className={styles.line_left_side}>
            <div style={{ width: 380, marginTop: -20 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                  color: '#00CF91',
                }}
              >
                Зарегистрируйтесь <br/> на платформе
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                Оставьте заявку на осмотр объекта недвижимости, 
                чтобы получить отклик от специалиста.
              </div>
            </div>

            <div style={{ width: 380, marginTop: 228 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                }}
              >
                Фиксация суммы на <br/> счете платформы
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                Определенная сумма спишиется с вашего счета и будет 
                зафиксирована на виртуальном счете платформы до 
                успешного завершения осмотра и подтверждения работ.
              </div>
            </div>

            <div style={{ width: 380, marginTop: 225   }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: '100%', /* 32px */
                  letterSpacing: '0.64px',
                  marginBottom: 12,
                  fontFamily: 'Nunito_Sans_Bold',
                }}
              >
                Выполнение осмотра <br /> исполнителем
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#3F444A',
                  lineHeight: '135%',
                }}
              >
                Выбранный вами исполнитель должен будет выполнить 
                осмотр в течении определеннрго времени.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grey_back}>
        <div style={{
          display: 'flex',
          padding: '20px 0',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div className={styles.left_side} style={{ width: '50%' }}>
            <h1 className={styles.heading_text} style={{ marginBottom: 38 }}>
              Начните упрощать <br/>
              процесс работы
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: 60 }}>
              Получите доступ к широкому спектру функций, 
              которые значительно облегчат ваши задачи 
              по осмотру недвижимости.
            </p>
            <button className={styles.button}>
              <Link href={'/registration'}>
                Зарегистрироваться
              </Link>
            </button>
          </div>
          <div
            className={styles.card_right_side}
            style={{
              width: '50%',
            }}
          >
            <img src={'/big_main.png'} height={633} />
          </div>
        </div>
      </div>

      <br />
      <br />

      <div className={styles.grey_back} style={{ padding: '120px 15%', gap: 50, alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <img src={'/big2_main.png'} height={440} />
        </div>
        <div style={{ width: '50%' }}>
          <h1 className={styles.heading_text} style={{ marginBottom: 38 }}>
            Скачайте мобильное <br/> приложение
          </h1>
          <p className={styles.subtitle} style={{ marginBottom: 60 }}>
            Приложение Oсмотр.kz позволит вам <br />
            регулировать процесс работы удаленно, в <br />
            любое время и место
          </p>
          <div>
            <img style={{ marginTop: -20, marginLeft: -22 }} src={'/qr_code.png'} width={400}/>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />

      <div className={styles.body}>
        <Footer />
      </div>
    </div>
  )
}
