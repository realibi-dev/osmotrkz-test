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

export default function Form({ formType, stepNum, isNeedBackgroundImages=true, isNeedHeader=true, removeOutline=false }) {
    const router = useRouter();

    useEffect(() => {
        if (localStorage) {
            setForms([
                {
                    stepNum: FORMS_CONST.FORM_STEPS.REGISTRATION,
                    headingText: 'Заполните все необходимые поля для регистрации',
                    fields: [
                        { name: 'role_id', title: 'Выберите роль', inputType: 'checkbox', options: [ { value: 1, title: 'Заказчик' }, { value: 2, title: 'Исполнитель' } ], value: [] },
                        { name: 'status_id', title: 'Выберите статус', inputType: 'radio', options: [ { value: 1, title: 'Юридическое лицо' }, { value: 2, title: 'Физическое лицо' } ], value: 1 },
                        { name: 'fio', title: 'ФИО', inputType: 'text', value: '' },
                        { name: 'phone', title: 'Номер телефона', inputType: 'text', value: '', placeholder: '+7 (000) 000-00-00' },
                        { name: 'email', title: 'Email', inputType: 'text', value: '' },
                        { name: 'password', title: 'Придумайте пароль', inputType: 'password', value: '' },
                        { name: 'confirmPassword', title: 'Подтвердите пароль', inputType: 'password', value: '' },
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
                    stepNum: FORMS_CONST.FORM_STEPS.RESET_PASSWORD,
                    headingText: '',
                    fields: [
                        { name: 'email', title: 'Введите email указанный во время регистрации', inputType: 'text', value: '' },
                        { name: 'password', title: 'Придумайте новый пароль', inputType: 'password', value: '' },
                        { name: 'confirmPassword', title: 'Подтвердите пароль', inputType: 'password', value: '' },
                    ]
                },
                {
                    stepNum: FORMS_CONST.FORM_STEPS.PROFILE_EDIT,
                    headingText: '',
                    fields: [
                        { name: 'fio', title: 'ФИО', inputType: 'text', value: getCurrentUser()?.fio, placeholder: '' },
                        { name: 'phone', title: 'Номер телефона', inputType: 'text', value: getCurrentUser()?.phone, placeholder: '+7 (000) 000-00-00' },
                        { name: 'email', title: 'Email', inputType: 'text', value: getCurrentUser()?.email },
                        { name: 'password', title: 'Новый пароль', inputType: 'password', value: '' },
                        { name: 'passwordRepeat', title: 'Повторить пароль', inputType: 'password', value: '' },
                    ]
                }
            ])
        }
    }, [])

    const [forms, setForms] = useState();

    const [currentStepNum, setCurrentStepNum] = useState(stepNum || 1);

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
        console.log(forms)
    }

    const handleButtonClick = async () => {
        if (currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION) {
            if (forms?.find(form => form.stepNum === FORMS_CONST.FORM_STEPS.REGISTRATION)?.fields?.find(field => field.name === 'role_id')?.value == 1) {
                registrationShort();
                return;
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
        setCurrentStepNum(currentStepNum + 1);
        console.log(forms);
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

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'register', payload, { headers: { "Content-Type": "multipart/form-data" } })
        .then(() => router.push('/registration/success'))
        .catch(data => alert(data.message))
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
        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'registerSimple', payload)
        .then(() => router.push('/registration/success'))
        .catch(data => alert(data.message))
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
                setToken(data.token);
                setCurrentUser(data.user);
                router.push("/");
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

        payload.confirmPassword = payload.password;

        axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'updatePassword', payload)
        .then(({ data }) => {
            if (data.success) {
                router.push("/login");
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
                    additionalStyles={{ width: '40%' }}
                />
            </div>         
        </div>
    )
}