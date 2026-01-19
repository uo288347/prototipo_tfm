import { Col, Form, Row, Card, Rate, Button, Divider } from "antd"
//import { Form  } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TextInputField } from "./shared/TextInputField";
import { TrackableSelect } from "./shared/TrackableSelect";
import { validateFormDataInputYear, allowSubmitForm } from "../utils/UtilsValidations"
import { modifyStateProperty } from "../utils/UtilsState";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./shared/LanguageSwitcher";
import useGestureDetector from "@/metrics/GestureDetectorHook";
import { registerParticipantData } from "@/metrics/registerInBd";
import { getUser, registerComponent, COMPONENT_BUTTON } from "../metrics/scriptTest";
import { getCurrentSceneId } from "@/metrics/constants/scenes";

export const InitialFormComponent = ({ }) => {
    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel } = useGestureDetector();

    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    //let requiredInForm = ["handedness","sex","birthYear","rating"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    const currentYear = new Date().getFullYear();
    let tooltipsFrequency = [t('initialForm.never'), t('initialForm.onceMonth'), t('initialForm.twoThreeTimesMonth'), t('initialForm.oneThreeTimesWeek'), t('initialForm.almostEveryday')]

    // Auto-registro del botón de registro para métricas
    useEffect(() => {
        const timer = setTimeout(() => {
            const sceneId = getCurrentSceneId();
            if (sceneId === null) return;

            const registerBtn = document.getElementById('registerButton');
            if (registerBtn) {
                const rect = registerBtn.getBoundingClientRect();
                registerComponent(sceneId, 'btn-register', rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_BUTTON, null);
                registerBtn.setAttribute('data-trackable-id', 'btn-register');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Props comunes para eventos de pointer
    const pointerEventProps = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel
    };

    const user = getUser();
    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
            <div>{user}</div>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <Card title={t('initialForm.title')}>
                    <Form {...pointerEventProps}>
                        <Form.Item {...pointerEventProps} id="handedness" name="handedness">
                            <TrackableSelect
                                id="select-handedness"
                                name={"handedness"}
                                pointerEventProps={pointerEventProps}
                                placeholder={t('initialForm.handedness')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "handedness", value);
                                }}
                                options={[
                                    {
                                        value: 'right',
                                        label: <span {...pointerEventProps}>{t('initialForm.rightHanded')}</span>
                                    },
                                    {
                                        value: 'left', 
                                        label: <span {...pointerEventProps}>{t('initialForm.leftHanded')}</span>
                                    }
                                ]}
                                data-testid="select-handedness"
                            />
                        </Form.Item>
                        <Form.Item>
                            <TrackableSelect
                                id="select-sex"
                                name={"sex"}
                                pointerEventProps={pointerEventProps}
                                placeholder={t('initialForm.sex')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "sex", value);
                                }}
                                options={[
                                    {
                                        value: 'man', 
                                        label: <span {...pointerEventProps}>{t('initialForm.man')}</span>
                                    },
                                    {
                                        value: 'woman', 
                                        label: <span {...pointerEventProps}>{t('initialForm.woman')}</span>
                                    },
                                ]}
                                data-testid="select-sex"
                            />
                        </Form.Item>
                        <TextInputField id="input-birthYear" name={"birthYear"} placeholder={t('initialForm.birthYear')} formData={formData}
                            setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputYear}
                            validateParams={[t('errors.required'), t('errors.invalidYear'), t('errors.yearRange', { year: currentYear - 1 })]} />

                        <Divider />

                        <Form.Item name="frequency" label={t('initialForm.ecommerceFrequency')}>
                            <TrackableSelect
                                id="select-frequency"
                                name={"frequency"}
                                pointerEventProps={pointerEventProps}
                                placeholder={t('initialForm.selectFrequency')}
                                onChange={(value) => modifyStateProperty(formData, setFormData, "frequency", value)}
                                options={[
                                    {
                                        value: 'never', 
                                        label: <span {...pointerEventProps}>{t('initialForm.never')}</span>
                                    },
                                    {
                                        value: 'once_month', 
                                        label: <span {...pointerEventProps}>{t('initialForm.onceMonth')}</span>
                                    },
                                    {
                                        value: '2_3_times_month', 
                                        label: <span {...pointerEventProps}>{t('initialForm.twoThreeTimesMonth')}</span>
                                    },
                                    {
                                        value: '1_3_times_week', 
                                        label: <span {...pointerEventProps}>{t('initialForm.oneThreeTimesWeek')}</span>
                                    },
                                    {
                                        value: 'everyday', 
                                        label: <span {...pointerEventProps}>{t('initialForm.almostEveryday')}</span>
                                    },
                                ]}
                                data-testid="select-frequency"
                            />
                        </Form.Item>

                        <Form.Item label={t('initialForm.deviceQuestion')}>
                            <TrackableSelect
                                id="select-device"
                                name={"device"}
                                pointerEventProps={pointerEventProps}
                                placeholder={t('initialForm.deviceType')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "device", value);
                                }}
                                options={[
                                    {
                                        value: 'computer', 
                                        label: <span {...pointerEventProps}><LaptopOutlined /> {t('initialForm.laptop')}</span>
                                    },
                                    {
                                        value: 'phone', 
                                        label: <span {...pointerEventProps}><MobileOutlined /> {t('initialForm.smartphone')}</span>
                                    },
                                    {
                                        value: 'tablet', 
                                        label: <span {...pointerEventProps}><TabletOutlined /> {t('initialForm.tablet')}</span>
                                    },
                                ]}
                                data-testid="select-device"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            {allowSubmitForm(formData, formErrors, requiredInForm) ?
                                <Button
                                    id="registerButton"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerCancel}
                                    type="primary" size="large" onClick={async () => { 
                                        // Guardar datos del participante en la base de datos
                                        await registerParticipantData({
                                            handedness: formData.handedness || null,
                                            sex: formData.sex || null,
                                            birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
                                            ecommerceFrequency: formData.frequency || null,
                                            preferredDevice: formData.device || null,
                                            selectedLanguage: router.locale || 'es'
                                        });
                                        router.push("/login");
                                    }} block >{t('auth.register')}</Button> :
                                <Button type="primary" size="large" block disabled>{t('auth.register')}</Button>
                            }
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}