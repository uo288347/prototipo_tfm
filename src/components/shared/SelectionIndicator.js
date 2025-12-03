import { Button } from "antd-mobile";
import { useTranslations } from 'next-intl';

export const SelectionIndicator = ({selectionMode, nSelectedItems, cancelSelection}) => {
    const t = useTranslations();
    return (
        <>
        {selectionMode && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#eff6ff",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.75rem",
                        }}>
                            <span style={{
                                fontSize: "0.875rem",
                                color: "#1e3a8a"
                            }}>
                                {nSelectedItems} {t('common.selectedProducts')}
                            </span>
                            <Button size="small" onClick={cancelSelection}>
                                {t('common.cancel')}
                            </Button>
                        </div>
                    )}
                    </>
    );
}