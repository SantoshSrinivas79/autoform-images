Package.describe({
  name: 'maxjohansen:autoform-images',
  version: '0.0.19',
  // Brief, one-line summary of the package.
  summary: 'Image upload for Autoform',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.3.1');
  api.use('ecmascript');
  api.use('templating@1.2.15');
  api.use('edgee:slingshot@0.7.1');
  api.use('aldeed:autoform@5.8.1');
  api.use('lepozepo:s3@5.2.4'); 
  api.use('tmeasday:check-npm-versions@0.3.1');
  // api.addAssets(['addImageTemplate.html'], 'client');
  api.addFiles([
    'addImageTemplate.html',
  ], 'client');
  api.addFiles(['SlingshotConfig.js','S3Methods.js'],['client','server']);
  api.addFiles(['SlingshotDirective.js','S3Config.js'],['server']);
  api.addFiles('autoform-images.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('dispatch:mocha');
  api.use('maxjohansen:autoform-images');
  //api.addFiles('autoform-images-tests.js');
});
