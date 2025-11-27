import { CreditCardOutlined, EnvironmentOutlined, HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Divider, Form, Row, Typography, Button } from 'antd';
import { ConfigurableMenu } from "./shared/ConfigurableMenu";
import { getProduct } from "@/utils/UtilsProducts";
import { clearCart, getShoppingCart } from "@/utils/UtilsCart";
import { useEffect, useState } from "react";
const { Title, Text } = Typography
import { useRouter } from "next/router";
import { TextInputField } from "./shared/TextInputField";
import { allowSubmitForm, validateFormDataInputRequired } from "@/utils/UtilsValidations";
import { Collapse } from "antd-mobile";
import { CollapsePanel } from "antd-mobile/es/components/collapse/collapse";
import { clearFavorites } from "@/utils/UtilsFavorites";
import { task7 } from "@/utils/UtilsTasks";


export const CheckoutComponent = () => {
    const router = useRouter();
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        let cart = getShoppingCart()
        setCartItems(cart)
    }, [])

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            const product = getProduct(item.id);
            if (!product) return acc;
            return acc + item.price * item.quantity;
        }, 0).toFixed(2); // redondea a 2 decimales
    };

    let clickCheckout = () => {
        task7();
        clearCart();
        clearFavorites();
        router.push("/end")
    }
    return (
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh" }}>
            <div style={{flex:1}}>
                <ConfigurableMenu icon={<CreditCardOutlined />} text={"Checkout"} onClick={() => router.push("/shoppingCart")} />

                <Collapse>
                    <CollapsePanel key='1' title="Subtotal" style={{ margin: 0, padding: 0 }}>
                        {cartItems.map(c => {
                            let p = getProduct(c.id)
                            return (<Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <div>
                                    <Text>{c.quantity}x </Text>
                                    <Text>{p.title}</Text>
                                </div>
                                <Text>{c.quantity * c.price} €</Text>
                            </Row>)
                        })}
                    </CollapsePanel>
                </Collapse>

                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: "1rem", }}>
                    <Title level={2} style={{ padding: 0, margin: 0, }}>Total</Title>
                    <Title level={2} style={{ padding: 0, margin: 0, }}>{calculateTotal()}€</Title>
                </Row>

                <Divider />
                <Title style={{ padding: "1rem 0rem", fontWeight: "normal" }} level={3}>Shipping information</Title>
                <Form>
                    <TextInputField name={"city"} placeholder={"City"} formData={formData} icon={<HomeOutlined/>}
                        formErrors={formErrors} setFormData={setFormData} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired} />
                    <TextInputField name={"country"} placeholder={"Country"} formData={formData} icon={<EnvironmentOutlined/>}
                        formErrors={formErrors} setFormData={setFormData} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired} />

                </Form>
            </div>
            <Form>
                <Form.Item>
                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" size="large" onClick={clickCheckout} block ><ShoppingCartOutlined style={{ fontSize: "1.3rem" }} />Confirm purchase</Button> :
                        <Button type="primary" size="large" block disabled><ShoppingCartOutlined style={{ fontSize: "1.3rem" }} />Confirm purchase</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    );
}