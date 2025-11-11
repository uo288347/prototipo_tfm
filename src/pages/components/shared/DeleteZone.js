import { DeleteOutlined } from '@ant-design/icons';

export const DeleteZone = ({ handleDrop, handleDragOver, handleDragLeave, selectionMode, draggedOver}) => {

  return (
    <div>
      {/* Delete Zone */}
      {selectionMode && (
        <div
          className="delete-zone"
          onPointerUp={handleDrop}
          onPointerOver={handleDragOver}
          onPointerLeave={handleDragLeave}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            margin: "1rem",
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: draggedOver ? '#e97b7b98' : '#fecacabe',
            transform: draggedOver ? 'scale(1.05)' : 'scale(1)',
            boxShadow: draggedOver ? '0 0.2rem 0.5rem -12px #000' : 'none',
            border: draggedOver ? '3px dashed #db3d3dff' : '2px dashed #f78484ff',
            transition: 'all 0.3s'
          }}

        >
          <div style={{ textAlign: "center", paddingBottom: "1.5rem", paddingTop: "1.5rem" }}>
            <DeleteOutlined style={{ fontSize: "1.5rem",
              color: draggedOver ?  "white" : "#818181ff", 
              marginBottom: "0.5rem" }} />
            <p style={{ color: draggedOver ?  "white" : "#818181ff",
              fontWeight: "lighter", margin: 0 }}>
              {draggedOver ? 'Drop to delete!' : 'Drag and drop here to delete'}
            </p>
          </div>
        </div>
      )}
    </div>

  );
};
