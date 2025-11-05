import { ShoppingCartComponent } from "./components/shoppingCartComponent/ShoppingCartComponent";

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

export default function ShoppingCart({}) {
    return (
        <div style={{display:"flex", flexDirection:"column", height: "100dvh", padding: "20px 20px"}}>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <ShoppingCartComponent/>
            </DndProvider>
        </div>
    );
}