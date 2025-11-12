import { getShoppingCart, deleteFromCart, updateCart, updateUnits } from "@/utils/UtilsCart";
import { ConfigurableMenu } from "../shared/ConfigurableMenu";
import { Card, Typography, Col, Row, Divider, Button } from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { HorizontalProductCard } from "../shared/HorizontalProductCard";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { DeleteZone } from "../shared/DeleteZone"
import { useRouter } from "next/router";
import { NavBar } from "antd-mobile";
import { SelectionIndicator } from "../shared/SelectionIndicator";
import { BottomSection } from "./BottomSection";

const { Text, Title } = Typography

export const ShoppingCartComponent = ({ }) => {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);

    const longPressTimer = useRef(null);
    const longPressTriggered = useRef(false);

    const getItemKey = (item) => `${item.id}-${item.size}`;

    useEffect(() => {
        setProducts(getShoppingCart());
    }, []);

    const handleTouchStart = (e, item) => {
        longPressTriggered.current = false;

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

        /*if (!longPressTriggered.current && selectionMode) {
            toggleSelection(item);
        }*/
        const touch = e.changedTouches[0];
        if (draggedOver) {
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

                setSelectedItems(new Set());
                setSelectionMode(false);
                setDraggedOver(false);

                console.log(`${itemsToDelete.length} prenda(s) eliminada(s)`);
            } catch (error) {
                console.log('Error al eliminar prendas', error);
            }
        } else if (!longPressTriggered.current && selectionMode) {
            toggleSelection(item);
        }
    };

    const handleTouchMove = (e) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        const touch = e.touches[0];
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

    const handleDragStart = (e, item) => {
        const itemKey = getItemKey(item);
        if (selectedItems.has(itemKey)) {
            setDragging(true);
            e.dataTransfer.effectAllowed = 'move';

            // Convertir los keys seleccionados a objetos { productId, size, quantity }
            const selectedItemsData = Array.from(selectedItems).map(key => {
                const [productId, size] = key.split('-');
                const product = products.find(
                    p => p.id === parseInt(productId) && p.size === size
                );
                const quantity = product ? product.quantity : 1;
                return { productId: parseInt(productId), size, quantity };
            });

            e.dataTransfer.setData('text/plain', JSON.stringify(selectedItemsData));
        } else {
            e.preventDefault();
        }
    };

    const handleDragEnd = () => {
        setDragging(false);
        setDraggedOver(false);
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
                    <ConfigurableMenu icon={<ShoppingCartOutlined />} text={"Shopping cart"} onClick={() => router.push("/home")} />
                    <SelectionIndicator selectionMode={selectionMode} nSelectedItems={selectedItems.size} cancelSelection={cancelSelection} />

                    <div style={{ paddingBottom: 0 }}>
                        {products.length === 0 ? (
                            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                                <Text type="secondary">Your shopping cart is empty.</Text>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                                    <Text>{products.length} total products</Text>
                                </div>
                                {products.map((item, index) => {
                                    const itemKey = getItemKey(item);
                                    const isSelected = selectedItems.has(itemKey);

                                    return (
                                        <div
                                            key={itemKey}
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

            <Divider />

            <BottomSection productsLength={products.length} selectionMode={selectionMode} calculateTotal={calculateTotal} />
        </>
    );
}