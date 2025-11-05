import {useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Card, Carousel, Image, Button, Link, Row, Col, Select, InputNumber, FloatButton, Breadcrumb } from 'antd';
const { Title, Paragraph } = Typography;
import { addToCart, getProduct } from "@/utils/UtilsProducts";
import { StandardMenu } from "../shared/StandardMenu";
import { useFormState } from "react-dom";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { openNotification } from "@/utils/UtilsNotifications";
import { ImageCarousel } from "./ImageCarousel";

let DetailsProductComponent  = ({id}) => {
    const router = useRouter();
    let [product, setProduct] = useState({})
    let [selectedSize, setSelectedSize] = useState(null)
    let [quantity, setQuantity] = useState(1)
    let [favorite, setFavorite] = useState(false)

    let toggleFavorite = () => {
        if(!favorite) openNotification("top", "Product added to favorites", "success")
        else openNotification("top", "Deleted product from favorites", "success")
        setFavorite(!favorite)
        
    }

    let addToShoppingCart = () => {
        addToCart(id, selectedSize, quantity)
        console.log("product added to cart")
        openNotification("top", "Product added to shopping cart", "success")
    };

    useEffect(() => {
        let p = getProduct(id);
        console.log("product: ",p)
        setProduct(p);
    }, [])

    const { Text } = Typography;

    let options = [
                { value: 'S', label: "S" },
                { value: 'M', label: "M" },
                { value: 'L', label: "L" },
                { value: 'XL', label: "XL" },
                ]

    return (
        <>
        <Row >
            <Col xs={24}>
                <ImageCarousel product={product}/>
            </Col>
        </Row>
       
        {/* 📦 Información del producto */}
        <Row gutter={16} style={{ padding: "1rem" }}>
            <Col xs={24}>
            <Row style={{ paddingBottom: "0.5rem", }}>
                <Breadcrumb
                items={[{title: <a href="/home">Home</a>,},
                        {title: <a href="/home">{product.category}</a>}]}
                />
            </Row>
            <Row align="middle" justify="space-between" style={{ paddingBottom: "0.5rem", }}>
                <Title level={3} style={{ margin: 0 }}>
                {product.title}
                </Title>

                <Button size="large" style={{border:"none"}} 
                onClick={() => toggleFavorite()}
                icon={favorite ? <HeartFilled style={{fontSize:"30px", color: "#b90104ff"}}/> : <HeartOutlined style={{fontSize:"30px"}}/>}/>
                
            </Row>

            <Row align="middle" style={{ paddingBottom: "1rem" }}>
            <Text style={{ fontSize: "1rem", color: "#666" }}>
                {product.description}
            </Text>
            </Row>
            
            <Row align="middle" style={{ paddingBottom: "1rem" }}>
            <Select
                style={{width:"50%"}}
                placeholder="Select size"
                value={options[0].value}
                onChange={(value) => {setSelectedSize(value)}}
                options={options}
            >
            </Select>
            </Row>
            
            <Row align="middle" style={{ paddingBottom: "1rem" }}>
                <Col xs={12}>
                    <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    style={{ width: 120 }}
                    controls={true}
                    />
                </Col>
                <Col xs={12} align="right">
                    <Title level={1} >
                    {product.price}€
                    </Title>
                </Col>
            </Row>
            
            <Button type="primary" block id={product.id} 
                onClick={addToShoppingCart}
            >Add to cart</Button>
            </Col>
        </Row>
    </>
    )
}

export default DetailsProductComponent;
