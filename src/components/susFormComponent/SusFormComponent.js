import { Col, Form, Row, Select, Card, Button, Divider, Rate } from "antd"
import { Steps } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { TextInputField } from "../shared/TextInputField";
import { validateFormDataInputYear, allowSubmitForm } from "../../utils/UtilsValidations"
import { modifyStateProperty } from "../../utils/UtilsState";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { useTranslations } from 'next-intl';
import { FirstSusComponent } from "./FirstSusComponent";
import { SecondSusComponent } from "./SecondSusComponent";
import { ThirdSusComponent } from "./ThirdSusComponent";
import { NumberIndicator } from "../shared/NumberIndicator";
import { task10 } from "../../utils/UtilsTasks";
import { registerComponent, COMPONENT_BUTTON, getCurrentSceneId } from "@/metrics/scriptTest";

export const SusFormComponent = ({}) => {
    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    let [currentStep, setCurrentStep] = useState(0);
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})
    const nextButtonRef = useRef(null);
    const backButtonRef = useRef(null);
    const finishButtonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (nextButtonRef.current) {
                const rect = nextButtonRef.current.getBoundingClientRect();
                registerComponent("btn-sus-next", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
            if (backButtonRef.current) {
                const rect = backButtonRef.current.getBoundingClientRect();
                registerComponent("btn-sus-back", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
            if (finishButtonRef.current) {
                const rect = finishButtonRef.current.getBoundingClientRect();
                registerComponent("btn-sus-finish", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [currentStep]);

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
                            <Button ref={nextButtonRef} id="btn-sus-next" data-trackable-id="btn-sus-next" type="primary" onClick={handleNext} disabled={!isStepComplete()} style={{ marginTop: 8, width: "100%" }}>
                                {t('common.next')}
                            </Button>
                        </>
                    )}
                    {currentStep === 1 && (
                        <>
                            <SecondSusComponent formData={formData} setFormData={setFormData} />
                            <Row gutter={8} style={{ marginTop: 8 }}>
                                <Col span={12}>
                                    <Button ref={backButtonRef} id="btn-sus-back" data-trackable-id="btn-sus-back" onClick={handlePrevious} style={{ width: "100%" }}>
                                        {t('common.back')}
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button ref={nextButtonRef} id="btn-sus-next" data-trackable-id="btn-sus-next" type="primary" onClick={handleNext} disabled={!isStepComplete()} style={{ width: "100%" }}>
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
                                    <Button ref={backButtonRef} id="btn-sus-back" data-trackable-id="btn-sus-back" onClick={handlePrevious} style={{ width: "100%" }}>
                                        {t('common.back')}
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        ref={finishButtonRef}
                                        id="btn-sus-finish"
                                        data-trackable-id="btn-sus-finish"
                                        type="primary"
                                        onClick={() => {
                                            task10();
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