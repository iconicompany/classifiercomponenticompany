import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GalleryItem from './GalleryItemList/GalleryItemList';

const SortableGalleryItem = ({ src, disabled, errors }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: src.id,
    disabled: !src.type.includes('image/') || disabled
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
    zIndex: 100
  };

  return (
    <GalleryItem
      src={src} 
      ref={setNodeRef}
      style={style}  
      attributes={attributes}
      listeners={listeners}
      errors={errors}
    />
  );
};

export default SortableGalleryItem;
