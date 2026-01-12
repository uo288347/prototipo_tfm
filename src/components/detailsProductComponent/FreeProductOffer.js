import { Collapse, Input, Button } from "antd-mobile";
import { useState, useEffect, useRef } from "react";
import { isEligibleForFree, isProductFree, setItemAsOffer } from "@/utils/UtilsOffer";
import { task3 } from "@/utils/UtilsTasks";
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_TEXT_FIELD, COMPONENT_BUTTON, getCurrentSceneId } from "@/metrics/scriptTest";

export const FreeProductOffer = ({ id, freeCode, isApplied, setIsApplied }) => {
    const t = useTranslations();
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);
    const applyButtonRef = useRef(null);
    const collapseRef = useRef(null);

    useEffect(() => {
        // Si el producto ya está marcado como gratuito, desactivar input y botón
        if (isProductFree(id)) {
            setIsApplied(true);
            setItemAsOffer(id);
            setMessage(t('freeOffer.alreadyFree'));
        }
    }, [id, t]);

    // Registrar componentes cuando el collapse se abre
    const handleCollapseChange = (key) => {
        if (key && key.length > 0) {
            setTimeout(() => {
                const sceneId = getCurrentSceneId();
                // Buscar el input y botón dentro del collapse abierto
                const inputElement = document.querySelector('[placeholder]');
                const buttonElement = document.querySelector('.adm-collapse-content button');
                
                if (inputElement) {
                    const rect = inputElement.getBoundingClientRect();
                    registerComponent("input-free-code", COMPONENT_TEXT_FIELD, sceneId, rect.x, rect.y, rect.width, rect.height);
                }
                if (buttonElement) {
                    const rect = buttonElement.getBoundingClientRect();
                    registerComponent("btn-apply-free-code", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
                }
            }, 300);
        }
    };

    const handleApplyCode = () => {
        // Replace "FREE123" with your real codes logic
        if (isEligibleForFree(id) && code.toUpperCase() === freeCode.toUpperCase()) {
            setMessage(t('freeOffer.success'));
            setIsApplied(true);
            setItemAsOffer(id);
            task3(id, 0);
        } else {
            console.log("is eligible", isEligibleForFree(id))

            setMessage(t('freeOffer.invalid'));
        }
    };

    return (
        <div style={{ marginTop: "0", marginBottom: "1rem" }}>
            <Collapse onChange={handleCollapseChange}>
                <Collapse.Panel
                    key="1"
                    title={t('freeOffer.title')}
                    style={{fontSize: "0.9rem"}}
                >
                    <p>
                        {t('freeOffer.description1')} <strong style={{ color: "red" }}>{t('freeOffer.redCode')}</strong> {t('freeOffer.description2')}
                    </p>
                    <p>
                        {t('freeOffer.description3')} <strong>{t('product.free')}</strong>!
                    </p>
                    <p style={{ fontStyle: "italic", color: "#555" }}>
                        {t('freeOffer.description4')}
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <Input
                            id="input-free-code"
                            data-trackable-id="input-free-code"
                            placeholder={t('freeOffer.placeholder')}
                            value={code}
                            onChange={val => setCode(val)}
                            disabled={isApplied}
                            style={{ fontSize: "0.85rem" }}
                        />
                        <Button id="btn-apply-free-code" data-trackable-id="btn-apply-free-code" color="primary" size="small" onClick={handleApplyCode} disabled={isApplied}>
                            {isApplied ? t('freeOffer.applied') : t('freeOffer.apply')}
                        </Button>
                    </div>
                    {message && (
                        <p style={{ marginTop: "0.5rem", color: message.startsWith("❌") ? "red" : "green" }}>
                            {message}
                        </p>
                    )}
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};
