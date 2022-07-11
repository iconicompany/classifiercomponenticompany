import DefaultProcessor from './DefaultProcessor.mjs';

export default class ClassifierProcessor extends DefaultProcessor {
  constructor(type, context) {
    super(type, context);
  }

  isDisplay() {
    if (this.context.isFailure) {
      return true;
    }

    return super.isDisplay();
  }
}
