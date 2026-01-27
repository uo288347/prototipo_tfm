import { useState, useRef, useEffect } from "react";
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
import { registerComponent, COMPONENT_BUTTON, registerusername, registerpassword, finishTracking, initTracking, finishExperiment } from "@/metrics/scriptTest";
import { getCurrentSceneId, SCENES } from "@/metrics/constants/scenes";

let LoginFormComponent = ({setLogin}) => {
    const t = useTranslations();
    let router = useRouter()

    // validación
    //let requiredInForm = ["email","password"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})
 
    let [formData,setFormData] = useState({})

    useEffect(() => {
        initTracking(SCENES.LOGIN);
    }, []);

    // Auto-registro del botón de login
    useEffect(() => {
        const timer = setTimeout(() => {
            const loginBtn = document.getElementById('btn-login');
            if (!loginBtn) return;

            const sceneId = getCurrentSceneId();
            if (sceneId === null) return;

            const rect = loginBtn.getBoundingClientRect();
            registerComponent(
                sceneId,
                'btn-login',
                rect.left + window.scrollX,
                rect.top + window.scrollY,
                rect.right + window.scrollX,
                rect.bottom + window.scrollY,
                COMPONENT_BUTTON,
                null
            );
            loginBtn.setAttribute('data-trackable-id', 'btn-login');
            //console.log(`[LoginFormComponent] Registered btn-login`);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    let clickLogin = async () => {
        clearLogin();
        login(formData.email, formData.password);
        clearCart();
        clearFavorites();
        UtilsTasks.resetAllTasks();
        registerusername(formData.email);
        registerpassword(formData.password);

        finishExperiment();
        finishTracking();
        router.push("/home");
   }

    return (
        <Row align="middle" justify="center" style={{  minHeight:"100%", minWidth:"100%"}}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <Card title={t('auth.login')} style={{ width: "100%" }}>
                    <Form>
                    <TextInputField id="input-email" name="email" placeholder={t('auth.yourEmail')} formData={formData} setFormData={setFormData}
                        formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputEmail}
                        validateParams={[t('errors.invalidEmail')]}
                    />
                    <PasswordInputField id="input-password" name="password" placeholder={t('auth.yourPassword')} formData={formData} setFormData={setFormData}
                        formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired}
                        validateParams={[t('errors.required')]}
                    />
                    <Form.Item>
                        { allowSubmitForm(formData,formErrors,requiredInForm) ?
                            <Button 
                            id="btn-login"
                            size="large"
                            data-trackable-id="btn-login"
                            type="primary" onClick={clickLogin} block >{t('auth.login')}</Button> :
                            <Button type="primary" size="large" block disabled>{t('auth.login')}</Button>
                        }
                    </Form.Item>
                    </Form>
                </Card>
            </Col>
    </Row>

    )
}

export default LoginFormComponent;