import { getCurrentSceneId } from "@/metrics/scriptTest";
import { COMPONENT_BUTTON, registerComponent, registerpassword, registerusername } from "@/metrics/scriptTest";
import { clearCart } from "@/utils/UtilsCart";
import { clearFavorites } from "@/utils/UtilsFavorites";
import { clearLogin, login } from "@/utils/UtilsLogin";
import { UtilsTasks } from "@/utils/UtilsTasks";
import { Button, Card, Col, Form, Row, notification } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    allowSubmitForm,
    validateFormDataInputEmail,
    validateFormDataInputRequired
} from "../utils/UtilsValidations";
import { PasswordInputField } from "./shared/PasswordInputField";
import { TextInputField } from "./shared/TextInputField";
import { useScene } from "@/experiment/useScene";
import { SCENES } from "@/metrics/constants/scenes";

let LoginFormComponent = ({ }) => {
    const t = useTranslations();
    let router = useRouter()

    // validación
    let requiredInForm = ["email", "password"]
    //let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})
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
        const scene3 = useScene(SCENES.TASK_ACCEPT_TUTORIAL);
        scene3.start();
        clearCart();
        clearFavorites();
        UtilsTasks.resetAllTasks();
        registerusername(formData.email);
        registerpassword(formData.password);
        router.push("/home");
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
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
                            {allowSubmitForm(formData, formErrors, requiredInForm) ?
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