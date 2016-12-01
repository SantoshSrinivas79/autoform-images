import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';

let fileURLs = "";

AutoForm.addInputType('afImage', {
  template:'addImageTemplate',
  valueOut(){
    // TODO
    // console.log(imageURL.get());
    // return imageURL.get();
    console.log(fileURLs);
    return fileURLs;
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
      fileURLs += ',' + downloadUrl;
      // imageURL.set(downloadUrl);
      // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
    }
  });
});

const handleFiles = (files) => {
  // Clear old entries
  let uploadItems = $(".uploadItem");
  for(let i = 0; i < uploadItems.length; i++){
    const view = Blaze.getView(uploadItems[i]);
    Blaze.remove(view);
  }
  fileURLs = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // TODO will break if we have multiple file lists (don't do that?)
    Blaze.renderWithData(Template.uploadItem, file, $(".filesList")[0]);
  }
};

Template.addImageTemplate.events({
  'change .image-file-button'(event, target){
    handleFiles(event.currentTarget.files);
  },
  'drag .filedrag, dragstart .filedrag, dragend .filedrag, dragover .filedrag, dragenter .filedrag, dragleave .filedrag'(event,target){
    event.preventDefault();
    event.stopPropagation();
  },
  'drop .filedrag'(event,target){
    event.preventDefault();
    event.stopPropagation();
    handleFiles(event.originalEvent.dataTransfer.files);
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
