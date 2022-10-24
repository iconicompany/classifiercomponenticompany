import { defaultHandler, fileHandler } from '../../http/handlers.mjs';
import AddPages from './usecases/AddPages.mjs';
import GetPage from './usecases/GetPage.mjs';
import DeletePage from './usecases/DeletePage.mjs';
import CorrectionDocument from './usecases/CorrectPages.mjs';
import nc from 'next-connect';
import { uploadMiddleware, splitPdf } from '../../http/middlewares.mjs';
import bodyParser from 'body-parser';
import GetDocuments from './usecases/GetDocuments.mjs';
import CheckClassifications from './usecases/CheckClassifications.mjs';
import GetDocument from './usecases/GetDocument.mjs';
import ClassifyPages from './usecases/ClassifyPages.mjs';

const ClassifierApi = (createScope, onError, onNoMatch) => {
  const addPages = async (req, res) => defaultHandler(req, res, createScope, AddPages);
  const deletePage = async (req, res) => defaultHandler(req, res, createScope, DeletePage);
  const correctPages = async (req, res) =>
    defaultHandler(req, res, createScope, CorrectionDocument);
  const getDocuments = async (req, res) => defaultHandler(req, res, createScope, GetDocuments);
  const classifyPages = async (req, res) => defaultHandler(req, res, createScope, ClassifyPages);
  const checkClassifications = async (req, res) =>
    defaultHandler(req, res, createScope, CheckClassifications);

  const getPage = async (req, res) => fileHandler(req, res, createScope, GetPage);
  const getDocument = async (req, res) => fileHandler(req, res, createScope, GetDocument);

  return nc().use(
    '/api/classifications',
    nc({ attachParams: true, onError, onNoMatch })
      .use(uploadMiddleware.array('documents'))
      .use(splitPdf)
      // .use(compressImages)
      .use(bodyParser.json())
      .get('/:uuid', checkClassifications)
      .put('/:uuid', classifyPages)
      .get('/:uuid/documents', getDocuments)
      .post('/:uuid/documents/correction', correctPages)
      .get('/:uuid/documents/:name', getDocument)
      .put('/:uuid/documents/:name', addPages)
      .get('/:uuid/documents/:name/:number', getPage)
      .delete('/:uuid/documents/:name/:pageUuid', deletePage)
  );
};

export default ClassifierApi;
