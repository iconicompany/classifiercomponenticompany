import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Grid } from 'semantic-ui-react';
import GalleryItem from './GalleryItem/GalleryItem';
import SortableGalleryItem from './SortableGalleryItem';
import SegmentItem from './GalleryItem/SegmentItem';
import React, { useEffect, useState } from 'react';
import ControlsMenu from '../gallery/GalleryItem/ControlsMenu';

const SortableGallery = ({ srcSet, active, onRemove, tab, pageErrors }) => {
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
    <>
      <style jsx global>
        {`     
          .hoverfile .card:hover {
            background: #cccccc47;
          }
        `}
      </style>

      <SortableContext items={srcSet} strategy={rectSortingStrategy}>
         
        <div
          style={{
            //maxHeight: '235px',
            overflow: 'auto',
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          {!state.previewOpen && (
            <Grid columns={1} only="large screen" container stackable padded style={{display:'grid'}}>
              {srcSet.map((src) => {
                return ( 
                  <Grid.Column
                    key={src.id}
                    className="hoverfile"
                    style={{ padding: 3 }}
                    largeScreen={16}
                    computer={16}
                    tablet={16}
                    mobile={16}>                    
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
                    />
                  </Grid.Column>
                ); 
              })}
            </Grid>
          )}
           
        </div>
      </SortableContext> 
    </>
  );
};

export default SortableGallery;
