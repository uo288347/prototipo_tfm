import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar, Row, Col, Divider, Typography, InputNumber, Popover } from "antd";
import { useEffect, useRef, useState } from "react";
import { getProduct } from "@/utils/UtilsProducts";
import { isProductFree } from "@/utils/UtilsOffer";
import { CheckCircleFilled } from "@ant-design/icons";
import { useDrag } from 'react-dnd';
import { getProductTitle } from "@/utils/UtilsProductTranslations";
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_CARD } from "@/metrics/scriptTest";
import { getCurrentSceneId } from "@/metrics/scriptTest";

const { Text, Title } = Typography;

export const FavoriteCard = ({item, index, isSelected, selectedItems, onClick, enableTracking = true}) => {
    const router = useRouter();
    const locale = router.locale || 'es';
    const t = useTranslations();
    const product = getProduct(item);
    const productTitle = getProductTitle(item, locale);
    const cardRef = useRef(null);
    const trackingId = `favorite-card-${item}`;
    const [showPopover, setShowPopover] = useState(false);
    const isFree = isProductFree(item);

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

            //console.log(`[FavoriteCard] Registered ${trackingId} at (${rect.left},${rect.top}) in scene ${sceneId}`);
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

    // Manejador para mostrar el popover cuando se hace clic (excepto en el botón)
    const handleCardClick = (e) => {
        // Verificar si el click no fue en el botón o sus hijos
        if (!e.target.closest('button')) {
            setShowPopover(true);
            // Ocultar el popover después de 2 segundos
            setTimeout(() => setShowPopover(false), 2000);
        }
    };

    return (
        <Popover
            content={t('product.holdToSelect') || "Mantén pulsado para seleccionar"}
            open={showPopover}
            onOpenChange={setShowPopover}
        >
            <div 
                ref={(el) => { cardRef.current = el; dragRef(el); }} 
                style={{ opacity: isDragging ? 0.4 : 1 }} 
                data-trackable-id={trackingId}
                onClick={handleCardClick}
            >
            <Card key={index}
                style={{
                    marginBottom: "1rem",
                    position: "relative",
                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    backgroundColor: isSelected ? '#e6f7ff' : 'white',
                    boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'all 0.2s',
                    height: "100px",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: 0, height: "100%" }}>

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
                        <Title level={5} style={{ fontWeight: "normal", paddingTop:"0.5rem" }}>
                            {productTitle}
                        </Title>

                        <Row align="top" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
                            {isFree ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                    <span style={{ fontSize: "0.9rem", textDecoration: "line-through", color: "red" }}>
                                        {product.price}€
                                    </span>
                                    <Title level={4} style={{ fontWeight: "normal", margin: 0 }}>0€</Title>
                                </div>
                            ) : (
                                <Title level={4} style={{ fontWeight: "normal" }}>{product.price}€</Title>
                            )}
                            <Button style={{ margin: 0 }}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/detailProduct/${product.id}`);
                                }}
                            >
                                {t('product.viewProduct')}
                            </Button>
                        </Row>

                    </Col>

                </Row>
            </Card>
        </div>
        </Popover>
    );
}