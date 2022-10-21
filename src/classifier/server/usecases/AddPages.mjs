import { Page } from 'dossierjs';

export default class AddPages {
  /**
   * @param {DossierBuilder} dossierBuilder
   */
  constructor({ dossierBuilder }) {
    this.dossierBuilder = dossierBuilder;
  }

  /**
   *
   * @param {string} uuid
   * @param {string} name
   * @param {object} files
   * @return {Promise<*>}
   */
  async process({ uuid, name, ...files }) {
    const dossier = await this.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    files = Object.values(files);
    // если загружается не картинка или документ не является набором картинок, то все страницы документа затираются
    //if (!files[0].mimetype.includes('image/') || !document.isImages()) {
    //  await document.clear();
    //}
    await document.addPages(files.map(file => new Page(file)));
  }
}
