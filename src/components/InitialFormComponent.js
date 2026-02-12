import { Button, Card, Col, Divider, Form, Row } from "antd";
//import { Form  } from "antd-mobile";
import { getCurrentSceneId } from "@/metrics/scriptTest";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { COMPONENT_BUTTON, getUser, registerbirth_year, registerComponent, registerecommerce_frequency, registerhandedness, registerpreferred_device, registersex } from "../metrics/scriptTest";
import { modifyStateProperty } from "../utils/UtilsState";
import { allowSubmitForm, validateFormDataInputYear } from "../utils/UtilsValidations";
import { TextInputField } from "./shared/TextInputField";
import { TrackableSelect } from "./shared/TrackableSelect";
import { useScene } from "@/experiment/useScene";
import { SCENES } from "@/metrics/constants/scenes";

export const InitialFormComponent = ({ }) => {

    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    let requiredInForm = ["handedness","sex","birthYear","frequency", "device"]
    //let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    const currentYear = new Date().getFullYear();

    const scene = useScene(SCENES.INITIAL_FORM);

    useEffect(() => {
        scene.start();

        return () => {
            scene.end();
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const sceneId = getCurrentSceneId();
            //console.log("Current Scene ID in InitialFormComponent: " + sceneId);
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

    const user = getUser();
    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
            <div>{user}</div>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <Card title={t('initialForm.title')}>
                    <Form >
                        <Form.Item id="handedness" name="handedness">
                            <TrackableSelect
                                id="select-handedness"
                                name={"handedness"}
                                placeholder={t('initialForm.handedness')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "handedness", value);
                                }}
                                options={[
                                    {
                                        value: 'right',
                                        label: <span>{t('initialForm.rightHanded')}</span>
                                    },
                                    {
                                        value: 'left',
                                        label: <span>{t('initialForm.leftHanded')}</span>
                                    }
                                ]}
                                data-testid="select-handedness"
                            />
                        </Form.Item>
                        <Form.Item>
                            <TrackableSelect
                                id="select-sex"
                                name={"sex"}
                                placeholder={t('initialForm.sex')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "sex", value);
                                }}
                                options={[
                                    {
                                        value: 'man',
                                        label: <span>{t('initialForm.man')}</span>
                                    },
                                    {
                                        value: 'woman',
                                        label: <span>{t('initialForm.woman')}</span>
                                    },
                                ]}
                                data-testid="select-sex"
                            />
                        </Form.Item>
                        <TextInputField id="input-birthYear" name={"birthYear"} placeholder={t('initialForm.birthYear')} formData={formData}
                            setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputYear}
                            validateParams={[t('errors.required'), t('errors.invalidYear'), t('errors.yearRange', { year: currentYear - 1 })]} inputMode="numeric" />

                        <Divider />

                        <Form.Item name="frequency" label={t('initialForm.ecommerceFrequency')}>
                            <TrackableSelect
                                id="select-frequency"
                                name={"frequency"}
                                placeholder={t('initialForm.selectFrequency')}
                                onChange={(value) => modifyStateProperty(formData, setFormData, "frequency", value)}
                                options={[
                                    {
                                        value: 'never',
                                        label: <span>{t('initialForm.never')}</span>
                                    },
                                    {
                                        value: 'once_month',
                                        label: <span>{t('initialForm.onceMonth')}</span>
                                    },
                                    {
                                        value: '2_3_times_month',
                                        label: <span>{t('initialForm.twoThreeTimesMonth')}</span>
                                    },
                                    {
                                        value: '1_3_times_week',
                                        label: <span>{t('initialForm.oneThreeTimesWeek')}</span>
                                    },
                                    {
                                        value: 'everyday',
                                        label: <span>{t('initialForm.almostEveryday')}</span>
                                    },
                                ]}
                                data-testid="select-frequency"
                            />
                        </Form.Item>

                        <Form.Item label={t('initialForm.deviceQuestion')}>
                            <TrackableSelect
                                id="select-device"
                                name={"device"}
                                placeholder={t('initialForm.deviceType')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "device", value);
                                }}
                                options={[
                                    {
                                        value: 'computer',
                                        label: <span><LaptopOutlined /> {t('initialForm.laptop')}</span>
                                    },
                                    {
                                        value: 'phone',
                                        label: <span><MobileOutlined /> {t('initialForm.smartphone')}</span>
                                    },
                                    {
                                        value: 'tablet',
                                        label: <span><TabletOutlined /> {t('initialForm.tablet')}</span>
                                    },
                                ]}
                                data-testid="select-device"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            {allowSubmitForm(formData, formErrors, requiredInForm) ?
                                <Button
                                    id="registerButton"
                                    type="primary" size="large" onClick={async () => {
                                        registerhandedness(formData.handedness || null);
                                        registersex(formData.sex || null);
                                        registerbirth_year(formData.birthYear ? parseInt(formData.birthYear) : null);
                                        registerecommerce_frequency(formData.frequency || null);
                                        registerpreferred_device(formData.device || null);
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