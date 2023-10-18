import { useState } from 'react'
import styles from './style.module.css'
import clsx from 'clsx'
import FormBody from './FormBody';
import FORMS_CONST from './constants';
import axios from "axios";

export default function RegistrationAuthorizationForm() {
    const [forms, setForms] = useState([
        {
            stepNum: FORMS_CONST.FORM_STEPS.REGISTRATION,
            headingText: 'Заполните все необходимые поля для регистрации',
            fields: [
                { name: 'roleId', title: 'Выберите роль', inputType: 'radio', options: [ { value: 1, title: 'Заказчик' }, { value: 2, title: 'Исполнитель' } ], value: '' },
                { name: 'statusId', title: 'Выберите статус', inputType: 'radio', options: [ { value: 1, title: 'Юридическое лицо' }, { value: 2, title: 'Физическое лицо' } ], value: '' },
                { name: 'fullName', title: 'ФИО', inputType: 'text', value: '' },
                { name: 'phoneNumber', title: 'Номер телефона', inputType: 'text', value: '' },
                { name: 'email', title: 'Email', inputType: 'text', value: '' },
                { name: 'password', title: 'Придумайте пароль', inputType: 'text', value: '' },
                { name: 'passwordConfirmation', title: 'Подтвердите пароль', inputType: 'text', value: '' },
                { name: 'isOfferAccepted', title: 'Я согласен на обработку персональных данных', inputType: 'checkbox', value: false },
            ],
        },
        {
            stepNum: FORMS_CONST.FORM_STEPS.QUALIFICATION,
            headingText: 'Подтвердите свою квалификацию',
            fields: [
                { name: 'sertificate', title: 'Загрузите сертификат оценщика', inputType: 'file', value: '' },
                { name: 'sertificate_number', title: 'Номер документа', inputType: 'text', value: '' },
                { name: 'date_of_sert_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                { name: 'insurance_contract', title: 'Добавьте договор о страховании', inputType: 'file', value: '' },
                { name: 'contract_number', title: 'Номер документа', inputType: 'text', value: '' },
                { name: 'date_of_cont_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                { name: 'ward', title: 'Добавьте сертификат палаты', inputType: 'file', value: '' },
                { name: 'ward_number', title: 'Номер документа', inputType: 'text', value: '' },
                { name: 'date_of_ward_issue', title: 'Когда выдан', inputType: 'date', value: '' },
                { name: 'work_experience', title: 'Стаж работы', inputType: 'number', value: '' },
            ],
        },
        {
            stepNum: FORMS_CONST.FORM_STEPS.AUTHORIZATION,
            headingText: '',
            fields: [
                { name: 'email', title: 'Email', inputType: 'text', value: '' },
                { name: 'password', title: 'Придумайте пароль', inputType: 'text', value: '' },
                { name: 'rememberMe', title: 'Запомнить меня', inputType: 'checkbox', value: false },
            ]
        }
    ]);

    const [currentStepNum, setCurrentStepNum] = useState(1);

    const handleInputChange = (stepNum, fieldName, fieldValue) => {
        setForms(prevValue => prevValue.map(form => {
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
        }))
    }

    const handleButtonClick = () => {
        if (currentStepNum === 2){
            registration();
        }
        if (currentStepNum === 3) {
            login();
            return;
        }
        setCurrentStepNum(currentStepNum + 1);
        console.log(forms);
    }

    const registration = () => {
        const registrationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION).fields;
        const qualificationFields = forms.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION).fields;
        const totalFields = [...registrationFields, ...qualificationFields];
        const payload = totalFields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: field.value,
            }
        }, {});

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'register', payload, { headers: { "Content-Type": "multipart/form-data" } })
        .then(data => {
            console.log("success on registration");
            console.log("data", data);
        })
        .catch(data => {
            alert(data.message);
        })
    }

    const login = () => {
        console.log(process.env.NEXT_PUBLIC_API_URL)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div
                    className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION && styles.active_header)}
                    onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.REGISTRATION)}
                >
                    <div className={styles.number_tag}>1</div>
                    Регистрация
                </div>
                <div
                    className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION && styles.active_header)}
                    onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.QUALIFICATION)}
                >
                    <div className={styles.number_tag}>2</div>
                    Квалификация
                </div>
                <div
                    className={clsx(styles.header_item, currentStepNum === FORMS_CONST.FORM_STEPS.AUTHORIZATION && styles.active_header)}
                    onClick={() => setCurrentStepNum(FORMS_CONST.FORM_STEPS.AUTHORIZATION)}
                >
                    <div className={styles.number_tag}>3</div>
                    Авторизация
                </div>
            </div>

            <FormBody
                styles={styles}
                formInfo={forms.find(form => form.stepNum === currentStepNum)}
                handleInputChange={handleInputChange}
                currentStepNum={currentStepNum}
            />

            <div className={styles.next_button_block}>
                <button className={styles.next_button} onClick={handleButtonClick}>
                    {currentStepNum === 3 ? "Войти" : "Далее"}
                </button>
            </div>         
        </div>
    )
}