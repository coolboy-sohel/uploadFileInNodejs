const employeeDocuments = require("../../models/common/employeeDocumentModel");
const { responseMessages } = require('../../../../../constants/responseMessage');

/**
 * function to create a new collection.
 *
 * @param dbConnection object. (Tenant Databse Connection Details)
 * @param newUploadData object.
 * @return Json
 */
const create = async (dbConnection, newUploadData) => {
    var modelName = await dbConnection.model("employee_documents", employeeDocuments);
    var createdData = await modelName.create(newUploadData);
    return { status: true, data: createdData };
};

/**
 * function to find the data in the collection.
 *
 * @param dbConnection object. (Tenant Databse Connection Details)
 * @param condition object.
 * @return Json
 */
const findOne = async (dbConnection, condition) => {
    var modelName = await dbConnection.model("employee_documents", employeeDocuments);
    var findData = await modelName.findOne(condition).lean();
    if(findData){
      return { status: true, data: findData };
    }else{
      return { status: false, message : responseMessages.common.noRecordFound, error: ""  };
    }
};

/**
 * function to find the data in the collection.
 *
 * @param dbConnection object. (Tenant Databse Connection Details)
 * @param condition object.
 * @return Json
 */
 const findAll = async (dbConnection, condition) => {
    var modelName = await dbConnection.model("employee_documents", employeeDocuments);
    var findData = await modelName.find(condition).lean();
    if(findData.length >  0){
      return { status: true, data: findData };
    }else{
      return { status: false, message: responseMessages.common.noRecordFound, error: "" };
    }
};

/**
 * function to update the data in the collection based on condition.
 *
 * @param dbConnection object. (Tenant Databse Connection Details)
 * @param condition object.
 * @param updateData object.
 * @return Json
 */
const update = async (dbConnection, condition, updateData) => {
    var modelName = await dbConnection.model("employee_documents", employeeDocuments);
    var updatedData = await modelName.findOneAndUpdate(condition, updateData); 
    if (updatedData) {
      return { status: true, data: updatedData };
    } else {
      return { status: false, message: responseMessages.common.failedToUpdate, error: updatedData };
    }
};

module.exports = { create, findOne, findAll, update };
