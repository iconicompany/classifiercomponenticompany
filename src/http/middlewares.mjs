import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Poppler } from 'node-poppler';
import im from 'imagemagick';
import { promisify } from 'util'; 

export const uploadMiddleware = multer({
  limits: {
    fileSize: process.env['apps.classifier.filesize']
      ? process.env['apps.classifier.filesize'] * 1024 * 1024
      : 30 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const destination =
        process.env.DOSSIER_DOCUMENT_PATH + '/dossier/' + req.params.uuid + '/pages'; 

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      return cb(null, destination);
    },
    filename: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      return cb(null, uuidv4() + '.' + file.originalname.split('.').pop());
    }
  })
});

export const splitPdf = async (req, res, next) => {
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;     
    return [...files, file];    
  }, []);
  next();
};

export const convertToJpeg = async (req, res, next) => {
  const convert = promisify(im.convert);
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;
    if (['image/bmp', 'image/tiff', 'image/heic'].includes(file.mimetype)) {
      const jpegOutput = `${file.destination}/${file.filename.split('.')[0]}.jpg`;
      await convert([file.path, '-format', 'jpg', jpegOutput]);
      fs.unlinkSync(file.path);
      return [
        ...files,
        {
          mimetype: 'image/jpeg',
          path: jpegOutput
        }
      ];
    } else {
      return [...files, file];
    }
  }, []);
  next();
};

//export const compressImages = async (req, res, next) => {
//  req.files = await req.files?.reduce(async (accumulator, file) => {
//    const files = await accumulator;
//    const processingImage = sharp(file.path);
//    const outputName = `${uuidv4()}.jpg`;
//    const outputPath = `${file.destination}/${outputName}`;
//    await processingImage
//      .toFormat('jpeg')
//      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
//      .toFile(outputPath);
//
//    fs.unlinkSync(file.path);
//    return [...files, { path: outputPath, mimetype: 'image/jpeg', filename: outputName }];
//  }, []);
//  next();
//};
