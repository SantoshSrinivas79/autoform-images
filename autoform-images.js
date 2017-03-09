import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

const logging = false;

let log = () => "";

if(logging)
    log = log;

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
      this.uploader = null;
      log('creating new uploader');
      this.uploader = new Slingshot.Upload("myFileUploads");
      log('binding new croppie');
      this.croppieEl.bind({
          url:this.reader.result,
      });
      this.croppieExists.set(true);
      log('new croppie bound');
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
    //   log(err,res);
    // });
  // }
});

Template.addImageElemTemplate.events({
  'change .image-file-button'(event, target){
    Template.instance().fileUrl().set("");
    if(event.target.files.length !== 0){
      Template.instance().filename = event.target.files[0].name;
      log('creating new croppie');
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
      log('new croppie created');
      Template.instance().reader.readAsDataURL(event.target.files[0]);
    }
  },
  'click a'(event, target){
    $('.upload-' + Template.instance().croppieId).click();
  },
  'click .cropButton'(event, target){
      const templateInstance = Template.instance();
      log('uploading croppie data');
      Template.instance().croppieEl.result({
        type:'blob',
      }).then((imageFile) => {
          log('obtained croppie blob');
          imageFile.name = templateInstance.filename;
          templateInstance.croppieEl.destroy();
          templateInstance.croppieEl = null;
          templateInstance.croppieExists.set(false);
          log('croppie destroyed', templateInstance.croppieEl);
          templateInstance.uploader.send(imageFile, function (error, downloadUrl) {
            if (error) {
              log(error);
              templateInstance.fileUrl().set("");
              // Log service detailed response.
              console.error('Error uploading', templateInstance.uploader.xhr.response);
              // alert (error);
            }
            else {
              log('setting new download url', downloadUrl);
              templateInstance.fileUrl().set(downloadUrl);
              log(templateInstance.uploader.dataUri);
              log('current uploader url', templateInstance.uploader.url(true));
              // imageURL.set(downloadUrl);
              // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
            }
          });
      }).catch((err) => {
         log('err getting croppie blob', err);  
      });
  }
});

Template.addImageElemTemplate.helpers({
  progress: function () {
    return Math.round(Template.instance().uploader.progress() * 100);
  },
  url: function(){
    if(Template.instance().fileUrl().get() === ""){
        return Template.instance().uploader.url(true);
    }
    return Template.instance().fileUrl().get();
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
});
