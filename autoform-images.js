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
    'croppie':'2.5.0',
    'exif-js':'2.2.1',
},'maxjohansen:autoform-images');
require('croppie/croppie.css');
EXIF = require('exif-js');
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
  const croppieIdSave = this.croppieId;
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
      let exifInfo;
      try {
        exifInfo = EXIF.readFromBinaryFile(event.target.result);
      } catch (e) {
        // couldn't extract EXIF metadata
      }
      const MAX_BYTES = 1000000;
      img.onload = () => {
        // set proper canvas dimensions before transform & export
        // if (exifInfo && [5,6,7,8].indexOf(exifInfo.Orientation) > -1) {
        //   canvas.width = img.height;
        //   canvas.height = img.width;
        // } else {
          // canvas.width = img.width;
          // canvas.height = img.height;
        // }
        canvas.width = img.width;
        canvas.height = img.height;
        if (blob.size > MAX_BYTES) {
          canvas.width = canvas.width / 4;
          canvas.height = canvas.height / 4;
        }
        // if (exifInfo) {
        //   switch (exifInfo.Orientation) {
        //     case 2: ctx.transform(-1, 0, 0, 1, canvas.width, 0); break;
        //     case 3: ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height ); break;
        //     case 4: ctx.transform(1, 0, 0, -1, 0, canvas.height ); break;
        //     case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        //     case 6: ctx.transform(0, 1, -1, 0, canvas.height , 0); break;
        //     case 7: ctx.transform(0, -1, -1, 0, canvas.height , canvas.width); break;
        //     case 8: ctx.transform(0, -1, 1, 0, 0, canvas.width); break;
        //     default: ctx.transform(1, 0, 0, 1, 0, 0);
        //   }
        // }
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        let config = {
            url:canvas.toDataURL(),
            orientation: exifInfo && exifInfo.Orientation,
        };
        croppieEl.bind(config);
        // debugger;
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
        },
        enableOrientation: true,
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
