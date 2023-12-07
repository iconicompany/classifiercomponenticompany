import React from 'react';

import { Popover } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const GalleryListItem = React.memo(
  React.forwardRef(({ src, style, attributes, errors }, ref) => {
    const isName = () => {
      return src.name;
    };
    const isLink = () => {
      return src.path;
    };

    return (
      <>
        <div ref={ref} style={style}>
          <div className="gallery-list-item">
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
          </div>
        </div>
      </>
    );
  })
);

GalleryListItem.displayName = 'GalleryListItem';

export default GalleryListItem;
