import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {modifyStateProperty} from "../utils/UtilsState";
import {Card, Col, Row, Form, Input, Button , Typography } from "antd";
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
 } from "../utils/UtilsValidations"
import { openNotification } from '../utils/UtilsNotifications';
import {TextInputField} from "./shared/TextInputField";
import { PasswordInputField } from "./shared/PasswordInputField";
import { clearLogin, login } from "@/utils/UtilsLogin";
import { UtilsTasks } from "@/utils/UtilsTasks";
import { clearCart } from "@/utils/UtilsCart";
import { clearFavorites } from "@/utils/UtilsFavorites";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./shared/LanguageSwitcher";

let LoginFormComponent = ({setLogin}) => {
    const t = useTranslations();
    let router = useRouter()

    // validación
    //let requiredInForm = ["email","password"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})
 
    let [formData,setFormData] = useState({})

    let clickLogin = async () => {
        clearLogin();
        login(formData.email, formData.password);
        clearCart();
        clearFavorites();
        UtilsTasks.resetAllTasks();
        router.push("/home");
   }

    return (
        <Row align="middle" justify="center" style={{  minHeight:"100%", minWidth:"100%"}}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                    <LanguageSwitcher />
                </div>
                <Card title={t('auth.login')} style={{ width: "100%" }}>
                    <Form>
                    <TextInputField name="email" placeholder={t('auth.yourEmail')} formData={formData} setFormData={setFormData}
                        formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputEmail}
                        validateParams={[t('errors.invalidEmail')]}
                    />
                    <PasswordInputField name="password" placeholder={t('auth.yourPassword')} formData={formData} setFormData={setFormData}
                        formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired}
                        validateParams={[t('errors.required')]}
                    />
                    <Form.Item>
                        { allowSubmitForm(formData,formErrors,requiredInForm) ?
                            <Button type="primary" onClick={clickLogin} block >{t('auth.login')}</Button> :
                            <Button type="primary" block disabled>{t('auth.login')}</Button>
                        }
                    </Form.Item>
                    </Form>
                </Card>
            </Col>
    </Row>

    )
}

export default LoginFormComponent;

/*
            <Col xs={0} sm={0} md={12} lg={8} xl={6}  ><img src="/iniciar-sesion.png" width="100%"/></Col>

{formErrors?.email?.msg &&
                    <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
            <Form.Item label=""  key="email-input" name="email" validateStatus={
                validateFormDataInputEmail(
                    formData, "email", formErrors, setFormErrors) ? "success" : "error"}>
                <Input placeholder="your email"
                    value={formData.email}
                    onChange={(i) => {
                    modifyStateProperty(formData, setFormData,
                        "email", i.currentTarget.value)
                }}/>
            </Form.Item>


            {formErrors?.password?.msg &&
                <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
            <Form.Item label="" name="password" validateStatus={
                validateFormDataInputRequired(
                    formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                <Input.Password
                    placeholder="your password"
                    onChange={(i) => {
                    modifyStateProperty(formData, setFormData,
                        "password", i.currentTarget.value)
                }}/>
            </Form.Item>

            */