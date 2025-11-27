import { NavBar, Button, Badge } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getFavorites } from "@/utils/UtilsFavorites";
import { getShoppingCartLength } from "@/utils/UtilsCart";
import { HeartOutline } from "antd-mobile-icons";
import { ShoppingCartOutlined } from "@ant-design/icons";

export const StandardNavBar = ({ }) => {
    const router = useRouter();
    const [favorites, setFavorites] = useState(new Set());
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const favs = getFavorites();
        setFavorites(favs);
        const cartLength = getShoppingCartLength();
        setCartCount(cartLength);
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

        {cartCount > 0 ? (
            <Badge content={cartCount} style={{ '--top': '20%', '--right': '12%' }}>
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