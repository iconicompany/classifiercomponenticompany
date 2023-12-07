import { useEffect, useState } from 'react';

import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import SortableGallery from './gallery/SortableGallery.js';

import { classifyDocument, deletePage, uploadPages, useDocuments, useTasks } from '../hooks';
import { errorNotification, infoNotification } from '../utils/notifications.js';
import { registerTwain } from '../utils/twain';

const Classifier = ({
  form,
  uuid,
  onInit,
  onUpdate,
  onRemove,
  onChange,
  showError,
  schema,
  readonlyClassifier = null
}) => {
  const [classifier, setClassifier] = useState(schema.classifier);
  const { tasks } = useTasks(uuid);
  const { documents, mutateDocuments, revalidateDocuments } = useDocuments(uuid);
  const [documentsTabs, setDocumentsTabs] = useState(schema.tabs);
  const [selectedTab, selectTab] = useState({});

  const [countStartedTasks, setCountStartedTasks] = useState(0);

  const [prev, setPrev] = useState(null);
  const [pageErrors, setPageErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    selectTab(getSelectedTab());
  }, []);

  useEffect(() => {
    if (!prev && Object.keys(documents).length) {
      onInit && onInit(documents);
      setPrev(documents);
    }
  }, [documents]);

  useEffect(() => {
    setClassifier(schema.classifier);
    setDocumentsTabs(schema.tabs);
  }, [schema]);

  const selectedDocument =
    'buyerQuestionnaire' !== 'classifier'
      ? documents[selectedTab.type]
        ? documents[selectedTab.type]
        : []
      : [];
  const finishedTasks = tasks.filter(({ status }) => status.code === 'FINISHED');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  if (readonlyClassifier !== null) {
    classifier.readonly = readonlyClassifier;
  }

  function getSelectedTab() {
    return documentsTabs.find((tab) => tab.type === 'buyerQuestionnaire');
  }

  /**
   * Добавление документов в форму
   */
  useEffect(() => {
    const uniformDocuments = {};

    for (const type in documents) {
      if (documents[type].length) {
        uniformDocuments[type] = documents[type];
      }
    }

    Object.keys(documents).length && onChange && onChange(uniformDocuments);
  }, [documents, form]);

  useEffect(() => {
    const processTasks = tasks.filter(
      ({ status }) => status.code === 'STARTED' || status.code === 'IN_QUEUE'
    );
    setCountStartedTasks(processTasks.length);
  }, [tasks]);

  useEffect(() => {
    const documents = revalidateDocuments();
    if (Object.entries(documents).length) {
      if (prev && onUpdate) {
        for (const type in documents) {
          if (prev[type].length !== documents[type].length) {
            const tab = documentsTabs.find((tab) => tab.type === type);

            !['unknown', 'classifier'].includes(tab.type) && onUpdate(tab, documents);
          }
        }
      }

      setPrev(documents);
    }
  }, [finishedTasks.length]);

  useEffect(() => {
    const interval = setInterval(() => setTwainHandler() && clearInterval(interval), 1000);
  }, []);

  useEffect(() => {
    setTwainHandler(), [selectedTab];
  });

  useEffect(() => {
    selectTab(getSelectedTab()), [uuid];
  });

  const setTwainHandler = () => {
    return registerTwain((file) => file && handleDocumentsDrop([file]), selectedTab.type);
  };

  const findContainer = (id) => {
    if (id in documents) {
      return id;
    }

    if (typeof id === 'object') {
      id = id.path;
    }

    return Object.keys(documents).find((key) => documents[key].find((item) => item.path === id));
  };

  const handleDocumentsDrop = async (acceptedFiles) => {
    if (!acceptedFiles.length) {
      return showError('Файл выбранного типа не доступен для загрузки.');
    }

    if (selectedTab.type === 'classifier') {
      !countStartedTasks && setCountStartedTasks(-1);
      const availableClasses = documentsTabs.filter((tab) => !tab.readonly).map((tab) => tab.type);
      const compressedFiles = acceptedFiles; //await compressFiles(acceptedFiles);
      classifyDocument(uuid, compressedFiles, availableClasses).then(revalidateDocuments);
    } else {
      setLoading(true);
      const compressedFiles = acceptedFiles; //await compressFiles(acceptedFiles);
      uploadPages(uuid, selectedTab.type, compressedFiles)
        .then(async (result) => {
          const documents = await revalidateDocuments();
          onUpdate && onUpdate(selectedTab, documents);
          setPrev(documents);
          result.error && processError(result.error, documents);
        })
        .finally(() => setLoading(false));
    }
  };

  const processError = (error, documents) => {
    if (error?.description?.type === 'signatureError') {
      addPagesErrors(error.description.info, documents);
      infoNotification(error.description.info);
    } else {
      errorNotification(error.description);
    }
  };

  const addPagesErrors = (errors, documents) => {
    setPageErrors({
      ...pageErrors,
      ...errors.reduce((acc, { number, count, description }) => {
        acc[documents[selectedTab.type][number - 1].uuid] = { count, description };

        return acc;
      }, [])
    });
  };

  const handlePageDelete = async (pageSrc) => {
    const activeContainer = findContainer(pageSrc);
    const newDocumentsList = {
      ...documents,
      [activeContainer]: documents[activeContainer].filter((item) => item !== pageSrc)
    };
    mutateDocuments(newDocumentsList, false);
    deletePage(pageSrc).then(async () => {
      onRemove && onRemove(selectedTab, newDocumentsList);
    });
  };

  return (
    <div className="dossier classifier">
      <DndContext sensors={sensors} modifiers={[snapCenterToCursor]}>
        <div className="dossier__wrap">
          <SortableGallery
            pageErrors={pageErrors}
            tab={selectedTab}
            srcSet={selectedDocument}
            onRemove={handlePageDelete}
            hasListOnly
          />
        </div>
      </DndContext>
    </div>
  );
};

export default Classifier;
