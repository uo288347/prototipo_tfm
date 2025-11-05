import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  LaptopOutlined,
  SkinOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { getProduct } from "@/utils/UtilsProducts";

const {Meta} = Card;

export const HorizontalProductCard = ({item, index}) => {
    const product = getProduct(item.id);
    console.log("product: ", product)

    return (
                <Card key={index} style={{ marginBottom: "1rem" }}>
                    <Row gutter={16} align="middle">
                    {/* Imagen a la izquierda */}
                    <Col xs={8} sm={6}>
                        <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            objectFit: "cover",
                        }}
                        />
                    </Col>

                    {/* Información a la derecha */}
                    <Col xs={16} sm={18}>
                        <Title level={4} style={{ marginBottom: 0 }}>
                        {product.title}
                        </Title>
                        <Text type="secondary">{product.description}</Text>
                        <Divider />
                        <Text>
                        <strong>Size:</strong> {item.size}
                        </Text>
                        <br />
                        <Text>
                        <strong>Quantity:</strong> {item.quantity}
                        </Text>
                        <br />
                        <Text>
                        <strong>Price:</strong> {product.price}€
                        </Text>
                        <Divider />
                        <Button
                        type="primary"
                        onClick={() => router.push(`/detailProduct/${item.id}`)}
                        >
                        View Product
                        </Button>
                    </Col>
                    </Row>
                </Card>
    );
};