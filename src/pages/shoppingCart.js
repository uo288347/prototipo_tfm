import { ShoppingCartComponent } from "./components/shoppingCartComponent/ShoppingCartComponent";

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ShoppingCartScreen } from "./components/shoppingCartComponent/ShoppingCartScreen";

export default function ShoppingCart({}) {
    return (
        <div style={{display:"flex", flexDirection:"column", height: "100dvh", padding: "0px 10px"}}>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <ShoppingCartComponent/>
            </DndProvider>
        </div>
    );
}