import { Classifier } from '../src/client';
import { Classifierlist } from '../src/list';
import { useState } from 'react';
import matching from '../src/mocks/matching.mjs';
import schema from '../src/mocks/schema.mjs';
import ClassifierSchemaBuilder from '../src/mocks/ClassifierSchemaBuilder.mjs';

const builder = new ClassifierSchemaBuilder(matching);

export default function App() {
  const uuid = '7533b049-88ca-489b-878a-3ac1c8616fe7';
  const [classifierSchema] = useState(builder.build(schema, { stateCode: 'CREATION' }));

  // Загрузчик со списком файлов Classifier
  // Только список файлов Classifierlist

  return (
    <>
    <div style={{ marginTop: 50 }} className="ui container">      
      <Classifier uuid={uuid} name="classifier" schema={classifierSchema} onUpdate={console.log} />
    </div>
    
    <div style={{ marginBottom: 30, marginTop: 30, textAlign:'center' }} className="ui container">Только список файлов</div>
    <div style={{ marginTop: 50 }} className="ui container">    
      <Classifierlist uuid={uuid} name="classifier" schema={classifierSchema} onUpdate={console.log} />
    </div>
    </>
  );
};
