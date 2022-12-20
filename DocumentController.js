require('dotenv').config();
const { responseMessages } = require('../../../../../constants/responseMessage');
const { responseCodes, httpCodes } = require('../../../../../constants/responseCodes');
const employeeDocumentService = require('../../services/common/employeeDocumentService');
const multer = require('multer');
const { getConnection } = require("../../../../middleware/connectionManager");
const path = require("path");

const documentStorage = multer.diskStorage({
  destination: process.env.IMAGES_PATH+'/documents/default',
  filename: async (req, file, cb) => {
    var dbConnection = await getConnection(); //Getting tenant DB connection
    var pathToUpload = process.env.IMAGES_PATH + '/documents/default';
    var newRecord = {
      fileName : file.originalname,
      path : pathToUpload,
      createdById : req.body.createdById
    };
    var response = await employeeDocumentService.create(dbConnection, newRecord);
    if (response.status) {
      file.id = response.data._id;
      var condition = {
        _id: file.id
      };
      var updateData = {
        fileName : response.data._id + path.extname(file.originalname),
        link: `${process.env.APP_URL}/${pathToUpload}/${response.data._id}${path.extname(file.originalname)}`
      };
      var updateResponse = await employeeDocumentService.update(dbConnection, condition, updateData);
      if (updateResponse.status) {
        req.body.uploadError = false;
        return cb(null, `${updateResponse.data._id}${path.extname(file.originalname)}`);
      } else {
        req.body.uploadError = true;
        cb(null, `${responseMessages.upload.errorUploading}`);
      }
    } else {
      req.body.uploadError = true;
      cb(null, `${responseMessages.upload.errorUploading}`);
    }
  }

});

const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 5000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
      if (file.originalname.match(/\.(pdf|docx|PDF|DOCX|png|PNG|jpg|JPG)$/)) {
        req.body.formatError = false;
        req.body.fileAvailable = true;
        req.body.fileName = file.originalname;
      }else{
        req.body.formatError = true;
        req.body.fileAvailable = true;
        req.body.fileName = file.originalname;
      }
    cb(undefined, true)
  }
});

const documentsStore = async (req, res) => {
  if(req.files == undefined || req.files.length == 0){
    return res.status(httpCodes.code422).send({
      status: responseCodes.codeUnprocessableEntity,
      message: responseMessages.upload.documentNotFound,
      fileName : req.body.fileName
    });
  }else{
    if(req.body.formatError == false){
      if(req.body.uploadError == true){
        return res.status(httpCodes.code422).send({
          status: responseCodes.codeUnprocessableEntity,
          message: responseMessages.upload.errorUploading,
          fileName : req.body.fileName
        });
      }else{
          let fileInfo = [];
          req.files.map(async (file, i) => {
            fileInfo.push({
              id: file.id
            });
          });
          if(fileInfo.length == 1){
            await res.status(httpCodes.code200).send({
              statusCode: responseCodes.codeSuccess,
              message: responseMessages.common.success,
              data: fileInfo[0]
            });
          }else if(fileInfo.length > 1){
            await res.status(httpCodes.code200).send({
              statusCode: responseCodes.codeSuccess,
              message: responseMessages.common.success,
              data: fileInfo[0]
            });
          }else{
            res.status(httpCodes.code500).send({
              statusCode: responseCodes.codeInternalError,
            message: responseMessages.upload.errorUploading
            });
          }
      }
    }else{
      return res.status(httpCodes.code422).send({
        status: responseCodes.codeUnprocessableEntity,
        message: responseMessages.upload.invalidDocumentUploadFormat,
        fileName : req.body.fileName
      });
    }
  }
};

module.exports = { documentUpload, documentsStore };
