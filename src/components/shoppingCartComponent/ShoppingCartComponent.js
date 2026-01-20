import { getShoppingCart, deleteFromCart, updateUnits, getShoppingCartLength } from "@/utils/UtilsCart";
import { ConfigurableMenu } from "../shared/ConfigurableMenu";
import { Card, Typography, Col, Row, Divider, Button } from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { getProductTitle } from "@/utils/UtilsProductTranslations";
import { HorizontalProductCard } from "../shared/HorizontalProductCard";  
import { GhostProductCard } from "../shared/GhostProductCard";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { DeleteZone } from "../shared/DeleteZone"; 
import { useRouter } from "next/router";
import { SelectionIndicator } from "../shared/SelectionIndicator"; 
import { BottomSection } from "./BottomSection";
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_BUTTON, COMPONENT_CARD, getCurrentSceneId } from "@/metrics/scriptTest";

const { Text } = Typography

export const ShoppingCartComponent = ({ }) => {
    const router = useRouter();
    const t = useTranslations();

    const [products, setProducts] = useState([]);
    const [productsLength, setProductsLength] = useState(0);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragGhostPosition, setDragGhostPosition] = useState({ x: 0, y: 0 });
    const [showDragGhost, setShowDragGhost] = useState(false);
    const cardRefs = useRef({});
    const registeredCardsRef = useRef(new Set());
    const continueButtonRegisteredRef = useRef(false);

    const longPressTimer = useRef(null);
    const longPressTriggered = useRef(false);
    const dragStartPosition = useRef({ x: 0, y: 0 });
    const hasVibrated = useRef(false);

    const sceneId = getCurrentSceneId();
    const getItemKey = (item) => `${item.id}-${item.size}`;

    useEffect(() => {
        setProducts(getShoppingCart());
        setProductsLength(getShoppingCartLength());
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const button = document.getElementById("btn-cancel-selection");
        if (!button || productsLength === 0 || selectionMode) {
            continueButtonRegisteredRef.current = false;
            return;
        }

        const sceneId = getCurrentSceneId();
        if (sceneId === null || sceneId === undefined || continueButtonRegisteredRef.current) return;

        const rect = button.getBoundingClientRect();
        const scrollX = window.scrollX || 0;
        const scrollY = window.scrollY || 0;

        registerComponent(
            sceneId,
            "btn-cancel-selection",
            rect.left + scrollX,
            rect.top + scrollY,
            rect.right + scrollX,
            rect.bottom + scrollY,
            COMPONENT_BUTTON,
            null
        );
        continueButtonRegisteredRef.current = true;
    }, [productsLength, selectionMode]);

    useEffect(() => {
        if (typeof window === "undefined" || products.length === 0) return;
        const sceneId = getCurrentSceneId();
        if (sceneId === null || sceneId === undefined) return;

        const registerCards = () => {
            products.forEach((item) => {
                const key = getItemKey(item);
                const node = cardRefs.current[key];
                
                if (!node) {
                    console.warn(`[ShoppingCartComponent] Node not found for ${key}`);
                    return;
                }

                const rect = node.getBoundingClientRect();
                const scrollX = window.scrollX || window.pageXOffset || 0;
                const scrollY = window.scrollY || window.pageYOffset || 0;
                const trackingId = `cart-card-${key}`;

                registerComponent(
                    sceneId,
                    trackingId,
                    rect.left + scrollX,
                    rect.top + scrollY,
                    rect.right + scrollX,
                    rect.bottom + scrollY,
                    COMPONENT_CARD,
                    null
                );

                registeredCardsRef.current.add(key);
            });
        };

        // Usar requestAnimationFrame para asegurar que el DOM está pintado
        const rafId = requestAnimationFrame(() => {
            setTimeout(registerCards, 250); // Delay más corto después del RAF
        });

    }, [products, sceneId]); // Añadir sceneId a dependencias

    const assignCardRef = (key) => (node) => {
        if (node) {
            cardRefs.current[key] = node;
        } else {
            delete cardRefs.current[key];
            registeredCardsRef.current.delete(key);
        }
    };

    const handleTouchStart = (e, item) => {
        longPressTriggered.current = false;
        hasVibrated.current = false; // Resetear la vibración al inicio

        const touch = e.touches[0];
        dragStartPosition.current = { x: touch.clientX, y: touch.clientY };

        // Si ya hay items seleccionados y tocamos uno seleccionado, preparar para arrastre
        const itemKey = getItemKey(item);
        if (selectionMode && selectedItems.has(itemKey)) {
            // No hacer nada especial, el arrastre se iniciará en touchMove
            return;
        }

        longPressTimer.current = setTimeout(() => {
            longPressTriggered.current = true;
            if (!selectionMode) {
                setSelectionMode(true);

                setSelectedItems(new Set([getItemKey(item)]));
                navigator.vibrate?.(50);
            }
        }, 500);
    };

    const handleTouchEnd = async (e, item) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        const touch = e.changedTouches[0];
        const wasDragging = dragging;

        // Ocultar el ghost al soltar
        setShowDragGhost(false);
        setDragging(false);

        /*if (!longPressTriggered.current && selectionMode) {
            toggleSelection(item);
        }*/
        if (wasDragging && draggedOver) {
            // Simula el drop
            try {
                const itemsToDelete = Array.from(selectedItems).map(key => {
                    const [productId, size] = key.split('-');
                    console.log("key: ", key)
                    return { id: productId, size };
                });

                //const itemsToDelete = JSON.parse(e.dataTransfer.getData('text/plain'));
                console.log("items to delete: ", itemsToDelete)
                const updated = deleteFromCart(itemsToDelete);
                console.log("updated cart: ", updated)

                setProducts(updated)
                setProductsLength(getShoppingCartLength());


                setSelectedItems(new Set());
                setSelectionMode(false);
                setDraggedOver(false);

                console.log(`${itemsToDelete.length} prenda(s) eliminada(s)`);
            } catch (error) {
                console.log('Error al eliminar prendas', error);
            }
        } else if (!longPressTriggered.current && !wasDragging && selectionMode) {
            // Solo toggle si no fue long press ni arrastre
            toggleSelection(item);
        }
    };

    const handleTouchMove = (e) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        const touch = e.touches[0];
        
        // Si hay items seleccionados y estamos en modo selección, activar el arrastre
        if (selectionMode && selectedItems.size > 0) {
            // Calcular si se ha movido lo suficiente para iniciar el drag
            const deltaX = Math.abs(touch.clientX - dragStartPosition.current.x);
            const deltaY = Math.abs(touch.clientY - dragStartPosition.current.y);
            
            if ((deltaX > 10 || deltaY > 10) && !dragging) {
                // Iniciar arrastre: vibración + mostrar ghost
                setDragging(true);
                setShowDragGhost(true);
                
                // Vibrar solo si no se ha vibrado ya
                if (!hasVibrated.current) {
                    navigator.vibrate?.(30);
                    hasVibrated.current = true;
                }
            }

            // Actualizar posición del ghost siempre durante el arrastre
            if (dragging || (deltaX > 10 || deltaY > 10)) {
                setDragGhostPosition({ x: touch.clientX, y: touch.clientY });
            }
        }

        console.log("is over: ", isOverDeleteZone(touch))
        if (isOverDeleteZone(touch)) {
            setDraggedOver(true);
        } else {
            setDraggedOver(false);
        }
    };

    const toggleSelection = (item) => {
        const itemKey = getItemKey(item);
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemKey)) {
                newSet.delete(itemKey);
            } else {
                newSet.add(itemKey);
            }

            if (newSet.size === 0) {
                setSelectionMode(false);
            }

            return newSet;
        });
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDraggedOver(false);
        setDragging(false);

        try {
            const itemsToDelete = JSON.parse(e.dataTransfer.getData('text/plain'));
            console.log("items to delete: ", itemsToDelete)
            const updated = deleteFromCart(itemsToDelete);
            console.log("updated cart: ", updated)

            setProducts(updated)
            setProductsLength(getShoppingCartLength());

            // Filtrar productos eliminados del carrito
            /*setProducts(prev => prev.filter(p => {
                const itemKey = getItemKey(p);
                return !selectedItems.has(itemKey);
            }));*/

            setSelectedItems(new Set());
            setSelectionMode(false);

            console.log(`${itemsToDelete.length} products deleted`);
        } catch (error) {
            console.log('Error while deleting products');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDraggedOver(true);
    };

    const handleDragLeave = () => {
        setDraggedOver(false);
    };

    const cancelSelection = () => {
        setSelectedItems(new Set());
        setSelectionMode(false);
    };

    const isOverDeleteZone = (touch) => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        return element?.closest('.delete-zone') !== null;
    };



    //    const total = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const onUpdateUnits = (id, size, units) => {
        updateUnits(id, size, units)
        setProducts(getShoppingCart())
        setProductsLength(getShoppingCartLength());
    }

    const calculateTotal = () => {
        return products.reduce((acc, item) => {
            const product = getProduct(item.id);
            if (!product) return acc;
            return acc + item.price * item.quantity;
        }, 0).toFixed(2); // redondea a 2 decimales
    };

    return (
        <>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", }}>
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingBottom: selectionMode ? "5rem" : "10rem",
                    marginBottom: "1rem"
                }}>
                    <ConfigurableMenu icon={<ShoppingCartOutlined />} text={t('cart.title')} onClick={() => router.push("/home")} />
                    <SelectionIndicator id ="btn-cancel-selection" data-trackable-id="btn-cancel-selection" selectionMode={selectionMode} nSelectedItems={selectedItems.size} cancelSelection={cancelSelection} />

                    <div style={{ paddingBottom: 0 }}>
                        {products.length === 0 ? (
                            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                                <Text type="secondary">{t('cart.emptyMessage')}</Text>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                                    <Text>{productsLength} {t('cart.totalProducts')}</Text>
                                </div>
                                {products.map((item, index) => {
                                    const itemKey = getItemKey(item);
                                    console.log("Rendering itemKey: ", itemKey);
                                    const isSelected = selectedItems.has(itemKey);

                                    return (
                                        <div
                                            key={itemKey}
                                            ref={assignCardRef(itemKey)}
                                            data-trackable-id={`cart-card-${itemKey}`}
                                            draggable={isSelected}
                                            onTouchStart={(e) => handleTouchStart(e, item)}
                                            onTouchEnd={(e) => handleTouchEnd(e, item)}
                                            onTouchMove={handleTouchMove}
                                            style={{
                                                position: "relative",
                                                transition: "all 0.2s",
                                                opacity: dragging && isSelected ? 0.5 : 1,
                                                transform: dragging && isSelected ? "scale(0.95)" : "scale(1)"
                                            }}
                                        >
                                            <HorizontalProductCard item={item} index={index}
                                                isSelected={isSelected}
                                                selectedItems={selectedItems}
                                                updateUnits={onUpdateUnits}
                                                enableTracking={false}
                                            /></div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>

                <DeleteZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave}
                    selectionMode={selectionMode} draggedOver={draggedOver} />
            </div>

            {/* Ghost element durante el arrastre - VERSIÓN BADGE SIMPLE (comentada) */}
            {/* {showDragGhost && selectedItems.size > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        left: dragGhostPosition.x,
                        top: dragGhostPosition.y,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        opacity: 0.8,
                        transition: 'none',
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                            border: '2px solid #1890ff',
                            minWidth: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <DeleteOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        <Text strong style={{ fontSize: '16px' }}>
                            {selectedItems.size} {selectedItems.size === 1 ? t('cart.product') : t('cart.products')}
                        </Text>
                    </div>
                </div>
            )} */}

            {/* Ghost element durante el arrastre - VERSIÓN CARDS VISUALES */}
            {showDragGhost && selectedItems.size > 0 && (
                <GhostProductCard 
                    dragGhostPosition={dragGhostPosition}
                    selectedItems={selectedItems}
                    products={products}
                    locale={router.locale}
                />
            )}

            <Divider />

            <BottomSection productsLength={products.length} selectionMode={selectionMode} calculateTotal={calculateTotal} />
        </>
    );
}