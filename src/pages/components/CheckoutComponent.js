import { CreditCardOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Divider, Form, Row, Typography, Button } from 'antd';
import { ConfigurableMenu } from "./shared/ConfigurableMenu";
import { getShoppingCart, getProduct } from "@/utils/UtilsProducts";
import { useState } from "react";
const { Title, Text } = Typography
import { useRouter } from "next/router";
import { TextInputField } from "./shared/TextInputField";
import { allowSubmitForm, validateFormDataInputRequired } from "@/utils/UtilsValidations";


export const CheckoutComponent = () => {
    const router = useRouter();
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})


    const [cartItems, setCartItems] = useState(getShoppingCart());


    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            const product = getProduct(item.id);
            if (!product) return acc;
            return acc + product.price * item.quantity;
        }, 0).toFixed(2); // redondea a 2 decimales
    };

    let clickCheckout = () => {
        router.push("/end")
    }
    return (
        <div style={{flex:"1", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div>
                <ConfigurableMenu icon={<CreditCardOutlined />} text={"Checkout"} onClick={() => router.push("/shoppingCart")} />
                {cartItems.map(c => {
                    let p = getProduct(c.id)
                    return (<Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div>
                            <Text>{c.quantity}x </Text>
                            <Text>{p.title}</Text>
                        </div>
                        <Text>{c.quantity * p.price} €</Text>
                    </Row>)
                })}
                <Divider />
                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "1rem" }}>
                    <Title style={{ padding: 0, margin: 0 }}>Total</Title>
                    <Title style={{ padding: 0, margin: 0 }}>{calculateTotal()}€</Title>
                </Row>

                <Divider style={{ borderColor: '#aaaaaaff' }} />
                <Title style={{ padding: "1rem 0rem" }} level={3}>Shipping information</Title>
                <Form>
                    <TextInputField name={"shippingAddress"} placeholder={"Shipping address"} formData={formData}
                        formErrors={formErrors} setFormData={setFormData} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired} />

                </Form>
            </div>
            <Form>
                <Form.Item>
                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" size="large" onClick={clickCheckout} block ><ShoppingCartOutlined style={{fontSize:"1.3rem"}}/>Confirm purchase</Button> :
                        <Button type="primary" size="large" block disabled><ShoppingCartOutlined style={{fontSize:"1.3rem"}}/>Confirm purchase</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    );
}