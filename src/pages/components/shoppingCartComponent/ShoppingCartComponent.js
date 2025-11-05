import { getShoppingCart, deleteFromCart } from "@/utils/UtilsProducts";
import { ConfigurableMenu } from "../shared/ConfigurableMenu";
import {Card, Typography, Col, Row, Divider, Button} from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { HorizontalProductCard } from "../shared/HorizontalProductCard";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import {DeleteZone} from "./DeleteZone"
const {Text, Title} = Typography

export const ShoppingCartComponent = ({}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const [cartItems, setCartItems] = useState(getShoppingCart());

    const toggleSelectItem = (itemId) => {
        if (!selectionMode) return;
        if (selectedItems.length === 0) {
            setSelectionMode(false);
            return;
        }
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const startSelectionMode = (itemId) => {
        setSelectionMode(true);
        setSelectedItems([itemId]);
    };
    const isSelected = (itemId) => selectedItems.includes(itemId);

    const handleDeleteItem = (selectedItems) => {
        const updatedCart = cartItems.filter(
            item =>
            !selectedItems.some(
                delItem => delItem.id === item.id && delItem.size === item.size
            )
        );

        setCartItems(updatedCart);    
        setSelectedItems([]);
        deleteFromCart(selectedItems);// También elimina del carrito si lo estás guardando en estado
        {console.log("updated: ",cartItems)}

    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            const product = getProduct(item.id);
            if (!product) return acc;
            return acc + product.price * item.quantity;
        }, 0).toFixed(2); // redondea a 2 decimales
    };
    return (
        <>
        <div style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div>
        <ConfigurableMenu icon={<ShoppingCartOutlined/>} text={"Shopping cart"}/>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom:"0.5rem" }}>
            <Text>{cartItems.length} total items</Text>
        </div>
        
        <div style={{  paddingBottom:0 }}>
            {console.log("cartItems: ",cartItems)}
            {cartItems.length === 0 ? (
            <Text type="secondary">Your cart is empty.</Text>
            ) : (
            cartItems.map((item, index) => (
                <HorizontalProductCard item={item} index={index} 
                isSelected={isSelected(item.id)}
                selectedItems={selectedItems} 
                onClick={() => toggleSelectItem(item.id)}
                onLongClick={() => startSelectionMode(item.id)}/>
            ))
            )}
        </div>

        {selectionMode && (
        <div>
            <div style={{ display: "flex", justifyContent: "center"}}>
                <Button 
                danger 
                onClick={() => {
                setSelectionMode(false);
                setSelectedItems([]);
                }}>
                Cancelar selección
                </Button>
            </div>
         </div>
        )}
        </div>
        
        <div>
        {selectionMode && 
            <DeleteZone onDropItem={handleDeleteItem} />
        }
        </div>

        </div>
        
        <Divider/>
        <Row style={{display:"flex", flexDirection:"row", justifyContent: "space-between", paddingBottom: "1rem"}}>
            <Title style={{padding:0, margin: 0}}>Total</Title>
            <Title style={{padding:0, margin: 0}}>{calculateTotal()}€</Title>
        </Row>
        <Button type="primary" block size="large" style={{padding:"1rem", marginTop:"1rem"}}>
            Continue
        </Button></>
    );
}