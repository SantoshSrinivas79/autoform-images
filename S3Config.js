S3.config = {
  key: Meteor.settings.AWSAccessKeyId,
  secret: Meteor.settings.AWSSecretAccessKey,
  bucket: Meteor.settings.AWSBucket,
  region: Meteor.settings.AWSRegion
};
