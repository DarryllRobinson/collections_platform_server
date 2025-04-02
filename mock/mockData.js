const { faker } = require("@faker-js/faker");
const db = require("../helpers/db");

async function generateMockData() {
  // Ensure models are initialized
  //   if (!db.sequelize) {
  //     throw new Error(
  //       "Sequelize instance is not defined in db. Check db initialization."
  //     );
  //   }
  //   await db.sequelize.sync();

  // Mock data for Clients
  for (let i = 0; i < 5; i++) {
    await db.Client.create({
      clientName: faker.company.name(),
      tenant: faker.number.int({ min: 1, max: 5 }),
      passwordHash: faker.internet.password(),
      createdBy: faker.person.fullName(),
      updatedBy: faker.person.fullName(),
    });
  }

  //   // Mock data for Customers
  for (let i = 0; i < 10; i++) {
    await db.Customer.create({
      operatorShortCode: faker.string.alphanumeric(5),
      customerRefNo: faker.seed(15), // faker.number.int({ min: 1, max: 15 }),
      customerName: faker.company.name(),
      customerEntity: "Enterprise", // or "Consumer",
      regIdNumber: faker.string.alphanumeric(10), // ABN or ID number
      //   customerType: faker.word.noun(),
      //   productType: faker.commerce.product(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      address3: faker.location.city(),
      address4: faker.location.state(),
      address5: faker.location.zipCode(),
      createdBy: faker.person.fullName(),
      updatedBy: faker.person.fullName(),
      //   closedDate: faker.date.future(), // Should all be open for now
      //   closedBy: faker.person.fullName(), // Should all be open for now
      //   regIdStatus: faker.word.noun(), // e.g., "Active", "Inactive", "Filing for Insolvency"
      f_clientId: faker.number.int({ min: 1, max: 5 }),
      tenant: faker.number.int({ min: 1, max: 5 }),
    });
  }

  // Mock data for Accounts
  for (let i = 0; i < 15; i++) {
    await db.Account.create({
      accountNumber: faker.seed(20), // faker.number.int({ min: 1, max: 15 }),
      accountName: faker.company.name(),
      openDate: faker.date.past(),
      debtorAge: faker.number.int({ min: 18, max: 99 }),
      paymentTermDays: faker.number.int({ min: 30, max: 90 }),
      creditLimit: faker.finance.amount(1000, 10000, 2),
      totalBalance: faker.finance.amount(500, 5000, 2),
      amountDue: faker.finance.amount(100, 1000, 2),
      currentBalance: faker.finance.amount(100, 1000, 2),
      days30: faker.finance.amount(0, 500, 2),
      days60: faker.finance.amount(0, 500, 2),
      days90: faker.finance.amount(0, 500, 2),
      days120: faker.finance.amount(0, 500, 2),
      days150: faker.finance.amount(0, 500, 2),
      days180: faker.finance.amount(0, 500, 2),
      days180Over: faker.finance.amount(0, 500, 2),
      paymentMethod: faker.finance.transactionType(),
      paymentDueDate: faker.number.int({ min: 1, max: 31 }),
      debitOrderDate: faker.number.int({ min: 1, max: 31 }),
      lastPaymentDate: faker.date.past(),
      lastPaymentAmount: faker.finance.amount(100, 1000, 2),
      lastPTPDate: faker.date.future(),
      lastPTPAmount: faker.finance.amount(100, 1000, 2),
      accountNotes: faker.lorem.sentence(),
      //   accountStatus: faker.word.noun(), // e.g., "Active", "Inactive", "Closed"
      //   arg: faker.word.noun(), // Can't remember what this is for
      createdBy: faker.person.fullName(),
      updatedBy: faker.person.fullName(),
      f_customerRefNo: faker.number.int({ min: 1, max: 15 }),
      tenant: faker.number.int({ min: 1, max: 5 }),
    });
  }

  // Mock data for Cases
  for (let i = 0; i < 20; i++) {
    await db.Case.create({
      caseNumber: faker.seed(25), // faker.number.int({ min: 1, max: 25 }),
      currentAssignment: faker.person.fullName(),
      initialAssignment: faker.person.fullName(),
      caseNotes: faker.lorem.sentence(),
      kamNotes: faker.lorem.sentence(),
      currentStatus: faker.word.noun(), // Can be "Open", "Closed", "Pending", "Reopened"
      pendReason: faker.word.noun(),
      resolution: faker.word.noun(),
      caseReason: faker.word.noun(),
      //   lockedDatetime: faker.date.past(), // NULL until locked when an agent opens the case
      createdBy: faker.person.fullName(),
      //   reassignedDate: faker.date.future(), // NULL until case is reassigned
      //   reassignedBy: faker.person.fullName(), // NULL until case is reassigned
      //   reopenedDate: faker.date.future(), // NULL until case is reopened
      //   reopenedBy: faker.person.fullName(), // NULL until case is reopened
      //   updatedBy: faker.person.fullName(), // NULL until case is updated
      f_accountNumber: faker.number.int({ min: 1, max: 15 }),
      tenant: faker.number.int({ min: 1, max: 5 }),
    });
  }

  // Mock data for Contacts
  for (let i = 0; i < 25; i++) {
    await db.Contact.create({
      primaryContactName: faker.person.fullName(),
      primaryContactNumber: faker.phone.number(),
      primaryContactEmail: faker.internet.email(),
      representativeName: faker.person.fullName(),
      representativeNumber: faker.phone.number(),
      representativeEmail: faker.internet.email(),
      alternativeRepName: faker.person.fullName(),
      alternativeRepNumber: faker.phone.number(),
      alternativeRepEmail: faker.internet.email(),
      otherNumber1: faker.phone.number(),
      otherEmail1: faker.internet.email(),
      //   dnc1: faker.word.noun(),
      createdBy: faker.person.fullName(),
      updatedBy: faker.person.fullName(),
      f_accountNumber: faker.number.int({ min: 1, max: 20 }),
      tenant: faker.number.int({ min: 1, max: 5 }),
    });
  }

  // Mock data for Outcomes
  for (let i = 0; i < 30; i++) {
    await db.Outcome.create({
      outcomeStatus: faker.word.noun(), // e.g., "Resolved", "Unresolved", "Pending"
      transactionType: faker.word.noun(), // Can be "Call", "Email", "SMS", etc.
      numberCalled: faker.phone.number(),
      emailUsed: faker.internet.email(),
      contactPerson: faker.person.fullName(),
      outcomeResolution: faker.lorem.sentence(), // e.g., "Payment Arranged", "No Response", etc.
      ptpDate: faker.date.future(),
      ptpAmount: faker.finance.amount(100, 1000, 2),
      debitResubmissionDate: faker.date.future(),
      debitResubmissionAmount: faker.finance.amount(100, 1000, 2),
      outcomeNotes: faker.lorem.paragraph(),
      nextSteps: faker.lorem.sentence(),
      createdBy: faker.person.fullName(),
      f_caseNumber: faker.number.int({ min: 1, max: 25 }),
      tenant: faker.number.int({ min: 1, max: 5 }),
    });
  }

  console.log("Mock data generation completed.");
}

generateMockData().catch((err) => console.error(err));
