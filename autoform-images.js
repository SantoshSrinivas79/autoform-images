import { Template } from 'meteor/templating';

const uploader = new Slingshot.Upload("myFileUploads");

AutoForm.addInputType('afImage', {
  template:'addImageTemplate',
});

Template.addImageTemplate.events({
  'change .image-file-button'(event, target){
    const file = event.currentTarget.files[0];
    uploader.send(file, function (error, downloadUrl) {
      if (error) {
        console.log(error);
        // Log service detailed response.
        // console.error('Error uploading', uploader.xhr.response);
        // alert (error);
      }
      else {
        console.log(downloadUrl);
        // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
      }
    });
  }
});
