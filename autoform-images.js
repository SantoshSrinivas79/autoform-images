import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';

AutoForm.addInputType('afImage', {
  template:'addImageTemplate',
  valueOut(){
    // TODO
    // console.log(imageURL.get());
    // return imageURL.get();
  },
});

Template.uploadItem.onCreated(function(){
  this.uploader = new Slingshot.Upload("myFileUploads");

  this.uploader.send(this.data, function (error, downloadUrl) {
    if (error) {
      console.log(error);
      // Log service detailed response.
      // console.error('Error uploading', uploader.xhr.response);
      // alert (error);
    }
    else {
      console.log(downloadUrl);
      // imageURL.set(downloadUrl);
      // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
    }
  });
});

Template.addImageTemplate.events({
  'change .image-file-button'(event, target){
    let uploadItems = $(".uploadItem");
    for(let i = 0; i < uploadItems.length; i++){
      const view = Blaze.getView(uploadItems[i]);
      Blaze.remove(view);
    }
    const files = event.currentTarget.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // TODO will break if we have multiple file lists (don't do that?)
      Blaze.renderWithData(Template.uploadItem, file, $(".filesList")[0]);
    }
  }
});

Template.uploadItem.helpers({
  progress: function () {
    return Math.round(Template.instance().uploader.progress() * 100);
  },
  url: function(){
    // TODO fix weird slash bug
    return Template.instance().uploader.url(true);
  },
});
