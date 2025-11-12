import { FavoritesComponent } from '@/components/favoritesComponent/FavoritesComponent';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

export default function Favorites({ }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100dvh", padding: "0px 10px" }}>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <FavoritesComponent />
            </DndProvider>
        </div>
    );
}