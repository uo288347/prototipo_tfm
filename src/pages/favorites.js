import { FavoritesComponent } from '@/components/favoritesComponent/FavoritesComponent';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

export default function Favorites({ footer}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", padding: "0px 10px" }}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <FavoritesComponent />
      </DndProvider>
      {footer}
    </div>
  );
}

export async function getStaticProps(context) {
  const locale = context.locale || 'en';

  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}