import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

let fileUrl = new ReactiveVar("");
let filePicked = new ReactiveVar(false);

AutoForm.addInputType('afImageElem', {
  template:'addImageElemTemplate',
  valueOut(){
    return fileUrl.get();
  },
});

Template.addImageElemTemplate.onCreated(function(){
  this.uploader = new Slingshot.Upload("myFileUploads");
});

Template.addImageElemTemplate.onDestroyed(function(){
  if(fileUrl.get() !== "") {
    const deletePath = fileUrl.get().slice(fileUrl.get().indexOf('.com') + '.com'.length)
    S3.delete(deletePath, (err,res) => {
      console.log(err,res);
    });
  }
});

Template.addImageElemTemplate.events({
  'change .image-file-button'(event, target){
    filePicked.set(event.target.files.length !== 0);
    if(filePicked.get()){
      Template.instance().uploader.send(event.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.log(error);
          fileUrl.set("");
          // Log service detailed response.
          // console.error('Error uploading', uploader.xhr.response);
          // alert (error);
        }
        else {
          fileUrl.set(downloadUrl);
          // imageURL.set(downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        }
      });
    } else {
      fileUrl.set("");
    }
  }
});

Template.addImageElemTemplate.helpers({
  progress: function () {
    return Math.round(Template.instance().uploader.progress() * 100);
  },
  url: function(){
    // TODO fix weird slash bug
    return Template.instance().uploader.url(true);
  },
  filePicked: function(){
    return filePicked.get();
  }
});
