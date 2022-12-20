const mongoose = require('mongoose');
const employeesModel = require('../employees/employeeModel');

const employeeDocuments = new mongoose.Schema(
    {
        fileName : {
            type: String,
            desc: "File name of the uploaded document"
        },
        path: {
            type: String,
            desc: "path to the document"
        },
        link: {
            type: String,
            desc: "link to access to the document"
        },
        awsuploadStatus: {
            type: Number,
            default : 0,
            desc: "used to upload the documen to aws"
        },
        createdById:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employeesModel",
            default: null,
            desc: "Created Employee Id"
        },
        updatedById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employeesModel",
            default: null,
            desc: "Updated Employee Id"
        },
        assignStatus : {
            type: Number,
            default : 0,
            desc: "If the assign status is 0 then the document will be permanently deleted. After uploading document is 1 day old."
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = employeeDocuments;
