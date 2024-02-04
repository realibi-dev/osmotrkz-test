import Footer from '../../components/Footer';
import Header from '../../components/Header';
import styles from './style.module.css';
import Button from './../../components/common/Button'
import { useState } from 'react';
import { getCurrentUser, setCurrentUser, setToken } from '../../helpers/user';
import axios from 'axios';
import { useRouter } from 'next/router'

export default function AddBalance() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    var searchParams;
    var userEmail;
    var userPassword;
    try{
        searchParams = new URLSearchParams(location.search);
        userEmail = searchParams.get('email');
        userPassword = searchParams.get('password');
    }
    catch{}
    

    const login = () => {
        console.log(userEmail, userPassword);
        if(userEmail == null || userPassword == null){
            return;
        }
        const payload = {
            "email": userEmail,
            "password": userPassword
        }
        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'auth', payload)
        .then(({ data }) => {
            if (data.success) {
                if (data.user.is_active) {
                    setToken(data.token);
                    setCurrentUser(data.user);
                } else {
                    alert("Администрация еще не верифицировала ваш акаунт");
                }
            }
        })
        .catch(data => {
            console.log(data);
            alert(data.response?.data?.message || "Произошла ошибка!");
        })
    }

    function openPaymentWidgetHandler(priceToPay) {
        if (getCurrentUser()?.id) {
            openPaymentWidget({
                api_key: '8590a7d1-cfb1-41bf-9619-1c333a14f960',
                amount: priceToPay,
                currency: "KZT",
                order_id: Math.round(Math.random() * 100000).toString(),
                description: "description",
                payment_type: "pay",
                payment_method: "ecom",
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
                .post(process.env.NEXT_PUBLIC_API_URL + 'addBalance', { amount: priceToPay, user_id: getCurrentUser()?.id })
                .then(({ data }) => {
                    if (data.success) {
                        const currentUser = getCurrentUser();
                        setCurrentUser({
                            ...currentUser,
                            balance: +(currentUser.balance || 0) + +priceToPay
                        })
                        alert("Баланс успешно пополнен!");
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
            alert("Вам нужно авторизоваться!");
        }
    }

    login();

    return (
        <>
            <script src='https://widget.onevisionpay.com' defer></ script>
            <Header />

            <div className={styles.form}>
                <h2 className={styles.heading}>Введите сумму для пополнения</h2>
                <input className={styles.input} type='number' value={amount} onChange={e => setAmount(e.target.value)}/>
                <Button
                    text={'Оплатить'}
                    type={'filled'}
                    additionalStyles={{
                        width: '40%',
                        display: 'block',
                        margin: '40px auto',
                    }}
                    onClick={() => openPaymentWidgetHandler(+amount)}
                />
            </div>

            <div style={{ padding: '0 10%', boxSizing: 'border-box' }}>
                <Footer />
            </div>
        </>
    );
}