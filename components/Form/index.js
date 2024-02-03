import { useEffect, useState } from 'react'
import styles from './style.module.css'
import clsx from 'clsx'
import FormBody from './FormBody';
import FORMS_CONST from '../../helpers/constants';
import axios from "axios";
import { getCurrentUser, setCurrentUser, setToken } from "../../helpers/user"
import { useRouter } from 'next/router'
import Button from '../common/Button';
import { getUserInfoFromSertificate } from '../../helpers/ncaLayer';
import { useMediaQuery } from 'react-responsive';
import constants from '../../helpers/constants';

export default function Form({ formType, stepNum, isNeedBackgroundImages=true, isNeedHeader=true, removeOutline=false }) {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const router = useRouter();

    var searchParams;
    var userEmail;
    try{
        searchParams = new URLSearchParams(location.search);
        userEmail = searchParams.get('email');
    }
    catch{}

    const init = async () => {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + 'getAllCities', { headers: { 'ngrok-skip-browser-warning': 'true'  } });
        const cities = await res.data.rows;
        if (localStorage) {
            setForms([
                {
                    stepNum: FORMS_CONST.FORM_STEPS.REGISTRATION,
                    headingText: 'Заполните все необходимые поля для регистрации',
                    fields: [
                        { name: 'role_id', title: 'Выберите роль', inputType: 'checkbox', options: [ { value: 1, title: 'Заказчик' }, { value: 2, title: 'Исполнитель' } ], value: 1 },
                        { name: 'status_id', title: 'Выберите статус', inputType: 'radio', options: [ { value: 1, title: 'Юр. лицо / ИП' }, { value: 2, title: 'Физическое лицо' } ], value: 1 },
                        { name: 'fio', title: 'ФИО', inputType: 'text', value: '' },
                        { name: 'name', title: 'Имя', inputType: 'text', value: '' },
                        { name: 'surname', title: 'Фамилия', inputType: 'text', value: '' },
                        { name: 'lastName', title: 'Отчество', inputType: 'text', value: '' },
                        { name: 'phone', title: 'Номер телефона', inputType: 'text', value: '', placeholder: '+7 (000) 000-00-00' },
                        { name: 'email', title: 'Email', inputType: 'text', value: '' },
                        { name: 'city_id', title: 'Город', inputType: 'select', options: cities, value: cities[0].id },
                        { name: 'password', title: 'Придумайте пароль', inputType: 'password', value: '' },
                        { name: 'confirmPassword', title: 'Подтвердите пароль', inputType: 'password', value: '' },
                        { name: 'company_title', title: 'Наименование компании', inputType: 'text', value: '' },
                        { name: 'bin', title: 'БИН', inputType: 'text', value: '' },
                        { name: 'bill_number', title: 'Номер счета', inputType: 'text', value: '' },
                        { name: 'address', title: 'Юр. адрес', inputType: 'text', value: '' },
                        { name: 'bic', title: 'БИК банка', inputType: 'text', value: '' },
                        { name: 'director_fio', title: 'ФИО директора', inputType: 'text', value: '' },
                        { name: 'isOfferAccepted', title: 'Я согласен на обработку персональных данных', inputType: 'checkbox', value: false },
                    ],
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.QUALIFICATION,
                    headingText: 'Подтвердите свою квалификацию',
                    fields: [
                        { name: 'sertificate', title: 'Загрузите сертификат оценщика', inputType: 'file', value: '' },
                        { name: 'sertificate_number', title: 'Номер документа', inputType: 'text', value: '', placeholder: 'XX XX XX XX' },
                        { name: 'date_of_sert_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                        { name: 'insurance_contract', title: 'Добавьте договор о страховании', inputType: 'file', value: '' },
                        { name: 'contract_number', title: 'Номер документа', inputType: 'text', value: '', placeholder: 'XX XX XX XX' },
                        { name: 'date_of_cont_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                        { name: 'ward', title: 'Добавьте сертификат палаты', inputType: 'file', value: '' },
                        { name: 'ward_number', title: 'Номер документа', inputType: 'text', value: '', placeholder: 'XX XX XX XX' },
                        { name: 'date_of_ward_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                        { name: 'work_experience', title: 'Стаж работы', inputType: 'number', value: '' },
                    ],
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.AUTHORIZATION,
                    headingText: 'Подтвердите свою личность\nчерез ЭЦП ключ',
                    fields: [],
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.LOGIN,
                    headingText: '',
                    fields: [
                        { name: 'email', title: 'Email', inputType: 'text', value: '' },
                        { name: 'password', title: 'Пароль', inputType: 'password', value: '' },
                        { name: 'rememberMe', title: 'Запомнить меня', inputType: 'checkbox', value: false },
                    ]
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.SEND_EMAIL_CODE,
                    headingText: '',
                    fields: [
                        { name: 'email', title: 'Введите email указанный во время регистрации', inputType: 'text', value: '' },
                    ]
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.RESET_PASSWORD,
                    headingText: '',
                    fields: [
                        { name: 'newPassword', title: 'Придумайте новый пароль', inputType: 'password', value: '' },
                        { name: 'verificationCode', title: 'Код высланный на почту', inputType: 'number', value: '' },                        
                    ]
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.PROFILE_EDIT,
                    headingText: '',
                    fields: [
                        { name: 'fio', title: 'ФИО', inputType: 'text', value: getCurrentUser()?.fio, placeholder: '' },
                        { name: 'phone', title: 'Номер телефона', inputType: 'text', value: getCurrentUser()?.phone, placeholder: '+7 (000) 000-00-00' },
                        { name: 'email', title: 'Email', inputType: 'text', value: getCurrentUser()?.email },
                        { name: 'city_id', title: 'Город', inputType: 'select', options: cities, value: getCurrentUser()?.city_id },
                        { name: 'password', title: 'Новый пароль', inputType: 'password', value: '' },
                        { name: 'passwordRepeat', title: 'Повторить пароль', inputType: 'password', value: '' },
                    ]
                }
            ])
        }
    }

    useEffect(() => {
        init();
    }, [])

    const [forms, setForms] = useState();

    const [currentStepNum, setCurrentStepNum] = useState(stepNum || 1);

    const validatePayload = (payload, stepNumber) => {
        if (payload?.password?.length < 8) {
            alert("Пароль должен содержать минимум 8 символов!")
            return false;
        }

        if (payload.password && payload?.password !== payload?.confirmPassword) {
            alert("Пароли не совпадают!")
            return false;
        }

        if (payload?.email && !payload?.email?.includes("@")) {
            alert("Почта не соответствует формату!")
            return false;
        }

        const emptyFields = Object.keys(payload).filter(key => typeof payload[key] === "string" && payload[key].length == "");

        if (emptyFields.length > 0) {
            const fields = forms.find(form => form.stepNum === stepNumber)?.fields;
            const emptyFieldNames = [];
            for (const payloadName of emptyFields) {
                const fieldName = fields.find(f => f.name === payloadName)?.title;
                emptyFieldNames.push(fieldName);
            }

            alert("Заполните следующие поля: " + emptyFieldNames.toString());

            return false;
        } else {
            return true;
        }
    }

    const handleInputChange = (stepNum, fieldName, fieldValue) => {
        const newData = forms.map(form => {
            if (form.stepNum === stepNum) {
                form.fields = form.fields.map(field => {
                    if (field.name === fieldName) {
                        return {
                            ...field,
                            value: fieldValue,
                        }
                    }
                    return field;
                })
                return form;
            }
            return form;
        })
        // console.log(newData);
        setForms(newData);
    }

    useEffect(() => {
        console.log(forms?.at(3).fields[1].value);
    }, [forms])

    const handleButtonClick = async () => {
        if (currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION) {
            if (forms?.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION)?.fields?.find(field => field.name === 'role_id')?.value == 1) {
                registrationShort();
                return;
            } else {
                if (currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION || currentStepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION) {
                    const fields = forms.find(form => form.stepNum === currentStepNum).fields;
                    const payload = fields.reduce((acc, field) => {
                        return {
                            ...acc,
                            [field.name]: field.value,
                        }
                    });

                    delete payload.name;
                    delete payload.surname;
                    delete payload.lastName;
        
                    if (validatePayload(payload, currentStepNum)) {
                        setCurrentStepNum(currentStepNum + 1);
                    } else return;
                } else {
                    setCurrentStepNum(currentStepNum + 1);
                }
            }
        }
        if (currentStepNum === FORMS_CONST.FORM_STEPS.AUTHORIZATION){
            registration();
            return;
        }
        if (currentStepNum === FORMS_CONST.FORM_STEPS.LOGIN) {
            login();
            return;
        }
        if (currentStepNum === FORMS_CONST.FORM_STEPS.PROFILE_EDIT) {
            profileEdit();
            return;
        }
        if (currentStepNum === FORMS_CONST.FORM_STEPS.RESET_PASSWORD) {
            resetPassword();
            return;
        }
        if (currentStepNum === FORMS_CONST.FORM_STEPS.SEND_EMAIL_CODE) {
            sendEmail();
            return;
        }

        if (currentStepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION) {
            const fields = forms.find(form => form.stepNum === currentStepNum).fields;
            const payload = fields.reduce((acc, field) => {
                return {
                    ...acc,
                    [field.name]: field.value,
                }
            });

            delete payload.name;
            delete payload.surname;
            delete payload.lastName;

            if (validatePayload(payload, currentStepNum)) {
                setCurrentStepNum(currentStepNum + 1);
            } else return;
        } else {
            setCurrentStepNum(currentStepNum + 1);
        }
    }

    const registration = async () => {
        const registrationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION).fields;
        const qualificationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION).fields;
        const { nameSurname, givenName, iin, email } = await getUserInfoFromSertificate();
        const totalFormFields = [...registrationFields, ...qualificationFields];

        const certificateInfo = {
            fio_from_ecp: `${nameSurname} ${givenName}`,
            iin_from_ecp: iin,
            email_from_ecp: email,
        }
        
        const payload = totalFormFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, certificateInfo);

        delete payload.name;
        delete payload.surname;
        delete payload.lastName;

        if (payload.status_id === 2) {
            delete payload.company_title;
            delete payload.bin;
            delete payload.bill_number;
            delete payload.address;
            delete payload.bic;
            delete payload.director_fio;
        }

        if (validatePayload(payload, constants.FORM_STEPS.REGISTRATION)) {
            if (payload.password === payload.confirmPassword) {
                axios
                .post(process.env.NEXT_PUBLIC_API_URL + 'register', payload, { headers: { "Content-Type": "multipart/form-data" } })
                .then(() => router.push('/registration/success'))
                .catch(data => alert(data.response.data.message))
            } else {
                alert("Пароли не совпадают!");
            }
        }
    }

    const registrationShort = () => {
        const registrationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION).fields;
        const payload = registrationFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
                ...(field.name === 'role_id' && { [field.name]: JSON.stringify(field.value) })
            }
        }, {});

        if (payload.status_id === 2) {
            delete payload.company_title;
            delete payload.bin;
            delete payload.bill_number;
            delete payload.address;
            delete payload.bic;
            delete payload.director_fio;
        }

        if (payload.name.length || payload.surname.length) {
            payload.fio = `${payload.name} ${payload.surname} ${payload.lastName}`;
            delete payload.name;
            delete payload.surname;
            delete payload.lastName;
        }

        if (validatePayload(payload, constants.FORM_STEPS.REGISTRATION)) {
            if (payload.password === payload.confirmPassword) {
                axios
                .post(process.env.NEXT_PUBLIC_API_URL + 'registerSimple', payload)
                .then(() => router.push('/registration/success'))
                .catch(data => alert(data.response.data.message))
            } else {
                alert("Пароли не совпадают!");
            }
        }      
    }

    const login = () => {
        const authorizationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.LOGIN).fields;
        const payload = authorizationFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, {});

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'auth', payload)
        .then(({ data }) => {
            if (data.success) {
                if (data.user.is_active) {
                    setToken(data.token);
                    setCurrentUser(data.user);
                    router.push("/");
                } else {
                    alert("Администрация еще не верифицировала ваш акаунт");
                }
            }
        })
        .catch(data => {
            alert(data.response?.data?.message || "Произошла ошибка!");
        })
    }

    const profileEdit = () => {
        const profileEditFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.PROFILE_EDIT).fields;
        const payload = profileEditFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, {});

        if (!payload.password) {
            delete payload.password;
            delete payload.passwordRepeat;
        }

        const { id } = getCurrentUser();
        payload.personId = id;

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'editPersonData', payload)
        .then(({ data }) => {
            if (data.success) {
                setCurrentUser(data.user);
                alert("Данные успешно обновлены!");
                router.push("/profile");
            } else {
                alert("Что-то пошло нетак!");
            }
        })
        .catch(data => {
            alert(data.message);
        })
    }

    const resetPassword = () => {
        const resetPasswordFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.RESET_PASSWORD).fields;
        const payload = resetPasswordFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, {});
        console.log("UserEmail:",userEmail);
        payload.email = userEmail;
        payload.verificationCode = parseInt(payload.verificationCode);
        console.log("payload:",payload);


        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'changePassword', payload)
        .then(({ data }) => {
            if (data.success) {
                router.push("/login");
            }
        })
        .catch(data => {
            alert(data.message);
        })
    }

    const sendEmail = () => {
        const sendEmailFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.SEND_EMAIL_CODE).fields;
        const payload = sendEmailFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, {});

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'sendVerificationCode', payload)
        .then(({ data }) => {
            if (data.success) {
                router.push("/login/reset?email="+payload.email);
            }
        })
        .catch(data => {
            alert(data.message);
        })
    }

    const getFormHeader = () => {
        if (formType === 'registrationAuthorization') {
            if (forms?.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION)?.fields?.find(field => field.name === 'role_id')?.value == 1) {
                return (
                    <>
                        <div
                            className={clsx(styles.header_item, styles.header_item_full, styles.active_header)}
                            onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.REGISTRATION)}
                        >
                            Регистрация
                        </div>
                    </>
                )
            }

            return (
                <>
                    <div
                        className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION && styles.active_header)}
                        onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.REGISTRATION)}
                        style={{ borderTopLeftRadius: isMobile ? 0 : 20 }}
                    >
                        <div className={styles.number_tag}>1</div>
                        Регистрация
                    </div>
                    <div
                        className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION && styles.active_header)}
                        // onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.QUALIFICATION)}
                    >
                        <div className={styles.number_tag}>2</div>
                        Квалификация
                    </div>
                    <div
                        className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.AUTHORIZATION && styles.active_header)}
                        // onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.AUTHORIZATION)}
                        style={{ borderTopRightRadius: isMobile ? 0 : 20 }}
                    >
                        <div className={styles.number_tag}>3</div>
                        Подтверждение
                    </div>
                </>
            );
        }

        if (formType === 'login') {
            return (
                <>
                    <div
                        className={clsx(styles.header_item, styles.header_item_full, styles.active_header)}
                    >
                        Войти
                    </div>
                </>
            )
        }

        if (formType === 'sendEmail') {
            return (
                <>
                    <div
                        className={clsx(styles.header_item, styles.header_item_full, styles.active_header)}
                    >
                        Отправить письмо
                    </div>
                </>
            )
        }

        if (formType === 'resetPassword') {
            return (
                <>
                    <div
                        className={clsx(styles.header_item, styles.header_item_full, styles.active_header)}
                    >
                        Сброс пароля
                    </div>
                </>
            )
        }
    }

    return (
        <div className={styles.container} style={{ ...(removeOutline && { boxShadow: 'none' }) }}>
            {
                isNeedBackgroundImages && (
                    <>
                        <img src='/settings_image.png' className={styles.settings_image_1}/>
                        <img src='/settings_image.png' className={styles.settings_image_2}/>
                    </>
                )
            }
            
            {
                isNeedHeader && (
                    <div className={styles.header}>
                        {getFormHeader()}
                    </div>
                )
            }

            {
                forms && (
                    <FormBody
                        styles={styles}
                        formInfo={forms.find(form => form.stepNum === currentStepNum)}
                        handleInputChange={handleInputChange}
                        currentStepNum={currentStepNum}
                    />
                )
            }
            

            <div className={styles.next_button_block}>
                <Button
                    type={'filled'}
                    onClick={handleButtonClick}
                    text={currentStepNum === 3 ? "Войти" : "Далее"}
                    additionalStyles={{ width: isMobile ? '90%' : '40%' }}
                />
            </div>         
        </div>
    )
}