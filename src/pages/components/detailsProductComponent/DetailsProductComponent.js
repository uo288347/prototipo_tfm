import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Card, Carousel, Image, Button, Link, Row, Col, Select, InputNumber, FloatButton, Breadcrumb, Radio } from 'antd';
const { Title, Paragraph } = Typography;
import { getProduct } from "@/utils/UtilsProducts";
import { addToCart } from "@/utils/UtilsCart";
import { StandardMenu } from "../shared/StandardMenu";
import { useFormState } from "react-dom";
import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { openNotification } from "@/utils/UtilsNotifications";
import { ImageCarousel } from "./ImageCarousel";
import { Step } from "antd-mobile/es/components/steps/step";
import { Stepper } from "antd-mobile";
import { HeartFill, HeartOutline } from "antd-mobile-icons";
import { getFavorite, toggleFavorite } from "@/utils/UtilsFavorites";

let DetailsProductComponent = ({ id }) => {
    const router = useRouter();
    let [product, setProduct] = useState({})
    let [selectedSize, setSelectedSize] = useState("S")
    let [quantity, setQuantity] = useState(1)
    let [favorite, setFavorite] = useState(false)

    let onToggleFavorite = () => {
        toggleFavorite(id)
        setFavorite(getFavorite(id))
        if (!favorite) {
            openNotification("top", "Product added to favorites", "success")
        } else { openNotification("top", "Deleted product from favorites", "success") }
    }

    let addToShoppingCart = () => {
        addToCart(id, selectedSize, quantity)
        console.log("product added to cart")
        openNotification("top", "Product added to shopping cart", "success")
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    useEffect(() => {
        let p = getProduct(id);
        console.log("product: ", p)
        setProduct(p);
    }, [])

    const { Text } = Typography;

    const sizes = ["S", "M", "L", "XL"];
    return (
        <>
            <Row >
                <Col xs={24}>
                    <ImageCarousel product={product} />
                </Col>
            </Row>

            {/* 📦 Información del producto */}
            <Row gutter={16} style={{ padding: "1rem" }}>
                <Col xs={24}>
                    <Row style={{ paddingBottom: "0.5rem", }}>
                        <Breadcrumb
                            items={[{ title: <a href="/home">Home</a>, },
                            { title: <a href="/home">{product.category}</a> }]}
                        />
                    </Row>
                    <Row align="middle" justify="space-between" style={{
                        paddingBottom: "0.5rem", display: "flex",
                        flexWrap: "nowrap",
                        gap: "0.5rem",
                    }}>
                        <Title level={3} style={{
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flex: "1 1 auto", 
                            minWidth: 0, 
                        }}>
                            {product.title}
                        </Title>

                        <Button size="large" style={{ border: "none", flex: "0 0 auto" }}
                            onClick={() => onToggleFavorite()}
                            icon={favorite ? <HeartFill style={{ fontSize: "30px", color: "#b90104ff" }} /> : <HeartOutline style={{ fontSize: "30px" }} />} />

                    </Row>

                    <Row align="middle" style={{ paddingBottom: "1rem" }}>
                        <Text style={{ fontSize: "1rem", color: "#666" }}>
                            {product.description}
                        </Text>
                    </Row>

                    <Row align="middle" style={{ paddingBottom: "1rem" }}>
                        <Radio.Group value={selectedSize}
                            onChange={handleSizeChange}>
                            {sizes.map((size) => (
                                <Radio.Button
                                    key={size}
                                    value={size}
                                    style={{
                                        backgroundColor: selectedSize === size ? "black" : undefined,
                                        color: selectedSize === size ? "white" : undefined,
                                        borderColor: selectedSize === size ? "black" : undefined,
                                    }}
                                >
                                    {size}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Row>

                    <Row align="top" style={{ paddingBottom: "1rem" }}>
                        <Col xs={12}>
                            <Stepper style={{ marginTop: "0.5rem", }}
                                min={1}
                                max={10}
                                value={quantity}
                                onChange={val => setQuantity(val)} />
                        </Col>
                        <Col xs={12} align="right">
                            <Title level={1} >
                                {product.price}€
                            </Title>
                        </Col>
                    </Row>

                    <Button type="primary" block id={product.id}
                        onClick={addToShoppingCart}
                        icon={<ShoppingCartOutlined />}
                    >Add to cart</Button>
                </Col>
            </Row>
        </>
    )
}

export default DetailsProductComponent;
