import React, { useEffect } from 'react';
import { Card, Icon, Placeholder, Popup } from 'semantic-ui-react';
import { Remove } from '../SortableGalleryItem/Remove';
import { div } from 'carbone/formatters/number';

const GalleryItem = React.memo(
  React.forwardRef(
    (
      {
        src, 
        dragOverlay,
        style,
        disabled,
        onRemove,
        onClick,
        attributes,
        listeners,
        errors
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }
        document.body.style.cursor = 'grabbing';
        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);
      const handleClick = (event) => {
        event.preventDefault();
        onRemove(src);
      }; 
 
      const downloadFile = () => {  
        const link = document.createElement('a');  
        link.href = src.path;
        link.download = src.name; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
      }


      const isName = () => {
        return src.name;
      }; 
      const isLink = () => {
        return src.path;
      }; 

      return (
        <>
          <style jsx global>
            {`     
              .cursor-default {
                cursor: default;
              }
            `}
          </style>
        
          <div ref={ref} style={style}>
            <Card style={{boxShadow: 'none',width:'100%'}}>
              <Card.Content style={{ padding: 4,textAlign:'left' }}>
                {errors?.count && (
                  <Popup
                    trigger={
                      <Icon
                        style={{ display: 'block', position: 'absolute', zIndex: 10, margin: 10 }}
                        size="large"
                        color="red"
                        name="attention"
                      />
                    }>
                    <div>
                      {errors.description ? 'Отсутствует:' : 'Отсутствует подписей: ' + errors.count}
                    </div>
                    {errors.description.split('\n').map((error) => (
                      <div>{error}</div>
                    ))}
                  </Popup>
                )}
                {!disabled && <Remove onClick={handleClick} />}
                <div {...attributes} className="cursor-default">
                    <a href={isLink()} target="_blank">
                      {isName()}
                    </a>
                </div>
              </Card.Content>
            </Card>
          </div>  
        </>      
      );
    }
  )
);

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;
