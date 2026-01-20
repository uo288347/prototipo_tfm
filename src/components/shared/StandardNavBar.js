import { NavBar, Button, Badge } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { getFavorites } from "@/utils/UtilsFavorites";
import { getShoppingCartLength } from "@/utils/UtilsCart";
import { HeartOutline } from "antd-mobile-icons";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { task6 } from "@/utils/UtilsTasks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { registerComponent, COMPONENT_BUTTON, getCurrentSceneId } from "@/metrics/scriptTest";

export const StandardNavBar = ({ }) => {
    const router = useRouter();
    const [favorites, setFavorites] = useState(new Set());
    const [cartCount, setCartCount] = useState(0);
    const favButtonRef = useRef(null);
    const cartButtonRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const favs = getFavorites();
        setFavorites(favs);
        const cartLength = getShoppingCartLength();
        setCartCount(cartLength);
    }, []);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (favButtonRef.current) {
                const rect = favButtonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-favorites", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
            if (cartButtonRef.current) {
                const rect = cartButtonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-shopping-cart", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
            if (logoRef.current) {
                const rect = logoRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-home-logo", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON, null);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [favorites, cartCount]);

    const home = () => {
        router.push("/home")
    }

        const right = (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <LanguageSwitcher />
                {favorites.size > 0 ? (
                    <Badge content={favorites.size} style={{ '--top': '20%', '--right': '12%' }}>
                        <span ref={favButtonRef}>
                            <Button id="btn-favorites" data-trackable-id="btn-favorites" type="icon" style={{ border: "none" }} onClick={() => {
                                task6();
                                router.push("/favorites")
                            }}>
                                <HeartOutline style={{ fontSize: 24 }} />
                            </Button>
                        </span>
                    </Badge>
                ) : (
                    <span ref={favButtonRef}>
                        <Button id="btn-favorites" data-trackable-id="btn-favorites" type="icon" style={{ border: "none" }} onClick={() => router.push("/favorites")}> 
                            <HeartOutline style={{ fontSize: 24 }} />
                        </Button>
                    </span>
                )}

                {cartCount > 0 ? (
                    <Badge content={cartCount} style={{ '--top': '20%', '--right': '12%' }}>
                        <span ref={cartButtonRef}>
                            <Button id="btn-shopping-cart" data-trackable-id="btn-shopping-cart" type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}> 
                                <ShoppingCartOutlined style={{ fontSize: 24 }} />
                            </Button>
                        </span>
                    </Badge>
                ) : (
                    <span ref={cartButtonRef}>
                        <Button id="btn-shopping-cart" data-trackable-id="btn-shopping-cart" type="icon" style={{ border: "none" }} onClick={() => router.push("/shoppingCart")}> 
                            <ShoppingCartOutlined style={{ fontSize: 24 }} />
                        </Button>
                    </span>
                )}
            </div>
        )

    return (
        <NavBar style={{marginTop:"1rem"}} back={<span ref={logoRef} id="btn-home-logo" data-trackable-id="btn-home-logo"><img src="/logo.png" width="30" height="30" /></span>} onBack={home}
            backIcon={false} right={right} />
    )
}