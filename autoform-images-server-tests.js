import { assert } from 'meteor/practicalmeteor:chai';

describe('Initializing S3 Client', function () {
  it('Confirm S3 credentials exist.', function () {
    assert('key' in S3.config, 'S3 credentials configured');
  })
});

describe('Initializing Slingshot', function () {
  const directiveName = 'myFileUploads';
  it('Confirm slingshot directive ' + directiveName + ' exists.', function () {
    assert(directiveName in Slingshot._directives, 'Defined directive ' + directiveName);
  })
});
