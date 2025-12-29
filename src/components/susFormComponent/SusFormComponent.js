import { Col, Form, Row, Select, Card, Button, Divider, Rate } from "antd"
import { Steps } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { TextInputField } from "../shared/TextInputField";
import { validateFormDataInputYear, allowSubmitForm } from "../../utils/UtilsValidations"
import { modifyStateProperty } from "../../utils/UtilsState";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { useTranslations } from 'next-intl';
import { FirstSusComponent } from "./FirstSusComponent";
import { SecondSusComponent } from "./SecondSusComponent";
import { ThirdSusComponent } from "./ThirdSusComponent";
import { NumberIndicator } from "../shared/NumberIndicator";

export const SusFormComponent = ({}) => {
    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    let [currentStep, setCurrentStep] = useState(0);
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    const currentYear = new Date().getFullYear();
    let tooltipsFrequency = ["Totalmente en desacuerdo", "En desacuerdo", "Neutro",
        "De acuerdo", "Totalmente de acuerdo"]

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const isStepComplete = () => {
        if (currentStep === 0) {
            return formData.sus1 && formData.sus2 && formData.sus3;
        } else if (currentStep === 1) {
            return formData.sus4 && formData.sus5 && formData.sus6;
        } else if (currentStep === 2) {
            return formData.sus7 && formData.sus8 && formData.sus9 && formData.sus10;
        }
        return false;
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} >
                <Card title={t('susForm.title')} justify="left" align="left">
                    <Steps current={currentStep} style={{ marginBottom: 24 }}>
                        <Steps.Step icon={<NumberIndicator number={1} status={currentStep > 0 ? 'finish' : currentStep === 0 ? 'process' : 'wait'} />}/>
                        <Steps.Step icon={<NumberIndicator number={2} status={currentStep > 1 ? 'finish' : currentStep === 1 ? 'process' : 'wait'} />}/>
                        <Steps.Step icon={<NumberIndicator number={3} status={currentStep > 2 ? 'finish' : currentStep === 2 ? 'process' : 'wait'} />}/>
                    </Steps>
                    {currentStep === 0 && (
                        <>
                            <FirstSusComponent formData={formData} setFormData={setFormData} />
                            <Button type="primary" onClick={handleNext} disabled={!isStepComplete()} style={{ marginTop: 8, width: "100%" }}>
                                {t('common.next')}
                            </Button>
                        </>
                    )}
                    {currentStep === 1 && (
                        <>
                            <SecondSusComponent formData={formData} setFormData={setFormData} />
                            <Row gutter={8} style={{ marginTop: 8 }}>
                                <Col span={12}>
                                    <Button onClick={handlePrevious} style={{ width: "100%" }}>
                                        {t('common.back')}
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type="primary" onClick={handleNext} disabled={!isStepComplete()} style={{ width: "100%" }}>
                                        {t('common.next')}
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <ThirdSusComponent formData={formData} setFormData={setFormData} />
                            <Row gutter={8} style={{ marginTop: 8 }}>
                                <Col span={12}>
                                    <Button onClick={handlePrevious} style={{ width: "100%" }}>
                                        {t('common.back')}
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            router.push('/final');
                                        }}
                                        disabled={!isStepComplete()}
                                        style={{ width: "100%" }}
                                    >
                                        {t('common.finish')}
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>
            </Col>
        </Row>
    );
}