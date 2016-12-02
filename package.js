Package.describe({
  name: 'maxjohansen:autoform-images',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Image upload for Autoform',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.1');
  api.use('ecmascript');
  api.use('templating@1.2.15');
  api.use('edgee:slingshot@0.7.1');
  api.use('aldeed:autoform@5.8.1');
  api.use('lepozepo:s3@4.1.3');
  // api.mainModule('autoform-images.js');
  // api.addAssets(['addImageTemplate.html'], 'client');
  api.addFiles([
    'addImageTemplate.html','autoform-images.js',
  ], 'client');
  api.addFiles(['SlingshotConfig.js','S3Methods.js'],['client','server']);
  api.addFiles(['SlingshotDirective.js','S3Config.js'],['server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maxjohansen:autoform-images');
  // api.mainModule('autoform-images-tests.js');
});
