import { NavBar, Button, Badge } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getFavorites } from "@/utils/UtilsFavorites";
import { getShoppingCart } from "@/utils/UtilsCart";
import { HeartOutline } from "antd-mobile-icons";
import { ShoppingCartOutlined } from "@ant-design/icons";

export const StandardNavBar = ({ }) => {
    const router = useRouter();
    const [favorites, setFavorites] = useState(new Set());
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const favs = getFavorites();
        setFavorites(favs);
        const cart = getShoppingCart();
        setCart(cart)
    }, []);

    const home = () => {
        router.push("/home")
    }

    const right = (<>
        {favorites.size > 0 ? (
            <Badge content={favorites.size} style={{ '--top': '20%', '--right': '12%' }}>
                <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/favorites")}>
                    <HeartOutline style={{ fontSize: 24 }} />
                </Button>
            </Badge>
        ) : (
            <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/favorites")}>
                <HeartOutline style={{ fontSize: 24 }} />
            </Button>
        )}

        {cart.length > 0 ? ( // Solo mostrar si hay items en carrito
            <Badge content={cart.length} style={{ '--top': '20%', '--right': '12%' }}>
                <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}>
                    <ShoppingCartOutlined style={{ fontSize: 24 }} />
                </Button>
            </Badge>
        ) : (
            <Button type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}>
                <ShoppingCartOutlined style={{ fontSize: 24 }} />
            </Button>
        )}
    </>
    )

    return (
        <NavBar style={{marginTop:"1rem"}} back={<img src="/logo.png" width="30" height="30" />} onBack={home}
            backIcon={false} right={right} />
    )
}