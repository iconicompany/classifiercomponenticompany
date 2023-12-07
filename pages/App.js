import { useState } from 'react';

import { Classifier } from '../src/client';
import { Classifierlist } from '../src/list';

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
    <div style={{ margin: '0 auto', maxWidth: '1024px' }}>
      <div style={{ marginTop: 50 }}>
        <Classifier
          uuid={uuid}
          name="classifier"
          schema={classifierSchema}
          onUpdate={console.log}
        />
      </div>

      <h2 style={{ marginBottom: 30, marginTop: 30, textAlign: 'center' }}>Только список файлов</h2>
      <div style={{ marginTop: 50 }}>
        <Classifierlist
          uuid={uuid}
          name="classifier"
          schema={classifierSchema}
          onUpdate={console.log}
        />
      </div>
    </div>
  );
}
