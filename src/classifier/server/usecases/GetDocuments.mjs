import mime from 'mime-types';

export default class GetDocuments {
  /**
   * @param {DossierBuilder} dossierBuilder
   */
  constructor({ dossierBuilder }) {
    this.dossierBuilder = dossierBuilder;
  }

  async process({ uuid }) {
    const dossier = await this.dossierBuilder.build(uuid);
    const url = `${process.env.BASE_URL}/api/classifications/${uuid}/documents`;

    return dossier.getDocuments().reduce((accumulator, document) => {
      const links = document.getPages().map((page, i) => {
        return {
          id: `${url}/${document.type}/${i + 1}?_nocache=${document.structure.lastModified}`,
          path: `${url}/${document.type}/${i + 1}?_nocache=${document.structure.lastModified}`,
          uuid: page.uuid,
          name: page.originalName,
          type: mime.lookup(page.extension)
        };
      });
      
      return {
        ...accumulator,
        [document.type]: links
      };
    }, {});
  }
}
