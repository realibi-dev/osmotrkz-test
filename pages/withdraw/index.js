import Footer from '../../components/Footer';
import Header from '../../components/Header';
import styles from './style.module.css';
import Button from './../../components/common/Button'
import { useState } from 'react';
import { getCurrentUser, setCurrentUser } from '../../helpers/user';

export default function WithdrawBalance() {
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [holder, setHolder] = useState('');

    function openPaymentWidgetHandler(priceToPay, cardNumber, holder) {
        if (getCurrentUser()?.id && (getCurrentUser()?.balance || 0) > priceToPay) {
            openPaymentWidget({
                api_key: '8590a7d1-cfb1-41bf-9619-1c333a14f960',
                amount: priceToPay,
                currency: "KZT",
                order_id: Math.round(Math.random() * 100000).toString(),
                description: "description",
                payment_type: "transfer",
                payment_method: "ecom_to_mc",
                items: [{
                    merchant_id: "f523e618-baf9-46a5-b841-3a7d3451aa46",
                    service_id: "b6549f27-2a36-4166-bc94-46f29e026f81",
                    merchant_name: "Merchant name",
                    name: "Example",
                    quantity: 1,
                    amount_one_pcs: priceToPay,
                    amount_sum: priceToPay,
                }],
                user_id: getCurrentUser()?.id.toString(),
                email: getCurrentUser()?.email,
                phone: getCurrentUser()?.phone,
                // success_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                // failure_url: "https://osmotrkz.vercel.app/createApplication/public/success",
                callback_url: "https://osmotrkz.vercel.app/profile",
                payment_lifetime: 600,
                create_recurrent_profile: false,
                recurrent_profile_lifetime: 0,
                lang: "ru",
                extra_params: {},
                payment_gateway_host: "https://api.onevisionpay.com",
                payment_widget_host: "https://widget.onevisionpay.com",
                test_mode: 1,
            }, 
            (success) => {
                axios
                .post(process.env.NEXT_PUBLIC_API_URL + 'reduceBalance', { amount: priceToPay, userId: getCurrentUser()?.id })
                .then(({ data }) => {
                    if (data.success) {
                        const currentUser = getCurrentUser();
                        setCurrentUser({
                            ...currentUser,
                            balance: +(currentUser.balance || 0) - +priceToPay
                        })
                        alert("Вывод произошел успешно!");
                        router.push("/profile");
                    } else {
                        alert("Что-то пошло нетак!");
                    }
                })
                .catch(data => {
                    alert(data.message);
                })
            },
            (error) => { alert(error) });
        } else {
            alert("Вам нужно авторизоваться или у вас недостаточно средств на балансе!");
        }
    }

    return (
        <>
            <script src='https://widget.onevisionpay.com' defer></ script>
            <Header />

            <div className={styles.form}>
                <h2 className={styles.heading}>Введите сумму для вывода</h2>
                <input className={styles.input} type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='Сумма'/>
                <input className={styles.input} type='text' value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder='Номер карты'/>
                <input className={styles.input} type='text' value={holder} onChange={e => setHolder(e.target.value)} placeholder='Имя держателя карты'/>
                <Button
                    text={'Получить'}
                    type={'filled'}
                    additionalStyles={{
                        width: '40%',
                        display: 'block',
                        margin: '40px auto',
                    }}
                    onClick={() => openPaymentWidgetHandler(+amount, cardNumber, holder)}
                />
            </div>

            <div style={{ padding: '0 10%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </>
    );
}