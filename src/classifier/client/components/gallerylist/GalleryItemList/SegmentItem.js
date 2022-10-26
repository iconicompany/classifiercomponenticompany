import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

const SegmentItem = ({ src, onClick, rotation, scale }) => {
  const [[width, height], setWidthHeight] = useState([460, 600]);
  const contentRef = useRef(null);
  useEffect(() => {
    const imgContainer = contentRef.current;
    const { width, height } = window.getComputedStyle(imgContainer);
    setWidthHeight([parseFloat(width), parseFloat(height)]);
  }, [width, height]);

  return (
    <ScrollContainer
      innerRef={contentRef}
      style={{
        height: '75vh',
        position: 'relative',
        overflow: 'auto',
        cursor: 'grab',
        lineHeight: 0
      }}>
      {src && (
        <Image
          src={src}
          //width={width * scale}
          //height={height * scale}
          width={rotation === 0 || rotation === 180 ? width * scale : height * scale}
          height={rotation === 90 || rotation === 270 ? width * scale : height * scale}
          layout="fixed"
          quality={70}
          onClick={onClick}
          objectFit="contain"
          style={{
            overflow: 'visible',
            transform: `rotate(${rotation}deg)`,
            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitUserDrag: 'none'
          }}
        />
      )}
    </ScrollContainer>
  );
};

SegmentItem.displayName = 'SegmentItem';
export default SegmentItem;
