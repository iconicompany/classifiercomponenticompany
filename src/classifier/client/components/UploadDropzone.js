import { useDropzone } from 'react-dropzone';
import { Segment } from 'semantic-ui-react';

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
    <Segment.Group className="dossier__uploads" horizontal style={{ cursor: 'pointer' }}>
      <Segment
        textAlign="center"
        style={{ padding: 10 }}
        {...dropzone.getRootProps({
          className: 'updateDropzone'
        })}>
        <div>
          <span>
            {fileType?.includes('image/') || !fileType ? 'Загрузить файлы' : 'Заменить файл'}
          </span>
        </div>
        <div>Нажмите или перетащите</div>
        <input {...dropzone.getInputProps()} />
      </Segment>
    </Segment.Group>
  );
};

export default UploadDropzone;
