import { getShoppingCart } from "@/utils/UtilsProducts";
import { ConfigurableMenu } from "./shared/ConfigurableMenu";
import {Card, Typography, Col, Row, Divider, Button} from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { HorizontalProductCard } from "./shared/HorizontalProductCard";

const {Text, Title} = Typography

export const ShoppingCartComponent = ({}) => {
    const cartItems  = getShoppingCart()
    console.log("cart: ", cartItems)
    return (
        <>
        <ConfigurableMenu text={"Shopping cart"}/>

        <div style={{ padding: "1rem" }}>
            {cartItems.length === 0 ? (
            <Text type="secondary">Your cart is empty.</Text>
            ) : (
            cartItems.map((item, index) => (
                <HorizontalProductCard product={item} index={index}/>
            ))
            )}
        </div>
        </>
    );
}