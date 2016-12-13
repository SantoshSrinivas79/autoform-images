import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

export const fileUrlMap = {};

const interation = 0;

AutoForm.addInputType('afImageElem', {
  template:'addImageElemTemplate',
  valueOut(){
    console.log(AutoForm.getCurrentDataForForm());
    if (!fileUrlMap[this.context.id]) {
      console.log('failing on id: ' + this.context.id);
      console.log(fileUrlMap);
      console.log(this);
      console.log(this.val());
      return '';
    } else {
      return fileUrlMap[this.context.id].get();
    }
  }
});


Template.addImageElemTemplate.onCreated(function(){
  this.uploader = new Slingshot.Upload("myFileUploads");

  fileUrlMap[this.data.atts.id] = new ReactiveVar(Template.instance().data.value || '');

  this.fileUrl = () => {
    return fileUrlMap[this.data.atts.id];
  }
});

// Template.addImageElemTemplate.onRendered(function() {
//
//
//   $('#' + this.data.atts.id).context.fileUrl = new ReactiveVar('');
// });

Template.addImageElemTemplate.onDestroyed(function(){
  // if(Template.instance().fileUrl().get() !== "") {
    // TODO fix image cleanup
    // const deletePath = fileUrl.get().slice(fileUrl.get().indexOf('.com') + '.com'.length)
    // S3.delete(deletePath, (err,res) => {
    //   console.log(err,res);
    // });
  // }
});

Template.addImageElemTemplate.events({
  'change .image-file-button'(event, target){

    const templateInstance = Template.instance();

    if(event.target.files.length !== 0){
      templateInstance.uploader.send(event.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.log(error);
          templateInstance.fileUrl().set("");
          // Log service detailed response.
          // console.error('Error uploading', uploader.xhr.response);
          // alert (error);
        }
        else {
          templateInstance.fileUrl().set(downloadUrl);
          // imageURL.set(downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        }
      });
    } else {
      templateInstance.fileUrl().set("");
    }
  }
});

Template.addImageElemTemplate.helpers({
  progress: function () {
    return Math.round(Template.instance().uploader.progress() * 100);
  },
  url: function(){
    if(isNaN(Template.instance().uploader.progress()) && Template.instance().data.value){
      return Template.instance().data.value;
    }
    return Template.instance().uploader.url(true);
  },
  shouldShowProgress: function(){
    return !isNaN(Template.instance().uploader.progress());
  },
  getAtts() {
    return this.atts;
  }
});
