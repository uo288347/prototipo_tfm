import { Col, Form, Row, Select, Card, Rate, Button, Divider } from "antd"
//import { Form  } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { TextInputField } from "./shared/TextInputField";
import { validateFormDataInputYear, allowSubmitForm } from "../utils/UtilsValidations"
import { modifyStateProperty } from "../utils/UtilsState";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./shared/LanguageSwitcher";
import useGestureDetector from "@/metrics/GestureDetectorHook";
import { registerComponent, trackWithEvent, EVENT_ON_POINTER_DOWN } from "@/metrics/scriptTest";
import { SCENES } from "@/metrics/constants/scenes";

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

    function registerSelectOptions(selectId) {
        const options = document.querySelectorAll('.ant-select-dropdown .ant-select-item');
        options.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            registerComponent(
                SCENES.INITIAL_FORM,
                `${selectId}-option-${index}`,
                rect.left + window.scrollX,
                rect.top + window.scrollY,
                rect.right + window.scrollX,
                rect.bottom + window.scrollY,
                COMPONENT_OPTION,
                selectId
            );

            console.log(`Registered OPTION -> ${selectId}-option-${index} at (${rect.left + window.scrollX},${rect.top + window.scrollY})`);
            el.addEventListener('pointerdown', (e) => {
                trackWithEvent(EVENT_ON_POINTER_DOWN, e);
            });
        });
    }


    // Integrar los eventos pointer en todos los elementos del formulario
    // y registrar los gestos con scriptTest.js
    const pointerEventProps = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <Card title={t('initialForm.title')}>
                    <Form {...pointerEventProps}>
                        <Form.Item {...pointerEventProps} id="handedness" name="handedness">
                            <Select
                                id="select-handedness"
                                name={"handedness"}
                                {...pointerEventProps}
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
                                        value: 'left', label: <span {...pointerEventProps}>{t('initialForm.leftHanded')}</span>
                                    }
                                ]}
                                data-testid="select-handedness"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Select
                                id="select-sex"
                                name={"sex"}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerCancel}
                                placeholder={t('initialForm.sex')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "sex", value);
                                }}
                                onOpenChange={(open) => {
                                    if (open) registerSelectOptions("select-handedness");
                                }}
                                options={[
                                    {
                                        value: 'man', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.man')}</span>
                                    },
                                    {
                                        value: 'woman', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.woman')}</span>
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
                            <Select
                                id="select-frequency"
                                name={"frequency"}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerCancel}
                                placeholder={t('initialForm.selectFrequency')}
                                onChange={(value) => modifyStateProperty(formData, setFormData, "frequency", value)}
                                options={[
                                    {
                                        value: 'never', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.never')}</span>
                                    },
                                    {
                                        value: 'once_month', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.onceMonth')}</span>
                                    },
                                    {
                                        value: '2_3_times_month', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.twoThreeTimesMonth')}</span>
                                    },
                                    {
                                        value: '1_3_times_week', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.oneThreeTimesWeek')}</span>
                                    },
                                    {
                                        value: 'everyday', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        >{t('initialForm.almostEveryday')}</span>
                                    },
                                ]}
                                data-testid="select-frequency"
                            />
                        </Form.Item>

                        <Form.Item label={t('initialForm.deviceQuestion')}>
                            <Select
                                id="select-device"
                                name={"device"}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerCancel}
                                placeholder={t('initialForm.deviceType')}
                                onChange={(value) => {
                                    modifyStateProperty(formData, setFormData, "device", value);
                                }}
                                options={[
                                    {
                                        value: 'computer', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        ><LaptopOutlined /> {t('initialForm.laptop')}</span>
                                    },
                                    {
                                        value: 'phone', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        ><MobileOutlined /> {t('initialForm.smartphone')}</span>
                                    },
                                    {
                                        value: 'tablet', label: <span
                                            onPointerDown={handlePointerDown}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onPointerCancel={handlePointerCancel}
                                        ><TabletOutlined /> {t('initialForm.tablet')}</span>
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
                                    type="primary" size="large" onClick={() => { router.push("/login") }} block >{t('auth.register')}</Button> :
                                <Button type="primary" size="large" block disabled>{t('auth.register')}</Button>
                            }
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}