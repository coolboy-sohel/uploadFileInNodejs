
const employeeDocumentRepository = require("../../repositories/common/employeeDocumentRepository");

/**
 * @param dbConnection object. (Tenant Database Connection Details)
 * @param newRecord object.
 * @return Json
 * 
 * create a new object and send to repository to insert the document and return the response to controller.
 */
const create = async (dbConnection, newRecord) => {
    var repositoryResponse = await employeeDocumentRepository.create(dbConnection, newRecord);
    return repositoryResponse;
};
  
/**
 *
 * @param dbConnection object. (Tenant Databse Connection Details)
 * @param condition object.
 * @return Json
 * 
 * find the data in collection, return if data exists in the collection, return the response to controller.
 */
const findOne = async (dbConnection, condition) => {
    var findData = await employeeDocumentRepository.findOne(dbConnection, condition); 
    return findData;
};

/**
 * @param dbConnection object. (Tenant Database Connection Details)
 * @param condition object.
 * @param updateData object.
 * @return Json
 * 
 * update the existing document details to repository
 */
 const update = async (dbConnection, condition, updateData) => {
    var repositoryResponse = await employeeDocumentRepository.update(dbConnection, condition, updateData); 
    return repositoryResponse;
};

/**
 * @param dbConnection object. (Tenant Database Connection Details)
 * @param condition object.
 * @param updateData object.
 * @return Json
 * 
 * update the existing document details to repository
 */
 const updateDocumentStatus = async (dbConnection, documentsDetails) => {
    documentsDetails.documents.map( async (documentsData) => { 
      let condition = { _id :  documentsData.documentId};
      let updateData = { 
        fileName : documentsData.documentName,
        assignStatus : 1
      }
      var repositoryResponse=await employeeDocumentRepository.update(dbConnection, condition, updateData);
      return repositoryResponse;
    });
    
};

module.exports = { create, findOne, update, updateDocumentStatus }
