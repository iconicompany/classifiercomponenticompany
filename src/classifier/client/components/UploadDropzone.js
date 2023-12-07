import { useDropzone } from 'react-dropzone';

import { Card } from 'antd';

const UploadDropzone = ({
  onDrop,
  fileType,
  accept = [
    'image/*',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.text',
    'application/zip',
    'application/x-tika-ooxml',
    'application/x-tika-msoffice',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.spreadsheet'
  ]
}) => {
  const dropzone = useDropzone({
    accept,
    onDrop: async (acceptedFiles) => onDrop(acceptedFiles)
  });

  return (
    <div className="dossier__uploads" style={{ cursor: 'pointer' }}>
      <Card
        {...dropzone.getRootProps({
          className: 'updateDropzone'
        })}>
        <p>{fileType?.includes('image/') || !fileType ? 'Загрузить файлы' : 'Заменить файл'}</p>
        <p>Нажмите или перетащите</p>

        <input {...dropzone.getInputProps()} />
      </Card>
    </div>
  );
};

export default UploadDropzone;
