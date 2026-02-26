import {
    COMPONENT_BUTTON, getCurrentSceneId,
    registerComponent,
    registersus1,
    registersus10,
    registersus2, registersus3, registersus4, registersus5,
    registersus6, registersus7, registersus8, registersus9
} from "@/metrics/scriptTest";
import { clearCart } from "@/utils/UtilsCart";
import { clearFavorites } from "@/utils/UtilsFavorites";
import { clearLogin } from "@/utils/UtilsLogin";
import { Button, Card, Col, Row } from "antd";
import { Steps } from "antd-mobile";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { task10 } from "../../utils/UtilsTasks";
import { NumberIndicator } from "../shared/NumberIndicator";
import { FirstSusComponent } from "./FirstSusComponent";
import { SecondSusComponent } from "./SecondSusComponent";
import { ThirdSusComponent } from "./ThirdSusComponent";

export const SusFormComponent = ({}) => {
    const t = useTranslations();
    const router = useRouter();
    let [formData, setFormData] = useState({})
    let [currentStep, setCurrentStep] = useState(0);
    // Definir los campos requeridos por pantalla
    const requiredInForm = [
        ['sus1', 'sus2', 'sus3'],
        ['sus4', 'sus5', 'sus6'],
        ['sus7', 'sus8', 'sus9', 'sus10']
    ];
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

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    // Valida si todos los campos requeridos para el paso actual están completos
    const isStepComplete = () => {
        return requiredInForm[currentStep]
        .every(field => {
            const val = formData[field];
            return val !== undefined && val !== null && val !== '' && val !== 0;
        });
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
                            {isStepComplete() ?
                                <Button ref={nextButtonRef} id="btn-sus-next" data-trackable-id="btn-sus-next" type="primary" onClick={handleNext} style={{ marginTop: 8, width: "100%" }}>
                                    {t('common.next')}
                                </Button>
                                :
                                <Button type="primary" style={{ marginTop: 8, width: "100%" }} disabled>{t('common.next')}</Button>
                            }
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
                                    {isStepComplete() ?
                                        <Button ref={nextButtonRef} id="btn-sus-next" data-trackable-id="btn-sus-next" type="primary" onClick={handleNext} style={{ width: "100%" }}>
                                            {t('common.next')}
                                        </Button>
                                        :
                                        <Button type="primary" style={{ width: "100%" }} disabled>{t('common.next')}</Button>
                                    }
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
                                        onClick={async () => {
                                            const susAnswers = [
                                                formData.sus1, formData.sus2, formData.sus3, formData.sus4, formData.sus5,
                                                formData.sus6, formData.sus7, formData.sus8, formData.sus9, formData.sus10
                                            ];
                                            // Si alguna respuesta falta, no continuar
                                            if (susAnswers.some(v => v == null)) return;
                                            registersus1(formData.sus1);
                                            registersus2(formData.sus2);
                                            registersus3(formData.sus3);
                                            registersus4(formData.sus4);
                                            registersus5(formData.sus5);
                                            registersus6(formData.sus6);
                                            registersus7(formData.sus7);
                                            registersus8(formData.sus8);
                                            registersus9(formData.sus9);
                                            registersus10(formData.sus10);
                                            router.push('/final');
                                            task10();
                                            clearCart();
                                            clearFavorites();
                                            clearLogin();
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