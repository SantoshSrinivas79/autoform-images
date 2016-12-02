import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

let fileUrl = "";

AutoForm.addInputType('afImage', {
  template:'addImageTemplate',
  valueOut(){
    // TODO
    // console.log(imageURL.get());
    // return imageURL.get();
    console.log(fileUrl);
    return fileUrl;
  },
});

Template.addImageTemplate.onCreated(function(){
  this.uploader = new Slingshot.Upload("myFileUploads");
});

Template.addImageTemplate.events({
  'change .image-file-button'(event, target){
    Template.instance().uploader.send(event.target.files[0], function (error, downloadUrl) {
      if (error) {
        console.log(error);
        // Log service detailed response.
        // console.error('Error uploading', uploader.xhr.response);
        // alert (error);
      }
      else {
        fileUrl = downloadUrl;
        // imageURL.set(downloadUrl);
        // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
      }
    });
  }
});

Template.addImageTemplate.helpers({
  progress: function () {
    return Math.round(Template.instance().uploader.progress() * 100);
  },
  url: function(){
    // TODO fix weird slash bug
    return Template.instance().uploader.url(true);
  },
});
