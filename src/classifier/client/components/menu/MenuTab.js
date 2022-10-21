import { Icon, Menu, Popup } from 'semantic-ui-react';
import { useDroppable } from '@dnd-kit/core';
import { useDocuments } from '../../hooks';

const MenuTab = ({ uuid, document, selected, disabled, onDocumentSelect, error, hidden }) => {
  let className = ''; 

  if (error) className += ' error';
  if (document.readonly) className += 'readonly';
  
  return (    
    <> 
        <div>          
          <Menu.Item             
            className={className}
            name={document.type}
            active={selected}
            onClick={onDocumentSelect}>
            <span>               
              {document.name}
            </span>
          </Menu.Item>
        </div> 
      
    </>
  );
};

export default MenuTab;
