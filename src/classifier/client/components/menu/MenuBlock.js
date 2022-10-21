import MenuTab from './MenuTab';
import { Icon, Menu } from 'semantic-ui-react';
import { useState } from 'react';

const MenuBlock = ({ uuid, block, selected, hiddenTabs, onDocumentSelect }) => {
  const [isOpened, setOpen] = useState(block.open);

  return (
    <>
      {!!block?.documents?.length && (
        <>
          
          {block.documents.map((document) => {
            return (
              <MenuTab
                uuid={uuid}
                key={document.type}
                document={document}
                selected={selected}
                onDocumentSelect={onDocumentSelect} 
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default MenuBlock;
