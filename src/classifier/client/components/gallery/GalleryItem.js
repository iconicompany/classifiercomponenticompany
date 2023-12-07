import React, { useEffect } from 'react';

import { Card, Popover, Button } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const GalleryItem = React.memo(
  React.forwardRef(({ src, dragOverlay, style, disabled, onRemove, attributes, errors }, ref) => {
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

    const isName = () => {
      return src.name;
    };

    const isLink = () => {
      return src.path;
    };

    return (
      <>
        <div ref={ref} style={style}>
          <Card className="gallery-item">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {errors?.count && (
                  <Popover
                    placement="top"
                    content={
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          maxWidth: '550px',
                          padding: '5px'
                        }}>
                        <div>
                          {errors.description
                            ? 'Отсутствует:'
                            : 'Отсутствует подписей: ' + errors.count}
                        </div>
                        {errors.description.split('\n').map((error, idx) => (
                          <div key={idx}>{error}</div>
                        ))}
                      </div>
                    }
                    trigger="hover">
                    <ExclamationCircleOutlined style={{ marginRight: '10px', color: 'red' }} />
                  </Popover>
                )}

                <div {...attributes}>
                  <a href={isLink()} title="Скачать" download={isName()} rel="noreferrer">
                    {isName()}
                  </a>
                </div>
              </div>

              {!disabled && (
                <Button
                  style={{ marginLeft: '5px' }}
                  shape="circle"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={handleClick}
                />
              )}
            </div>
          </Card>
        </div>
      </>
    );
  })
);

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;
