import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar, Row, Col, Divider, Typography, InputNumber } from "antd";
import { getProduct } from "@/utils/UtilsProducts";
import { LongPressWrapper } from "./LongPressWrapper";
import { useDrag } from 'react-dnd';

const {Text, Title} = Typography;

export const HorizontalProductCard = ({item, index, isSelected, selectedItems , onClick, onLongClick}) => {
    const router = useRouter();
    const product = getProduct(item.id);

    const [{ isDragging }, dragRef] = useDrag({
        type: 'CARD',
        item: { draggedId: item.id, selectedItems  },
        canDrag: isSelected, // solo si está seleccionada
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    return (
        <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <LongPressWrapper onLongPressRelease={onLongClick}>
                <Card key={index} 
                style={{
                marginBottom: "1rem", position: "relative",
                border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                backgroundColor: isSelected ? '#e6f7ff' : 'white',
                }}
                bodyStyle={{padding:0}}
                onClick={onClick}>
                    <Row gutter={16} align="middle">
                    {/* Imagen a la izquierda */}
                    <Col xs={8} sm={6}>
                        <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{
                            width: "100%", height:"150px",
                            margin:"0", padding:0,
                            objectPosition:"top",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                        />
                    </Col>

                    {/* Información a la derecha */}
                    <Col xs={16} sm={18}>
                        <Title level={5} >
                        {product.title}
                        </Title>
                        <Text >Size {item.size}</Text>
                        <br />
                        <Text >Number of units</Text>
                        <InputNumber
                        style={{marginBottom: "0.5rem", marginTop: "0.1rem", marginLeft: "0.5rem"}} 
                        value={item.quantity}
                        min={1}
                        max={10}
                        onChange={(value) => updateUnits(product.id, value)}></InputNumber>
                        <br />
                        <Row align="middle" style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignContent:"bottom"}}>
                            <Title level={3}> <strong>{product.price}€</strong><Text> /unit</Text></Title> 
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
        </LongPressWrapper>
        </div>
    );
};