import { getCurrentSceneId } from "@/metrics/constants/scenes";
import { COMPONENT_BUTTON, COMPONENT_COMBOBOX, COMPONENT_TEXT_FIELD, registerComponent } from "@/metrics/scriptTest";
import { isEligibleForFree, isProductFree, setItemAsOffer } from "@/utils/UtilsOffer";
import { task3 } from "@/utils/UtilsTasks";
import { Button, Collapse, Input } from "antd-mobile";
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";

export const FreeProductOffer = ({ id, freeCode, isApplied, setIsApplied }) => {
    const t = useTranslations();
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

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
                if (sceneId === null) return;

                // Registrar el collapse/desplegable (header del panel)
                const collapseHeader = document.querySelector('.adm-collapse');
                if (collapseHeader) {
                    const rect = collapseHeader.getBoundingClientRect();
                    collapseHeader.setAttribute('data-trackable-id', 'collapse-free-offer');
                    registerComponent(sceneId, 'collapse-free-offer', rect.left + window.scrollX, rect.top + window.scrollY,
                        rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_COMBOBOX, null);
                    //collapseHeader.setAttribute('data-trackable-id', 'collapse-free-offer');
                }

                // Registrar el input de código - buscar por clase de antd-mobile dentro del wrapper
                const inputWrapper = document.getElementById('input-free-code-wrapper');
                const inputElement = inputWrapper?.querySelector('.adm-input-element');
                if (inputElement) {
                    const rect = inputElement.getBoundingClientRect();
                    registerComponent(sceneId, 'input-free-code', rect.left + window.scrollX, rect.top + window.scrollY,
                        rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_TEXT_FIELD, null);
                    inputElement.setAttribute('data-trackable-id', 'input-free-code');
                }

                // Registrar el botón de aplicar - buscar por clase de antd-mobile dentro del wrapper
                const buttonWrapper = document.getElementById('btn-apply-free-code-wrapper');
                const buttonElement = buttonWrapper?.querySelector('.adm-button');
                if (buttonElement) {
                    const rect = buttonElement.getBoundingClientRect();
                    registerComponent(sceneId, 'btn-apply-free-code', rect.left + window.scrollX, rect.top + window.scrollY,
                        rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_BUTTON, null);
                    buttonElement.setAttribute('data-trackable-id', 'btn-apply-free-code');
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
            //console.log("is eligible", isEligibleForFree(id))

            setMessage(t('freeOffer.invalid'));
        }
    };

    return (
        <div style={{ marginTop: "0", marginBottom: "1rem" }}>
            <Collapse onChange={handleCollapseChange}>
                <Collapse.Panel
                    key="1"
                    title={t('freeOffer.title')}
                    style={{fontSize: "0.9rem", color: "#000"}}
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
                        <div id="input-free-code-wrapper" style={{ flex: 1 }}>
                            <Input
                                placeholder={t('freeOffer.placeholder')}
                                value={code}
                                onChange={val => setCode(val)}
                                disabled={isApplied}
                                style={{ fontSize: "0.85rem" }}
                            />
                        </div>
                        <div id="btn-apply-free-code-wrapper">
                            <Button color="primary" size="small" onClick={handleApplyCode} disabled={isApplied}>
                                {isApplied ? t('freeOffer.applied') : t('freeOffer.apply')}
                            </Button>
                        </div>
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
