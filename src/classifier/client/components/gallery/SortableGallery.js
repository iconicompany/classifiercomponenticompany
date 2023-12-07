import React, { useEffect, useState } from 'react';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import SortableGalleryItem from './SortableGalleryItem';

const SortableGallery = ({ srcSet, onRemove, tab, pageErrors, hasListOnly }) => {
  const [state, setState] = useState({
    scale: 1,
    rotation: 0,
    src: '',
    previewOpen: false
  });

  useEffect(() => {
    setState({ ...state, previewOpen: false });
  }, [tab.type]);

  return (
    <SortableContext items={srcSet} strategy={rectSortingStrategy}>
      {!state.previewOpen && (
        <div style={{ display: 'grid' }}>
          {srcSet.map((src) => {
            return (
              <div key={src.id} style={{ padding: '3px 0' }}>
                <SortableGalleryItem
                  src={src}
                  errors={pageErrors[src.uuid]}
                  disabled={tab.readonly}
                  width={3}
                  height={4}
                  onRemove={onRemove}
                  onClick={() => {
                    setState({ ...state, previewOpen: true, src: src.id });
                  }}
                  hasListOnly={hasListOnly}
                />
              </div>
            );
          })}
        </div>
      )}
    </SortableContext>
  );
};

export default SortableGallery;
