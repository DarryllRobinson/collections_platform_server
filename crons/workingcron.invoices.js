const cron = require('node-cron');
const fs = require('fs');
const niceInvoice = require('nice-invoice');

const db = require('../helpers/db');
const sendEmail = require('../helpers/send-email');
const createFolder = require('../helpers/create-folder');

// Need to make the logo fetch dynamic for actual clients - this is for testing purposes
//const mieLogo = require('../assets/img/mie_logo.png');
//const mieLogo = fs.readFileSync('../assets/img/mie_logo.png');

// Line items for testing invoice creation until API or flat file is available
const invoiceLineItems = [
  {
    line: 10,
    code: 5048,
    description: 'Combined Credit Check - South Africa',
    qty: 554,
    unit: 'ea',
    unitPrice: 9,
  },
  {
    line: 20,
    code: 9708,
    description: 'Combined Sequestration',
    qty: 136,
    unit: 'ea',
    unitPrice: 10,
  },
  {
    line: 30,
    code: 5133,
    description: 'Compuscan Comprehensive - South Africa',
    qty: 25,
    unit: 'ea',
    unitPrice: 15,
  },
  {
    line: 40,
    code: 5196,
    description: 'Experian Comprehensive - South Africa',
    qty: 84,
    unit: 'ea',
    unitPrice: 25,
  },
  {
    line: 50,
    code: 5197,
    description: 'Experian Notices - South Africa',
    qty: 35,
    unit: 'ea',
    unitPrice: 30,
  },
  {
    line: 60,
    code: 5426,
    description: 'Sequestration - South Africa',
    qty: 14,
    unit: 'ea',
    unitPrice: 17,
  },
  {
    line: 70,
    code: 5444,
    description: 'Transunion Comprehensive - South Africa',
    qty: 94,
    unit: 'ea',
    unitPrice: 16,
  },
  {
    line: 80,
    code: 5442,
    description: 'Transunion Notices - South Africa',
    qty: 39,
    unit: 'ea',
    unitPrice: 11,
  },
  {
    line: 90,
    code: 6008,
    description: 'XDS Comprehensive - South Africa',
    qty: 34,
    unit: 'ea',
    unitPrice: 5,
  },
  {
    line: 100,
    code: 9780,
    description: 'AFIS Standard Resubmission',
    qty: 14,
    unit: 'ea',
    unitPrice: 7,
  },
];

setTimeout(() => {
  runInvoices();
}, 5000);

async function runInvoices() {
  console.log('Starting runInvoices');
  const records = await fetchRecords();

  // Loop through records
  records.forEach(async (record) => {
    //console.log(record.customerName);
    let items = [];
    invoiceLineItems.forEach((invoiceLineItem) => {
      items.push(setItems(invoiceLineItem));
    });

    const invoiceDetail = populateInvoiceVariables(record, items);

    // Make a folder for the invoice
    await createFolder(
      __dirname + `/invoices/${record.customerRefNo}`,
      0744,
      function (err) {
        if (err) console.error(err);
        //else console.log(`Created folder for ${record.customerName}`);
      }
    );

    createInvoice(invoiceDetail, record);
    // create email with link to invoice
  });
  console.log(`Finished running ${records.length} invoices`);
}

async function fetchRecords() {
  const records = await db.Customer.findAll({
    attributes: [
      'customerName',
      'customerRefNo',
      'address1',
      'address2',
      'address3',
      'address4',
      'address5',
      'f_clientId',
    ],
  });
  return records;
}

function populateInvoiceVariables(record, items) {
  return {
    shipping: {
      name: record.customerName,
      address: record.address1,
      city: record.address2,
      state: record.address3,
      country: record.address4,
      postal_code: record.address5,
    },
    items: items,
    subtotal: 156,
    total: 156,
    order_number: 1234222,
    header: {
      company_name: 'Managed Integrity Evaluation (MIE)',
      company_logo: 'logo.png',
      company_address:
        'Building 2	| Jean Park Chambers 252 Jean Avenue Centurion 0157',
    },
    footer: {
      text: 'Enquiries MIE Accounts Email accounts@mie.co.za',
    },
    currency_symbol: 'R',
    date: {
      billing_date: '11 August 2021',
      due_date: '10 September 2021',
    },
  };
}

function setItems(item) {
  return {
    item: item.code,
    description: item.description,
    quantity: item.qty,
    price: item.unitPrice,
    tax: '',
  };
}

function createInvoice(invoiceDetail, record) {
  //console.log('createInvoice: ', record.customerRefNo);
  // First remove forward slashes from the customer name so as not to break the folder structure
  const name = record.customerName.replace(/\//g, ' ');
  try {
    niceInvoice(
      invoiceDetail,
      __dirname + `/invoices/${record.customerRefNo}/${name}.pdf`
    );
  } catch (err) {
    console.error(err);
  }
}

async function sendInvoices(user, origin) {
  const client = 'MIE';
  let message;
  if (origin) {
    const verifyUrl = `${origin}/users/verify-email?token=${user.verificationToken}`;
    message = `<p>Please click below to verify your email address:</p>
              <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the token below to verify your email address with the <code>/user/verify-email</code> api route:</p>
              <p><code>${user.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: user.email,
    subject: 'The System Collections Platform - Verify Email',
    html: `<h4>Invoice from ${client}</h4>
               <p>Thanks for registering!</p>
               ${message}`,
  });
}
