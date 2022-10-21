import { SchemaBuilder } from '../client.js';

export default class ClassifierSchemaBuilder extends SchemaBuilder {
  build(schema, context) {
    this.init(schema, context);

    const classifier = this.getClassifierProperties(context.access);
    const blocks = this.getBlocksProperties();
    const tabs = this.getTabsProperties(context.access);
    const meta = this.getMeta(tabs);

    return { classifier, tabs, blocks, meta };
  }

  /**
   * Возвращает параметры вкладки классификатора
   *
   * @returns {{disabled: boolean}}
   */
  getClassifierProperties(access) {
    return {
      disabled: access === 'read' ? true : !this.processors.classifier.isDisplay()
    };
  }

  getBlocksProperties() {
    return this.schema.blocks.map((block) => ({
      name: block.name || '',
      type: block.type,
      collapsed: block.collapsed || false,
      open: block?.open?.includes(this.context.stateCode) || false
    }));
  }

  getTabsProperties(access) {
    return this.schema.documents
      .filter((documentSchema) => this.processors[documentSchema.type].isDisplay())
      .map((documentSchema) => ({  
        name: documentSchema.name,
        type: documentSchema.type,
        accept: documentSchema.accept,
        block: documentSchema.block,
        tooltip: documentSchema.tooltip || null,
        required: this.processors[documentSchema.type].isRequired(),
        readonly: access === 'read' ? true : this.processors[documentSchema.type].isReadonly()
      }));
  }

  getMeta(tabs) {
    return {
      required: tabs.filter(tab => tab.required && !tab.readonly).map(tab => tab.type)
    };
  }
}
