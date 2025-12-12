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

export const SusFormComponent = () => {
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

    return (
        <Row align="middle" justify="center" style={{ minHeight: "100%", minWidth: "100%" }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7} >
                <Card title={"Formulario final"} justify="left" align="left">
                    <Steps current={currentStep} style={{ marginBottom: 24 }}>
                        <Steps.Step icon={<span>1</span>}/>
                        <Steps.Step icon={<span>2</span>}/>
                        <Steps.Step icon={<span>3</span>}/>
                    </Steps>
                    {currentStep === 0 && (
                        <>
                            <FirstSusComponent formData={formData} setFormData={setFormData} />
                            <Button type="primary" onClick={handleNext} style={{ marginTop: 8, width: "100%" }}>
                                Siguiente
                            </Button>
                        </>
                    )}
                    {currentStep === 1 && (
                        <>
                            <SecondSusComponent formData={formData} setFormData={setFormData} />
                            <Row gutter={8} style={{ marginTop: 8 }}>
                                <Col span={12}>
                                    <Button onClick={handlePrevious} style={{ width: "100%" }}>
                                        Anterior
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type="primary" onClick={handleNext} style={{ width: "100%" }}>
                                        Siguiente
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
                                        Anterior
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type="primary" onClick={() => router.push('/end')} style={{ width: "100%" }}>
                                        Finalizar
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