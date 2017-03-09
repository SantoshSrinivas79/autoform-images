import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    'croppie':'2.4.1'
},'maxjohansen:autoform-images');
require('croppie/croppie.css');
const Croppie = require('croppie');

const fileUrlMap = {};

AutoForm.addInputType('afImageElem', {
  template:'addImageElemTemplate',
  valueOut(){
    return fileUrlMap[this.attr('data-schema-key')].get();
  }
});


Template.addImageElemTemplate.onCreated(function(){
  this.uploader = new Slingshot.Upload("myFileUploads");

  fileUrlMap[this.data.name] = new ReactiveVar(Template.instance().data.value || '');

  this.fileUrl = () => {
    return fileUrlMap[this.data.name];
  }
  this.croppieExists = new ReactiveVar(false);
  this.croppieId = this.data.name.replace(".","-");
  this.reader = new FileReader();
  this.reader.addEventListener("load", () => {
      this.croppieEl.bind({
          url:this.reader.result,
      });
      this.croppieExists.set(true);
  });
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

    if(event.target.files.length !== 0){
      Template.instance().croppieEl = new Croppie(document.getElementById(Template.instance().croppieId), {
        viewport: {
            width: 200,
            height: 200,
        },
        boundary: {
            width:300,
            height:300,
        }
      });
      Template.instance().reader.readAsDataURL(event.target.files[0]);
    } else {
      Template.instance().fileUrl().set("");
    }
  },
  'click a'(event, target){
    $('.upload-' + this.atts['data-schema-key']).click();
  },
  'click .cropButton'(event, target){
      const templateInstance = Template.instance();
      Template.instance().croppieEl.result({
        type:'blob',
      }).then((imageFile) => {
          templateInstance.uploader.send(imageFile, function (error, downloadUrl) {
            if (error) {
              console.log(error);
              templateInstance.fileUrl().set("");
              // Log service detailed response.
              console.error('Error uploading', templateInstance.uploader.xhr.response);
              // alert (error);
            }
            else {
              templateInstance.fileUrl().set(downloadUrl);
              // imageURL.set(downloadUrl);
              // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
            }
            templateInstance.croppieEl.destroy();
            templateInstance.croppieExists.set(false);
          });
      });
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
  },
  croppieId() {
    return Template.instance().croppieId;
  },
  croppieExists() {
    return Template.instance().croppieExists.get();
  },
  fieldId() {
    return this.atts['data-schema-key'];
  }
});
