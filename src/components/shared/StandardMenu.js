import { ShoppingCartOutlined } from "@ant-design/icons"
import { Row, Col, Menu } from "antd"
import Link from "next/link";
import { Badge, Button } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getShoppingCart, getShoppingCartLength } from "@/utils/UtilsCart";
import { HeartOutline } from "antd-mobile-icons";
import { getFavorites } from "@/utils/UtilsFavorites";
import { task5, UtilsTasks } from "@/utils/UtilsTasks";

export const StandardMenu = () => {
    const [favorites, setFavorites] = useState(new Set());
     const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const favs = getFavorites();
        setFavorites(favs);
        const cartLength = getShoppingCartLength();
        console.log("Cart length in StandardMenu useEffect: ", cartLength);
        setCartCount(cartLength);
    }, []);
    const router = useRouter();
    return (
        <Row justify="space-between" align="middle" style={{ paddingTop: "1rem" }}>
            <Col xs={6} sm={4} md={8} lg={10} xl={8} >
                <Menu mode="horizontal" items={[
                    { key: "logo", label: <Link href="/"><img src="/logo.png" width="50" height="50" /></Link> }
                ]} >
                </Menu>
            </Col>
            <Col xs={12} sm={16} md={16} lg={18} xl={18} style={{ alignItems: 'right' }}>
                <Menu mode="horizontal" items={[
                    {
                        key: "menuFavorites",
                        label: favorites.size > 0 ? (
                            <Badge content={favorites.length} style={{ '--top': '20%', '--right': '12%' }}>
                                <Button type="icon" style={{ border: "none" }} onClick={() => {
                                    task5();
                                    router.push("/favorites")
                                }}>
                                    <HeartOutline style={{ fontSize: 24 }} />
                                </Button>
                            </Badge>
                        ) : (
                            <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/favorites")}>
                                <HeartOutline style={{ fontSize: 24 }} />
                            </Button>
                        )
                    },
                    {
                        key: "menuCart",
                        label: cartCount > 0 ? (
                            <Badge content={cartCount} style={{ '--top': '20%', '--right': '12%' }}>
                                <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}>
                                    <ShoppingCartOutlined style={{ fontSize: 24 }} />
                                </Button>
                            </Badge>
                        ) : (
                            <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}>
                                <ShoppingCartOutlined style={{ fontSize: 24 }} />
                            </Button>
                        )
                    },
                ]} >
                </Menu>
            </Col>

        </Row>
    )
}