import { DeleteOutlined } from '@ant-design/icons';
import { useDrop } from 'react-dnd';

export const DeleteZone = ({ onDropItem }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'CARD',
    drop: (item, monitor) => {
        console.log("Drop recibido:", item); // 👈 verifica que llega el objeto
        if (item?.selectedItems?.length) {
            onDropItem(item.selectedItems); // 👈 ahora sí se ejecuta
        }
    },
  });

  return (
    <div
      ref={dropRef}
      style={{
        height: '100px',
        backgroundColor: isOver ? '#ffccc7' : '#fafafa',
        border: '2px dashed #ff4d4f',
        textAlign: 'center',
        lineHeight: '100px',
        marginTop: '1rem',
        zIndex: 10,
      }}
    >
      <DeleteOutlined/> Arrastra aquí para eliminar
    </div>
  );
};
