import { assert } from 'meteor/practicalmeteor:chai';

describe('Test Slingshot config', function () {
  const fileRestrictionName = 'myFileUploads';
  it('Confirm slingshot file restriction ' + fileRestrictionName + ' exists.', function () {
    assert('allowedFileTypes' in Slingshot.getRestrictions(fileRestrictionName), 'Defined file restriction ' + fileRestrictionName);
  })
});
