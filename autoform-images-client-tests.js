import { assert } from 'meteor/practicalmeteor:chai';

describe('Initializing Autoform component', function () {
  const componentName = 'afImageElem';
  it('Confirm Autoform custom component ' + componentName + ' exists.', function () {
    assert(componentName in AutoForm._inputTypeDefinitions, 'Defined Autoform custom component ' + componentName);
  })
});
