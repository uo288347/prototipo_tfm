import { useEffect, useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { registerComponent, COMPONENT_CARD, getCurrentSceneId } from '@/metrics/script_v2';

const DELETE_ZONE_TRACKING_ID = 'cart-delete-zone';

export const DeleteZone = ({ handleDrop, handleDragOver, handleDragLeave, selectionMode, draggedOver}) => {
  const t = useTranslations();
  const zoneRef = useRef(null);

  useEffect(() => {
    if (!selectionMode) return;
    const element = zoneRef.current;
    if (!element) return;

    const sceneId = getCurrentSceneId();
    if (sceneId === null || sceneId === undefined) return;

    const rect = element.getBoundingClientRect();
    registerComponent(
      sceneId,
      DELETE_ZONE_TRACKING_ID,
      rect.left + window.scrollX,
      rect.top + window.scrollY,
      rect.right + window.scrollX,
      rect.bottom + window.scrollY,
      COMPONENT_CARD,
      null
    );
  }, [selectionMode]);

  return (
    <div>
      {/* Delete Zone */}
      {selectionMode && (
        <div
          ref={zoneRef}
          className="delete-zone"
          data-trackable-id={DELETE_ZONE_TRACKING_ID}
          onTouchEnd={handleDrop}
          onTouchMove={handleDragOver}
          onTouchCancel={handleDragLeave}
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
            backgroundColor: draggedOver ? '#830d0dbb' : '#fecacadd',
            transform: draggedOver ? 'scale(1.05)' : 'scale(1)',
            boxShadow: draggedOver ? '0 0.5rem 0.5rem -12px #000' : 'none',
            border: draggedOver ? '3px dashed #ffdcdc' : '2px dashed #aa3f3fff',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ textAlign: "center", paddingBottom: "1.5rem", paddingTop: "1.5rem" }}>
            <DeleteOutlined style={{ fontSize: "1.5rem",
              color: draggedOver ?  "#ffdcdc" : "#731313", 
              marginBottom: "0.5rem" }} />
            <p style={{ color: draggedOver ?  "#ffdcdc" : "#731313",
              fontSize: "0.9rem",
              fontWeight: "bold", margin: 0 }}>
              {draggedOver ? t('deleteZone.dropToDelete') : t('deleteZone.dragAndDrop')}
            </p>
          </div>
        </div>
      )}
    </div>

  );
};
