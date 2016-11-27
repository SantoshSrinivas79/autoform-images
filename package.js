Package.describe({
  name: 'macsj200:autoform-images',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.1');
  api.use('ecmascript');
  api.use('templating');
  api.use('aldeed:autoform@4.0.0 || 5.0.0');
  // api.mainModule('autoform-images.js');
  // api.addAssets(['addImageTemplate.html'], 'client');
  api.addFiles([
    'addImageTemplate.html','autoform-images.js',
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('macsj200:autoform-images');
  api.mainModule('autoform-images-tests.js');
});
