const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorise = require('../middleware/authorise');
const Role = require('../helpers/role');
const invoiceService = require('./invoice.service');

const fs = require('fs');

// routes
router.get('/:customerRefNo', authorise(), getAllByCustomer);
router.post('/verify-invoice', verifyInvoiceSchema, verifyInvoice);
router.post('/document/', authorise(), getDocumentByLocation);
router.post('/u-document/', getDocumentByLocation);
router.post('/bulk', authorise(), bulkCreate);
router.post('/', authorise(), createSchema, create);
router.put('/:id', authorise(), updateSchema, update);
router.delete('/:id', authorise(), _delete);

module.exports = router;

function getAllByCustomer(req, res, next) {
  const { tenant, passwordHash } = req.user;
  const { customerRefNo } = req.params;
  console.log('getAllByCustomer customerRefNo:', customerRefNo);
  invoiceService
    .getAllByCustomer(customerRefNo, tenant, passwordHash)
    .then((invoices) => res.json(invoices))
    .catch(next);
}

function getDocumentByLocation(req, res, next) {
  //console.log('********** getDocumentByLocation req.body', req.body);
  const { location } = req.body;
  console.log('location: ', location);
  //const fileName = filepath + 'First_Customer.pdf';
  fs.readFile(location, (err, data) => {
    if (err) res.status(500).send(err);
    console.log('data: ', data);
    res
      .contentType('application/pdf')
      //.contentLength(Buffer.byteLength(data))
      .send(
        `data:application/pdf;base64,${new Buffer.from(data).toString(
          'base64'
        )}`
      );
  });
}

function verifyInvoiceSchema(req, res, next) {
  const schema = Joi.object({ token: Joi.string().required() });
  validateRequest(req, next, schema);
}

function verifyInvoice(req, res, next) {
  invoiceService
    .verifyInvoice(req.body)
    .then((location) => res.json({ location }))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    operatorShortCode: Joi.string(),
    invoiceRefNo: Joi.string().required(),
    invoiceName: Joi.string().required(),
    invoiceEntity: Joi.string().required(),
    regIdNumber: Joi.string(),
    invoiceType: Joi.string(),
    productType: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    address3: Joi.string(),
    address4: Joi.string(),
    address5: Joi.string(),
    createdDate: Joi.date(),
    createdBy: Joi.string().required(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    closedDate: Joi.date(),
    closedBy: Joi.string(),
    regIdStatus: Joi.string(),
    f_clientId: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  invoiceService
    .bulkCreate(req.body)
    .then((invoice) => res.json(invoice))
    .catch(next);
}

function create(req, res, next) {
  invoiceService
    .create(req.body)
    .then((invoice) => res.json(invoice))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    operatorShortCode: Joi.string(),
    invoiceRefNo: Joi.string().required(),
    invoiceName: Joi.string().required(),
    invoiceEntity: Joi.string().required(),
    regIdNumber: Joi.string(),
    invoiceType: Joi.string(),
    productType: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    address3: Joi.string(),
    address4: Joi.string(),
    address5: Joi.string(),
    createdDate: Joi.date().required(),
    createdBy: Joi.string().required(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    closedDate: Joi.date(),
    closedBy: Joi.string(),
    regIdStatus: Joi.string(),
    f_clientId: Joi.number().required(),
  };
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  invoiceService
    .update(req.params.id, req.body)
    .then((invoice) => res.json(invoice))
    .catch(next);
}

function _delete(req, res, next) {
  invoiceService
    .delete(req.params.id)
    .then(() => res.json({ message: 'Customer deleted successfully' }))
    .catch(next);
}
