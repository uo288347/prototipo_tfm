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
import { task8 } from "@/utils/UtilsTasks";
import { useTranslations } from 'next-intl';
import { getProductTitle } from "@/utils/UtilsProductTranslations";


export const CheckoutComponent = () => {
    const t = useTranslations();
    const router = useRouter();
    const locale = router.locale || 'es';
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
        task8();
        clearCart();
        clearFavorites();
        router.push("/end")
    }
    return (
        <div style={{
            flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: "100%", height: "100%"
        }}>
            <div style={{ flex: 1, overflowY: "auto", height: "100%" }}>
                <ConfigurableMenu icon={<CreditCardOutlined />} text={t('navigation.checkout')} onClick={() => router.push("/shoppingCart")} />

                <Collapse>
                    <CollapsePanel key='1' title={t('product.subtotal')} style={{ margin: 0, padding: 0 }}>
                        {cartItems.map(c => {
                            let p = getProduct(c.id)
                            let productTitle = getProductTitle(c.id, locale)
                            return (<Row key={`${c.id}-${c.size}`} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <div>
                                    <Text>{c.quantity}x </Text>
                                    <Text>{productTitle}</Text>
                                </div>
                                <Text>{c.quantity * c.price} €</Text>
                            </Row>)
                        })}
                    </CollapsePanel>
                </Collapse>

                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: "1rem", }}>
                    <Title level={2} style={{ padding: 0, margin: 0, }}>{t('product.total')}</Title>
                    <Title level={2} style={{ padding: 0, margin: 0, }}>{calculateTotal()}€</Title>
                </Row>

                <Divider />
                <Title style={{ padding: "1rem 0rem", fontWeight: "normal" }} level={3}>{t('checkout.shippingInformation')}</Title>
                <Form>
                    <TextInputField name={"city"} placeholder={t('checkout.city')} formData={formData} icon={<HomeOutlined />}
                        formErrors={formErrors} setFormData={setFormData} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired}
                        validateParams={[t('errors.required')]} />
                    <TextInputField name={"country"} placeholder={t('checkout.country')} formData={formData} icon={<EnvironmentOutlined />}
                        formErrors={formErrors} setFormData={setFormData} setFormErrors={setFormErrors} validateFunc={validateFormDataInputRequired}
                        validateParams={[t('errors.required')]} />

                </Form>
            </div>
            <Form>
                <Form.Item style={{ margin: 0, marginBottom: 0, paddingBottom: 0 }}>
                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" size="large" onClick={clickCheckout} block ><ShoppingCartOutlined style={{ fontSize: "1.3rem" }} />{t('checkout.confirmPurchase')}</Button> :
                        <Button type="primary" size="large" block disabled><ShoppingCartOutlined style={{ fontSize: "1.3rem" }} />{t('checkout.confirmPurchase')}</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    );
}