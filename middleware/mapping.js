const mappings = {
  //mie: {
  'BP Code': 'customerRefNo',
  'BP Name': 'customerName',
  //},
};

let myModel = {
  'BP Code': '123www',
  'BP Name': 'bp name',
  'bp name': 'test field',
};

createNewObjectFromInput(myModel);

function createNewObjectFromInput(input) {
  //, callback) {
  console.log('input', input);
  let options = {};
  for (let property in input) {
    if (input.hasOwnProperty(property) && mappings[property]) {
      options[mappings[property]] = input[property];
    }
  }
  console.log('options', options);
  //let newObject = new MyModel(options);
  //newObject.save(callback);
}
