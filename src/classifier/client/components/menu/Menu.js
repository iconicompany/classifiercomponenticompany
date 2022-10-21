import { Checkbox, Divider, Menu as SemanticMenu } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import MenuBlock from './MenuBlock';
const Menu = ({ uuid, classifier, documents, blocks, selected, onDocumentSelect, hiddenTabs }) => {
  const [docBlocks, setDocBlocks] = useState([]);

  useEffect(() => {
    setDocBlocks(
      blocks.map((block) => {
        const blockDocs = documents.filter((document) => document.block === block.type);

        return {
          documents: blockDocs, 
          name: block.name,
          type: block.type,
          open: block.open
        };
      })
    );
  }, [blocks]);
  return (
    <SemanticMenu fluid vertical stackable>       
      {docBlocks.map((block) => {
        return (
          <MenuBlock
            uuid={uuid}
            key="offerCreateBlock"
            onDocumentSelect={onDocumentSelect}
            block={block}
          />
        );
      })} 
    </SemanticMenu>
  );
};

export default Menu;
