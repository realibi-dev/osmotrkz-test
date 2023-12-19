import { useEffect, useRef, useState } from 'react';
import FORMS_CONST from '../../../helpers/constants';
import InputMask from 'react-input-mask';
import clsx from 'clsx';

export default function FormBody({ styles, formInfo, handleInputChange, currentStepNum }) {
    const [fields, setFields] = useState({});

    useEffect(() => {
        const computedFields = formInfo.fields.reduce((acc, field) => {
            return {
                ...acc,
                [field.name]: {
                    name: field.name,
                    title: field.title,
                    inputType: field.inputType,
                    options: field.options,
                    placeholder: field.placeholder,
                    value: field?.value || '',
                },
            }
        }, {})
        setFields(computedFields);
    }, [currentStepNum, handleInputChange]);

    const renderRegistrationForm = () => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.checkbox_inputs}>
                        <div className={styles.heading_text} style={{ fontSize: 16 }}>{fields.role_id?.title}</div>
                        {fields.role_id?.options?.map(option => (
                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}> <input className={styles.checkbox_item} checked={option.value === fields.role_id.value} type={fields.role_id?.inputType} name={fields.role_id?.name} onChange={e => handleInputChange(currentStepNum, fields.role_id?.name, option.value)} /> {option.title} </div>
                        ))}
                    </div>
                    <div className={styles.checkbox_inputs}>
                        <div className={styles.heading_text} style={{ fontSize: 16 }}>{fields.status_id?.title}</div>
                        {fields.status_id?.options?.map(option => (
                            <div style={{ display: 'flex', gap: 14, marginTop: 10 }}> <input className={option.value === fields.status_id.value ? styles.radio_item_checked : styles.radio_item} checked={option.value === fields.status_id.value} type={fields.status_id?.inputType} name={fields.statusId?.name} onChange={e => handleInputChange(currentStepNum, fields.status_id?.name, option.value)} /> {option.title} </div>
                        ))}
                    </div>
                </div>

                <div className={styles.input_item}>
                    <span>{fields.fio?.title}</span>
                    <input value={fields.fio?.value} type={fields.fio?.inputType} onChange={e => handleInputChange(currentStepNum, fields.fio?.name, e.target.value)} />
                </div>

                <div className={styles.input_item}>
                    <span>{fields.phone?.title}</span>
                    <InputMask placeholder={fields.phone?.placeholder} value={fields.phone?.value} type={fields.phone?.inputType} onChange={e => handleInputChange(currentStepNum, fields.phone?.name, e.target.value)} mask="+7(999)999-99-99" maskChar="_" />
                    {/* <input placeholder={fields.phone?.placeholder} value={fields.phone?.value} type={fields.phone?.inputType} onChange={e => handleInputChange(currentStepNum, fields.phone?.name, e.target.value)} /> */}
                </div>
                
                <div className={styles.input_item}>
                    <span>{fields.email?.title}</span>
                    <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} />
                </div>
                <div className={clsx(styles.input_item)}>
                    <span>{fields.city_id?.title}</span>
                    {/* <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} /> */}
                    <div className={styles.customSelectWrapper}>
                        <select value={fields.city_id?.value} onChange={e => handleInputChange(currentStepNum, fields.city_id?.name, e.target.value)}>
                            {fields.city_id?.options?.map(city => (
                                <option value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.input_item}>
                    <span>{fields.password?.title}</span>
                    <input value={fields.password?.value} type={fields.password?.inputType} onChange={e => handleInputChange(currentStepNum, fields.password?.name, e.target.value)} />
                </div>

                <div className={styles.input_item}>
                    <span>{fields.confirmPassword?.title}</span>
                    <input value={fields.confirmPassword?.value} type={fields.confirmPassword?.inputType} onChange={e => handleInputChange(currentStepNum, fields.confirmPassword?.name, e.target.value)} />
                </div>

                <div className={styles.checkbox_input_item}>
                    <input checked={fields.isOfferAccepted?.value} type={fields.isOfferAccepted?.inputType} onChange={e => handleInputChange(currentStepNum, fields.isOfferAccepted?.name, e.target.checked)} /> {fields.isOfferAccepted?.title}
                </div>
            </>
        );
    }

    const renderQualificationForm = () => {
        return (
            <>
                <div className={styles.input_item}>
                    <span>{fields.sertificate?.title}</span>
                    <label class={styles.custom_file_input}>
                    <input type={fields.sertificate?.inputType} onChange={e => handleInputChange(currentStepNum, fields.sertificate?.name, e.target.files[0])} />
                        {
                            fields.sertificate?.value && (
                                <>
                                    Файл загружен
                                </>
                            )
                        }
                        {
                            !fields.sertificate?.value && (
                                <>
                                    <img src='/download.png' width={20} height={20} />
                                    Добавить файл
                                </>
                            )
                        }
                    </label>
                </div>
                <div  style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div className={styles.input_item}>
                        <span>{fields.sertificate_number?.title}</span>
                        <input placeholder={fields.sertificate_number?.placeholder} value={fields.sertificate_number?.value} type={fields.sertificate_number?.inputType} onChange={e => handleInputChange(currentStepNum, fields.sertificate_number?.name, e.target.value)} />
                    </div>
                    <div className={styles.input_item}>
                        <span>{fields.date_of_sert_issue?.title}</span>
                        <input value={fields.date_of_sert_issue?.value} type={fields.date_of_sert_issue?.inputType} onChange={e => handleInputChange(currentStepNum, fields.date_of_sert_issue?.name, e.target.value)} />
                    </div>
                </div>

                <div className={styles.input_item}>
                    <span>{fields.insurance_contract?.title}</span>
                    <label class={styles.custom_file_input}>
                        <input type={fields.insurance_contract?.inputType} onChange={e => handleInputChange(currentStepNum, fields.insurance_contract?.name, e.target.files[0])} />
                        {
                            fields.insurance_contract?.value && (
                                <>
                                    Файл загружен
                                </>
                            )
                        }
                        {
                            !fields.insurance_contract?.value && (
                                <>
                                    <img src='/download.png' width={20} height={20} />
                                    Добавить файл
                                </>
                            )
                        }
                    </label>
                </div>
                <div  style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div className={styles.input_item}>
                        <span>{fields.contract_number?.title}</span>
                        <input placeholder={fields.contract_number?.placeholder} value={fields.contract_number?.value} type={fields.contract_number?.inputType} onChange={e => handleInputChange(currentStepNum, fields.contract_number?.name, e.target.value)} />
                    </div>
                    <div className={styles.input_item}>
                        <span>{fields.date_of_cont_issue?.title}</span>
                        <input value={fields.date_of_cont_issue?.value} type={fields.date_of_cont_issue?.inputType} onChange={e => handleInputChange(currentStepNum, fields.date_of_cont_issue?.name, e.target.value)} />
                    </div>
                </div>

                <div className={styles.input_item}>
                    <span>{fields.ward?.title}</span>
                    <label class={styles.custom_file_input}>
                    <input type={fields.ward?.inputType} onChange={e => handleInputChange(currentStepNum, fields.ward?.name, e.target.files[0])} />
                        {
                            fields.ward?.value && (
                                <>
                                    Файл загружен
                                </>
                            )
                        }
                        {
                            !fields.ward?.value && (
                                <>
                                    <img src='/download.png' width={20} height={20} />
                                    Добавить файл
                                </>
                            )
                        }
                    </label>
                </div>
                <div  style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div className={styles.input_item}>
                        <span>{fields.ward_number?.title}</span>
                        <input placeholder={fields.ward_number?.placeholder} value={fields.ward_number?.value} type={fields.ward_number?.inputType} onChange={e => handleInputChange(currentStepNum, fields.ward_number?.name, e.target.value)} />
                    </div>
                    <div className={styles.input_item}>
                        <span>{fields.date_of_ward_issue?.title}</span>
                        <input value={fields.date_of_ward_issue?.value} type={fields.date_of_ward_issue?.inputType} onChange={e => handleInputChange(currentStepNum, fields.date_of_ward_issue?.name, e.target.value)} />
                    </div>
                </div>

                <div  style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div className={styles.input_item}>
                        <span>{fields.work_experience?.title}</span>
                        <input value={fields.work_experience?.value} type={fields.work_experience?.inputType} onChange={e => handleInputChange(currentStepNum, fields.work_experience?.name, e.target.value)} />
                    </div>
                    <div className={styles.input_item}></div>
                </div>
            </>
        );
    }

    const renderAuthorizationForm = () => {
        return (
            <></>
        );
    }

    const renderLoginForm = () => {
        return (
            <>
                <div className={styles.input_item}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{fields.email?.title}</span>
                        <a className={styles.link} href='/registration'>Регистрация</a>
                    </div>
                    <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} />
                </div>
                <div className={styles.input_item}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{fields.password?.title}</span>
                        <a className={styles.link} href='/login/reset'>Забыли пароль?</a>
                    </div>
                    <input value={fields.password?.value} type={fields.password?.inputType} onChange={e => handleInputChange(currentStepNum, fields.password?.name, e.target.value)} />
                </div>
                <div className={styles.checkbox_input_item}>
                    <input checked={fields.rememberMe?.value} type={fields.rememberMe?.inputType} onChange={e => handleInputChange(currentStepNum, fields.rememberMe?.name, e.target.checked)} /> {fields.rememberMe?.title}
                </div>
            </>
        );
    }

    const renderPasswordRecoveryForm = () => {
        return (
            <>
                <div className={styles.input_item}>
                    <span>{fields.email?.title}</span>
                    <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} />
                </div>
                <div className={styles.input_item}>
                    <span>{fields.password?.title}</span>
                    <input value={fields.password?.value} type={fields.password?.inputType} onChange={e => handleInputChange(currentStepNum, fields.password?.name, e.target.value)} />
                </div>
                <div className={styles.input_item}>
                    <span>{fields.confirmPassword?.title}</span>
                    <input checked={fields.confirmPassword?.value} type={fields.confirmPassword?.inputType} onChange={e => handleInputChange(currentStepNum, fields.confirmPassword?.name, e.target.checked)} /> {fields.rememberMe?.title}
                </div>
            </>
        );
    }

    const renderProfileEditForm = () => {
        return (
            <>
                <div className={styles.input_item}>
                    <span>{fields.fio?.title}</span>
                    <input value={fields.fio?.value} type={fields.fio?.inputType} onChange={e => handleInputChange(currentStepNum, fields.fio?.name, e.target.value)} />
                </div>
                <div className={styles.input_item}>
                    <span>{fields.phone?.title}</span>
                    <InputMask value={fields.phone?.value} type={fields.phone?.inputType} onChange={e => handleInputChange(currentStepNum, fields.phone?.name, e.target.value)} mask="+7(999)999-99-99" maskChar="_" />
                </div>
                <div className={styles.input_item}>
                    <span>{fields.email?.title}</span>
                    <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} />
                </div>
                <div className={clsx(styles.input_item)}>
                    <span>{fields.city_id?.title}</span>
                    {/* <input value={fields.email?.value} type={fields.email?.inputType} onChange={e => handleInputChange(currentStepNum, fields.email?.name, e.target.value)} /> */}
                    <div className={styles.customSelectWrapper}>
                        <select value={fields.city_id?.value} onChange={e => handleInputChange(currentStepNum, fields.city_id?.name, e.target.value)}>
                            {fields.city_id?.options?.map(city => (
                                <option value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.input_item}>
                    <span>{fields.password?.title}</span>
                    <input type={fields.password?.inputType} onChange={e => handleInputChange(currentStepNum, fields.password?.name, e.target.value)} />
                </div>
                <div className={styles.input_item}>
                    <span>{fields.passwordRepeat?.title}</span>
                    <input checked={fields.passwordRepeat?.value} type={fields.passwordRepeat?.inputType} onChange={e => handleInputChange(currentStepNum, fields.passwordRepeat?.name, e.target.value)} />
                </div>
            </>
        );
    }

    return (
        <div className={styles.form_body}>
            <p className={styles.heading_text}>{formInfo.headingText}</p>
            {currentStepNum === FORMS_CONST.FORM_STEPS.REGISTRATION && renderRegistrationForm()}
            {currentStepNum === FORMS_CONST.FORM_STEPS.QUALIFICATION && renderQualificationForm()}
            {currentStepNum === FORMS_CONST.FORM_STEPS.AUTHORIZATION && renderAuthorizationForm()}
            {currentStepNum === FORMS_CONST.FORM_STEPS.LOGIN && renderLoginForm()}
            {currentStepNum === FORMS_CONST.FORM_STEPS.RESET_PASSWORD && renderPasswordRecoveryForm()}
            {currentStepNum === FORMS_CONST.FORM_STEPS.PROFILE_EDIT && renderProfileEditForm()}
        </div>
    );
}