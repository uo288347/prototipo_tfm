import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar, Row, Col, Divider, Typography, InputNumber } from "antd";
import { useEffect, useRef } from "react";
import { getProduct } from "@/utils/UtilsProducts";
import { LongPressWrapper } from "./LongPressWrapper";
import { useDrag } from 'react-dnd';
import { CheckCircleFilled } from "@ant-design/icons";
import { Stepper } from "antd-mobile";
import { getProductTitle } from "@/utils/UtilsProductTranslations";
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_CARD } from "@/metrics/script_v2";
import { getCurrentSceneId } from "@/metrics/constants/scenes";

const { Text, Title } = Typography;

export const HorizontalProductCard = ({ item, index, isSelected, selectedItems, onClick, updateUnits, enableTracking = true }) => {
    const router = useRouter();
    const locale = router.locale || 'es';
    const t = useTranslations();
    const product = getProduct(item.id);
    const productTitle = getProductTitle(item.id, locale);
    const cardRef = useRef(null);
    const trackingId = `cart-card-${item.id}-${item.size}`;

    // Auto-registro del componente para métricas
    useEffect(() => {
        if (!enableTracking) return;

        const timer = setTimeout(() => {
            const element = cardRef.current;
            if (!element) return;

            const sceneId = getCurrentSceneId();
            if (sceneId === null) return;

            const rect = element.getBoundingClientRect();
            registerComponent(
                sceneId,
                trackingId,
                rect.left + window.scrollX,
                rect.top + window.scrollY,
                rect.right + window.scrollX,
                rect.bottom + window.scrollY,
                COMPONENT_CARD,
                null
            );

            //console.log(`[HorizontalProductCard] Registered ${trackingId} at (${rect.left},${rect.top}) in scene ${sceneId}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [trackingId, enableTracking]);

    const [{ isDragging }, dragRef] = useDrag({
        type: 'CARD',
        item: { draggedId: item.id, selectedItems },
        canDrag: isSelected, // solo si está seleccionada
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    return (
        <div ref={(el) => { cardRef.current = el; dragRef(el); }} style={{ opacity: isDragging ? 0.4 : 1 }} data-trackable-id={trackingId}>
            <Card key={index}
                style={{
                    marginBottom: "1rem",
                    position: "relative",
                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    backgroundColor: isSelected ? '#e6f7ff' : 'white',
                    boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'all 0.2s',
                    height: "160px",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: 0, height: "100%" }}
                onClick={onClick}>

                {/* Check when is selected */}
                {isSelected && (
                    <div style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "white",
                        borderRadius: "50%",
                    }}>
                        <CheckCircleFilled style={{ fontSize: "1.5rem", color: "#1890ff" }} />
                    </div>
                )}
                <Row gutter={16} align="center">
                    {/* Image */}
                    <Col xs={8} sm={6}>
                        <img
                            src={product.images[0]}
                            alt={productTitle}
                            style={{
                                height: "100%",
                                display: "flex",
                                position: "center",
                                alignItems: "center",
                                overflow: "hidden"
                            }}
                        />
                    </Col>

                    {/* Information */}
                    <Col xs={16} sm={18} style={{
                        height: "100%",
                        padding: "0.5rem",

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden"
                    }}>
                        <Title level={5} style={{ fontWeight: "normal", padding: 0, margin: 0 }}>
                            {productTitle}
                        </Title>
                        <Text style={{ marginTop: "0.5rem" }} >{t('product.size')} {item.size}</Text>

                        <Stepper
                            style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                            min={1}
                            max={10}
                            value={item.quantity}
                            onChange={val => updateUnits(product.id, item.size, val)}
                        />
                        <Row align="top" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignContent: "center" }}>
                            <Title level={4} style={{ fontWeight: "normal" }}> 
                                {item.price === 0
                                ? `🎁 ${item.price}€`
                                : `${item.quantity * item.price}€`}</Title>
                            <Button style={{ margin: 0 }}
                                type="link"
                                onClick={() => router.push(`/detailProduct/${item.id}`)}
                            >
                                {t('product.viewProduct')}
                            </Button>
                        </Row>

                    </Col>

                </Row>
            </Card>
        </div>
    );
};

/*
<LongPressWrapper onLongPressRelease={onLongClick}>
            </LongPressWrapper>
*/