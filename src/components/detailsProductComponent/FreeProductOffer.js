import { Collapse, Input, Button } from "antd-mobile";
import { useState, useEffect } from "react";
import { isEligibleForFree, isProductFree, setItemAsOffer } from "@/utils/UtilsOffer";
import { task3 } from "@/utils/UtilsTasks";
import { useTranslations } from 'next-intl';

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
            <Collapse>
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
                            placeholder={t('freeOffer.placeholder')}
                            value={code}
                            onChange={val => setCode(val)}
                            disabled={isApplied}
                            style={{ fontSize: "0.85rem" }}
                        />
                        <Button color="primary" size="small" onClick={handleApplyCode} disabled={isApplied}>
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
