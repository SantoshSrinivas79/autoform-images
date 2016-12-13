Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
  bucket: Meteor.settings.AWSBucket,

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's id
    var user = Meteor.users.findOne(this.userId);
    return user._id + "/" + file.name;
  },
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
});
