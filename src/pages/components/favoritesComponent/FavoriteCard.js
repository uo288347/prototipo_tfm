import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar, Row, Col, Divider, Typography, InputNumber } from "antd";
import { getProduct } from "@/utils/UtilsProducts";
import { CheckCircleFilled } from "@ant-design/icons";
import { useDrag } from 'react-dnd';

const { Text, Title } = Typography;

export const FavoriteCard = ({item, index, isSelected, selectedItems, onClick}) => {
    const router = useRouter();
    const product = getProduct(item);

    const [{ isDragging }, dragRef] = useDrag({
            type: 'CARD',
            item: { draggedId: item.id, selectedItems },
            canDrag: isSelected, // solo si está seleccionada
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

    return (
        <div ref={dragRef} style={{ opacity: isDragging ? 0.4 : 1, }}>
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
                            alt={product.title}
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
                            {product.title}
                        </Title>

                        <Row align="top" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignContent: "center", }}>
                            <Title level={4} style={{ fontWeight: "normal" }}>{product.price}€</Title>
                            <Button style={{ margin: 0 }}
                                type="link"
                                onClick={() => router.push(`/detailProduct/${item.id}`)}
                            >
                                View Product
                            </Button>
                        </Row>

                    </Col>

                </Row>
            </Card>
        </div>
    );
}