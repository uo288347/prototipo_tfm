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

export const InitialFormComponent = ({ }) => {
    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    //let requiredInForm = ["handedness","sex","birthYear","rating"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    const currentYear = new Date().getFullYear();
    let tooltipsFrequency = [t('initialForm.never'), t('initialForm.onceMonth'), t('initialForm.twoThreeTimesMonth'), t('initialForm.oneThreeTimesWeek'), t('initialForm.almostEveryday')]

    return (
        <Row align="middle" justify="center" style={{  minHeight:"100%", minWidth:"100%"}}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} justify="center" >
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                    <LanguageSwitcher />
                </div>
            <Card title={t('initialForm.title')}>
            <Form>
                <Form.Item>
                    <Select
                        placeholder={t('initialForm.handedness')}
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "handedness", value);
                        }}
                        options={[
                            { value: 'right', label: <span>{t('initialForm.rightHanded')}</span> },
                            { value: 'left', label: <span>{t('initialForm.leftHanded')}</span> },
                        ]}
                    />
                </Form.Item>
                <Form.Item>
                    <Select
                        placeholder={t('initialForm.sex')}
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "sex", value);
                        }}
                        options={[
                            { value: 'man', label: <span>{t('initialForm.man')}</span> },
                            { value: 'woman', label: <span>{t('initialForm.woman')}</span> },
                        ]}
                    />
                </Form.Item>
                <TextInputField name={"birthYear"} placeholder={t('initialForm.birthYear')} formData={formData}
                    setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputYear}
                    validateParams={[t('errors.required'), t('errors.invalidYear'), t('errors.yearRange', { year: currentYear - 1 })]} />

                <Divider/>

                <Form.Item name="frequency" label={t('initialForm.ecommerceFrequency')}>
                    <Select
                        placeholder={t('initialForm.selectFrequency')}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "frequency", value)}
                        options={[
                            { value: 'never', label: t('initialForm.never') },
                            { value: 'once_month', label: t('initialForm.onceMonth') },
                            { value: '2_3_times_month', label: t('initialForm.twoThreeTimesMonth') },
                            { value: '1_3_times_week', label: t('initialForm.oneThreeTimesWeek') },
                            { value: 'everyday', label: t('initialForm.almostEveryday') },
                        ]}
                    />
                </Form.Item>

                <Form.Item label={t('initialForm.deviceQuestion')}>
                    <Select
                        placeholder={t('initialForm.deviceType')}
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "device", value);
                        }}
                        options={[
                            { value: 'computer', label: <span><LaptopOutlined /> {t('initialForm.laptop')}</span> },
                            { value: 'phone', label: <span><MobileOutlined /> {t('initialForm.smartphone')}</span> },
                            { value: 'tablet', label: <span><TabletOutlined /> {t('initialForm.tablet')}</span> },
                        ]}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" size="large" onClick={() => { router.push("/login") }} block >{t('auth.register')}</Button> :
                        <Button type="primary" size="large" block disabled>{t('auth.register')}</Button>
                    }
                </Form.Item>
            </Form>
        </Card>
        </Col>
    </Row>
    );
}