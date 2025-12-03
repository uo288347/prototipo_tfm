import { Card, Typography, Col, Row } from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { getProductTitle } from "@/utils/UtilsProductTranslations";
import { useTranslations } from 'next-intl';

const { Text } = Typography;

export const GhostFavoriteCard = ({ dragGhostPosition, selectedItems, locale }) => {
    const t = useTranslations();

    return (
        <div
            style={{
                position: 'fixed',
                left: dragGhostPosition.x,
                top: dragGhostPosition.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: 0.85,
                transition: 'none',
            }}
        >
            <div style={{ position: 'relative' }}>
                {/* Renderizar 1-2 cards como muestra */}
                {Array.from(selectedItems).slice(0, 2).map((productId, index) => {
                    const product = getProduct(productId);
                    if (!product) return null;

                    const productTitle = getProductTitle(productId, locale || 'es');

                    return (
                        <div
                            key={productId}
                            style={{
                                position: index === 0 ? 'relative' : 'absolute',
                                top: index === 0 ? 0 : '8px',
                                left: index === 0 ? 0 : '8px',
                                width: '280px',
                                marginBottom: index === 0 ? '4px' : 0,
                                transform: index === 1 ? 'scale(0.95)' : 'scale(1)',
                                opacity: index === 1 ? 0.7 : 1,
                            }}
                        >
                            <Card
                                style={{
                                    border: '2px solid #1890ff',
                                    backgroundColor: '#e6f7ff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                    height: '100px',
                                    overflow: 'hidden',
                                }}
                                bodyStyle={{ padding: '8px', height: '100%' }}
                            >
                                <Row gutter={8} style={{ height: '100%' }}>
                                    <Col span={8} style={{ height: '100%' }}>
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '4px'
                                        }}>
                                            <img
                                                src={product?.images?.[0]}
                                                alt={productTitle}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={16}>
                                        <div style={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <Text 
                                                strong 
                                                ellipsis 
                                                style={{ 
                                                    fontSize: '13px',
                                                    display: 'block',
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                {productTitle}
                                            </Text>
                                            <Text strong style={{ fontSize: '14px' }}>
                                                {product.price}€
                                            </Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    );
                })}

                {/* Badge con el número total si hay más de 1 item */}
                {selectedItems.size > 1 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#1890ff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            border: '2px solid white',
                        }}
                    >
                        {selectedItems.size}
                    </div>
                )}
            </div>
        </div>
    );
};
