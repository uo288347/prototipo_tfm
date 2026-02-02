import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Typography, Card, Carousel, Image, Button, Link, Row, Col, Select, InputNumber, FloatButton, Breadcrumb, Radio } from 'antd';
const { Title, Paragraph } = Typography;
import { getProduct } from "@/utils/UtilsProducts";
import { addToCart } from "@/utils/UtilsCart";
import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { openNotification } from "@/utils/UtilsNotifications";
import { ImageCarousel } from "./ImageCarousel";
import { Collapse, Stepper } from "antd-mobile";
import { HeartFill, HeartOutline } from "antd-mobile-icons";
import { getFavorite, toggleFavorite } from "@/utils/UtilsFavorites";
import { FreeProductOffer } from "./FreeProductOffer";
import { getCategoryLabel } from "@/utils/UtilsCategories";
import { getProductTitle, getProductDescription } from "@/utils/UtilsProductTranslations";
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_BUTTON, COMPONENT_RADIO_BUTTON, COMPONENT_STEPPER } from "@/metrics/scriptTest";
import { getCurrentSceneId } from "@/metrics/constants/scenes";
import { ManualScrollEngine } from "@/metrics/ManualScrollEngine";

let DetailsProductComponent = ({ id }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const scrollEngineRef = useRef(null);

    const router = useRouter();
    const locale = router.locale || 'es';
    const t = useTranslations();
    let [product, setProduct] = useState({})
    let [productTitle, setProductTitle] = useState('')
    let [productDescription, setProductDescription] = useState('')
    let [category, setCategory] = useState(null)
    let [selectedSize, setSelectedSize] = useState("S")
    let [quantity, setQuantity] = useState(1)
    let [favorite, setFavorite] = useState(false)
    let [isApplied, setIsApplied] = useState(false);

    // Auto-registro de componentes para métricas
    useEffect(() => {
        const timer = setTimeout(() => {
            const sceneId = getCurrentSceneId();
            if (sceneId === null) return;

            // Registrar botón de favoritos
            const favBtn = document.getElementById('btn-favorite');
            if (favBtn) {
                const rect = favBtn.getBoundingClientRect();
                registerComponent(sceneId, 'btn-favorite', rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_BUTTON, null);
                favBtn.setAttribute('data-trackable-id', 'btn-favorite');
            }

            // Registrar botón de añadir al carrito
            const addCartBtn = document.getElementById('btn-add-to-cart');
            if (addCartBtn) {
                const rect = addCartBtn.getBoundingClientRect();
                registerComponent(sceneId, 'btn-add-to-cart', rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_BUTTON, null);
                addCartBtn.setAttribute('data-trackable-id', 'btn-add-to-cart');
            }

            // Registrar botones de tallas
            const sizes = ["S", "M", "L", "XL"];
            const radioButtons = document.querySelectorAll('.ant-radio-button-wrapper');
            radioButtons.forEach((btn) => {
                const btnText = btn.textContent?.trim();
                if (sizes.includes(btnText)) {
                    const rect = btn.getBoundingClientRect();
                    const sizeId = `btn-size-${btnText}`;
                    registerComponent(sceneId, sizeId, rect.left + window.scrollX, rect.top + window.scrollY,
                        rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_RADIO_BUTTON, 'size-selector');
                    btn.setAttribute('data-trackable-id', sizeId);
                }
            });

            // Registrar stepper de cantidad
            const stepper = document.querySelector('.adm-stepper');
            if (stepper) {
                const rect = stepper.getBoundingClientRect();
                registerComponent(sceneId, 'stepper-quantity', rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_STEPPER, null);
                stepper.setAttribute('data-trackable-id', 'stepper-quantity');
            }

            //console.log(`[DetailsProductComponent] Components registered for product ${id}`);

        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    useEffect(() => {
        let p = getProduct(id);
        //console.log("product: ", p)
        setProduct(p);
        setProductTitle(getProductTitle(id, locale))
        setProductDescription(getProductDescription(id, locale))
        setFavorite(getFavorite(id))
        setCategory(getCategoryLabel(p.category, locale))
    }, [id, locale])

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        console.log("Initializing ManualScrollEngine", { container, content });
        if (!container || !content) return;

        const updateScrollBounds = () => {
            content.style.position = 'relative';
            
            const availableHeight = container.clientHeight;
            const scrollHeight = content.scrollHeight;

            console.log("ManualScrollEngine values:", { availableHeight, scrollHeight, diff: scrollHeight - availableHeight });

            if (scrollHeight <= availableHeight) {
                console.log("No scroll needed, content fits in container");
                // Si ya existe el engine, destruirlo
                if (scrollEngineRef.current) {
                    scrollEngineRef.current.destroy();
                    scrollEngineRef.current = null;
                }
                return;
            }

            const maxOffset = 0;
            const minOffset = -(scrollHeight - availableHeight);

            console.log("ManualScrollEngine bounds:", { minOffset, maxOffset });

            // Si ya existe el engine, actualizar los límites
            if (scrollEngineRef.current) {
                scrollEngineRef.current.options.minOffset = minOffset;
                scrollEngineRef.current.options.maxOffset = maxOffset;
                // Asegurar que el offset actual esté dentro de los nuevos límites
                scrollEngineRef.current.currentOffset.y = Math.max(minOffset, Math.min(maxOffset, scrollEngineRef.current.currentOffset.y));
                scrollEngineRef.current._applyTransform();
            } else {
                scrollEngineRef.current = new ManualScrollEngine(container, content, {
                    axis: "y",
                    scrollFactor: 1,
                    minOffset,
                    maxOffset,
                });
            }
        };

        // Inicializar después de que el contenido se renderice
        const initTimer = setTimeout(updateScrollBounds, 300);

        // Observar cambios de tamaño en el contenido (para Collapse, etc.)
        const resizeObserver = new ResizeObserver(() => {
            updateScrollBounds();
        });
        resizeObserver.observe(content);

        return () => {
            clearTimeout(initTimer);
            resizeObserver.disconnect();
            if (scrollEngineRef.current) {
                scrollEngineRef.current.destroy();
                scrollEngineRef.current = null;
            }
        };
    }, [product, isApplied]);

    let onToggleFavorite = () => {
        toggleFavorite(id)
        setFavorite(getFavorite(id))
        if (!favorite) {
            openNotification("top", t('product.addToFavorites'), "success")
        } else { openNotification("top", t('product.removeFromFavorites'), "success") }
    }

    let addToShoppingCart = () => {
        let price = isApplied ? 0 : product.price
        addToCart(id, selectedSize, quantity, price)
        console.log("product added to cart")
        openNotification("top", t('product.addedToCart'), "success")
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };


    const { Text } = Typography;

    const sizes = ["S", "M", "L", "XL"];
    return (
        <div ref={containerRef}
            style={{
                touchAction: "none",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                flex: 1,
                userSelect: "none",
            }}>
            <div ref={contentRef} style={{ position: "relative" }}>
                <Row style={{ maxHeight: "50vh", overflow: "hidden", touchAction: "pan-y" }}>
                    <Col xs={24} style={{ height: "50vh", touchAction: "pan-y" }}>
                        <ImageCarousel product={product} />
                    </Col>
                </Row>

                {/* Información del producto */}
                <Row gutter={24} style={{ padding: "1rem" }}>
                    <Col xs={24}>
                        <Row style={{ paddingBottom: "0.5rem", }}>
                            <Breadcrumb
                                items={[{ title: <a href="/home">{t('home.home')}</a>, },
                                { title: <a href="/home">{category}</a> }]}
                            />
                        </Row>
                        <Row align="middle" justify="space-between" style={{
                            paddingBottom: "0.5rem", display: "flex",
                            flexWrap: "nowrap",
                            gap: "0.5rem",
                        }}>
                            <Title level={3} style={{
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                flex: "1 1 auto",
                                minWidth: 0,
                            }}>
                                {productTitle}
                            </Title>

                            <Button id="btn-favorite" type="text" size="large" style={{ border: "none", flex: "0 0 auto" }}
                                onClick={() => onToggleFavorite()}
                                data-trackable-id="btn-favorite"
                                icon={favorite ? <HeartFill style={{ fontSize: "30px", color: "#b90104ff" }} /> : <HeartOutline style={{ fontSize: "30px" }} />} />

                        </Row>

                        <Row align="middle" style={{ paddingBottom: "1rem" }}>
                            <Text style={{ fontSize: "1rem", color: "#666" }}>
                                {productDescription}
                            </Text>
                        </Row>

                        <Row align="middle" style={{ paddingBottom: "1rem" }}>
                            <Radio.Group value={selectedSize}
                                onChange={handleSizeChange}>
                                {sizes.map((size) => (
                                    <Radio.Button
                                        key={size}
                                        value={size}
                                        style={{
                                            backgroundColor: selectedSize === size ? "black" : undefined,
                                            color: selectedSize === size ? "white" : undefined,
                                            borderColor: selectedSize === size ? "black" : undefined,
                                        }}
                                    >
                                        {size}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Row>

                        <Row align="top" style={{ paddingBottom: "0", marginBottom: "0" }}>
                            <Col xs={12}>
                                <Stepper style={{ marginTop: "0.5rem", }}
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    onChange={val => setQuantity(val)} />
                            </Col>
                            <Col xs={12} align="right">
                                {isApplied ? (
                                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
                                        <Text style={{ textDecoration: "line-through", color: "red", fontSize: "1rem" }}>
                                            {product.price}€
                                        </Text>
                                        <Title level={1} style={{ margin: 0 }}>
                                            0€
                                        </Title>
                                    </div>
                                ) : (
                                    <Title level={1}>{product.price}€</Title>
                                )}
                            </Col>
                        </Row>
                        <FreeProductOffer id={id} freeCode={product.freeCode} isApplied={isApplied} setIsApplied={setIsApplied} />

                        <Button type="primary" block id="btn-add-to-cart"
                            onClick={addToShoppingCart}
                            data-trackable-id="btn-add-to-cart"
                            icon={<ShoppingCartOutlined />}
                        >{t('product.addToCart')}</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default DetailsProductComponent;
