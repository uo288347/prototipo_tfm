import { ConfigurableMenu } from "../shared/ConfigurableMenu";
import { Card, Typography, Col, Row, Divider, Button } from 'antd';
import { getProduct } from "@/utils/UtilsProducts";
import { HorizontalProductCard } from "../shared/HorizontalProductCard";
import { DeleteOutlined, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { DeleteZone } from "../shared/DeleteZone"
import { useRouter } from "next/router";
import { NavBar } from "antd-mobile";
import { SelectionIndicator } from "../shared/SelectionIndicator";
import { deleteFromFavorites, getFavorites } from "@/utils/UtilsFavorites";
import { HeartOutline } from "antd-mobile-icons";
import { FavoriteCard } from "./FavoriteCard";
import { useTranslations } from 'next-intl';

const { Text, Title } = Typography


export const FavoritesComponent = ({ }) => {
    const router = useRouter();
    const t = useTranslations();

    const [ids, setIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [draggedOver, setDraggedOver] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragGhostPosition, setDragGhostPosition] = useState({ x: 0, y: 0 });
    const [showDragGhost, setShowDragGhost] = useState(false);

    const longPressTimer = useRef(null);
    const longPressTriggered = useRef(false);
    const dragStartPosition = useRef({ x: 0, y: 0 });
    const hasVibrated = useRef(false);

    useEffect(() => {
        setIds(getFavorites());
    }, []);


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

                setSelectedItems(new Set([item]));
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

        if (wasDragging && draggedOver) {
            // Simula el drop
            try {
                const itemsToDelete = Array.from(selectedItems)

                console.log("items to delete: ", itemsToDelete)
                const updated = deleteFromFavorites(itemsToDelete);
                console.log("updated cart: ", updated)

                setIds(updated)

                setSelectedItems(new Set());
                setSelectionMode(false);
                setDraggedOver(false);

                console.log(`${itemsToDelete.length} deleted from favorites`);
            } catch (error) {
                console.log('Error while deleting favorites', error);
            }
        } else if (!longPressTriggered.current && !wasDragging && selectionMode) {
            toggleSelection(item);
        }
    };

    const handleTouchMove = (e) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        const touch = e.touches[0];

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
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) {
                newSet.delete(item);
            } else {
                newSet.add(item);
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
            const updated = deleteFromFavorites(itemsToDelete);
            console.log("updated cart: ", updated)

            setIds(updated)

            setSelectedItems(new Set());
            setSelectionMode(false);

            console.log(`${itemsToDelete.length} products deleted from favorites`);
        } catch (error) {
            console.log('Error while deleting favorites');
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

    return (<>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", }}>
            <div style={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: selectionMode ? "5rem" : "10rem",
                marginBottom: "1rem"
            }}>
                <ConfigurableMenu icon={<HeartOutlined />} text={t('favorites.title')} onClick={() => router.push("/home")} />
                <SelectionIndicator selectionMode={selectionMode} nSelectedItems={selectedItems.size} cancelSelection={cancelSelection} />

                <div style={{ paddingBottom: 0 }}>
                    {ids.length === 0 ? (
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                            <Text type="secondary">{t('favorites.emptyMessage')}</Text>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
                                <Text>{[...ids].length} {t('favorites.totalFavorites')}</Text>
                            </div>
                            {[...ids].map((item, index) => {
                                const isSelected = selectedItems.has(item);

                                return (
                                    <div
                                        key={item}
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
                                        <FavoriteCard item={item} index={index} isSelected={isSelected} selectedItems={selectedItems}/>
                                    </div>
                                )
                            })}
                        </>
                    )}
                </div>
            </div>

            <DeleteZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave}
                selectionMode={selectionMode} draggedOver={draggedOver} />
        </div>
    </>);
}