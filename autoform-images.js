import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

const logging = false;

let log = () => "";

if(logging)
    log = console.log;

log('we are logging');
checkNpmVersions({
    'croppie':'2.4.1',
    'exif-js':'2.2.1',
},'maxjohansen:autoform-images');
require('croppie/croppie.css');
exifJs = require('exif-js');
Croppie = require('croppie');

const fileUrlMap = {};

AutoForm.addInputType('afImageElem', {
  template:'addImageElemTemplate',
  valueOut(){
    return fileUrlMap[this.attr('data-schema-key')].get();
  }
});


Template.addImageElemTemplate.onCreated(function(){
  log('created template');
  this.uploader = new Slingshot.Upload("myFileUploads");

  fileUrlMap[this.data.name] = new ReactiveVar(Template.instance().data.value || '');

  this.fileUrl = () => {
    return fileUrlMap[this.data.name];
  }
  this.croppieExists = new ReactiveVar(false);
  this.croppieId = this.data.name.replace(".","-");
  this.reader = new FileReader();
  this.reader.addEventListener("load", (event) => {
      this.uploader = null;
      log('creating new uploader');
      this.uploader = new Slingshot.Upload("myFileUploads");
      log('binding new croppie');
      let croppieEl = this.croppieEl;
      const blob = new Blob([event.target.result]);
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.src = window.URL.createObjectURL(blob);
      const MAX_BYTES = 1000000;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (blob.size > MAX_BYTES) {
          canvas.width = canvas.width / 4;
          canvas.height = canvas.height / 4;
        }
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        croppieEl.bind({
            url:canvas.toDataURL(),
        });
      };
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
      Template.instance().filename = Date.now() + event.target.files[0].name;
      log('creating new croppie');
      Template.instance().croppieEl = new Croppie(document.getElementById(Template.instance().croppieId), {
        viewport: {
            width: 200,
            height: 200,
        },
        boundary: {
            width: '100%',
            height:300,
        }
      });
      log('new croppie created');
      Template.instance().reader.readAsArrayBuffer(event.target.files[0]);
    }
    return false;
  },
  'click a'(event, target){
    log('clicked file selector button');
    $('.upload-' + Template.instance().croppieId).click();
    return false;
  },
  'click .cropButton'(event, target){
      const templateInstance = Template.instance();
      log('uploading croppie data');
      Template.instance().croppieEl.result({
        type:'blob',
        format:'jpeg',
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
              // console.error('Error uploading', templateInstance.uploader.xhr.response);
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
      return false;
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
