import ClassifierPage from '../core/ClassifierPage.mjs';
import { chunkArray, prepareClassifies } from '../utils.mjs';

export default class ClassifyPages {
  /**
   * @param queue
   * @param {ClassifierGate} classifierGate
   * @param {DossierBuilder} dossierBuilder
   * @param {VerificationService} verificationService
   * @param {VerificationRepository} verificationRepository
   * @param {string} dossierPath
   * @param {DocumentService} classifierDocumentService
   * @param classifierQuantity
   */
  constructor({
    queue,
    classifierGate,
    dossierBuilder,
    verificationService,
    verificationRepository,
    dossierPath,
    classifierDocumentService,
    classifierQuantity
  }) {
    this.classifierGate = classifierGate;
    this.dossierBuilder = dossierBuilder;
    this.verificationService = verificationService;
    this.documentService = classifierDocumentService;
    this.dossierPath = dossierPath;
    this.verificationRepository = verificationRepository;
    this.classifierQuantity = classifierQuantity;
    // concurrency = 1 чтобы страницы отправлялись на распознавание последовательно,
    // так как для распознавания требуется класс предыдущей распознанной страницы
    this.queue = queue;
    this.queue.concurrency = 1;
  }

  /**
   *
   * @param uuid
   * @param availableClasses
   * @param files
   * @return {Promise<*>}
   */
  async process({ uuid, availableClasses = [], ...files }) {
    const dossier = await this.dossierBuilder.build(uuid);
    const pages = Object.values(files).map((file) => new ClassifierPage(file));
    let unknownDocument = dossier.getDocument('UNKNOWN');
    // сначала переместить все в нераспознанные
    for (const page of pages) {
      await unknownDocument.addPage(page);
    }

    const path = `${uuid}.classification`;
    let verification;
    let currentClassificationResult = [];
    verification = await this.verificationService.add('CLASSIFICATION', path);

    this.queue
      .add(
        async () => {
          const chunks = chunkArray(pages, this.classifierQuantity);
          for (const chunk of chunks) {
            let previousClass;
            await this.verificationService.start(verification);

            if (currentClassificationResult.length) {
              previousClass = currentClassificationResult.pop().code;
            } else {
              const lastFinishedTask = await this.verificationRepository.findLastFinishedByPath(path);
              previousClass = lastFinishedTask?.data?.classifiedPages?.pop().code || null;
            }

            unknownDocument.structure.refresh();
            const unknownPages = unknownDocument.getPagesByUuids(chunk.map(page => page.uuid));
            let classifies = await this.classifierGate.classify(unknownPages, previousClass);

            classifies = prepareClassifies(classifies, availableClasses);
            const classifiedPages = classifies.reduce((acc, current, index) => {
              acc[index] = { code: current, page: chunk[index] };
              return acc;
            }, []);
            unknownDocument.structure.refresh();
            for (const { code, page } of classifiedPages) {
              const unknownPage = unknownDocument.getPageByUuid(page.uuid);
              if (unknownPage) { // страница может быть перемещена пользователем
                const document = dossier.getDocument(code);
                document.structure.refresh();
                await this.documentService.movePage(unknownDocument, unknownPage, document);
              }
            }
            currentClassificationResult = [...currentClassificationResult, ...classifiedPages];
          }
          await this.verificationService.finish(verification, { classifiedPages: currentClassificationResult });
        },
        { path }
      )
      .catch(async (error) => {
        console.error(error);
        this.verificationService.cancel(verification);
      });

    return { path };
  }
}
