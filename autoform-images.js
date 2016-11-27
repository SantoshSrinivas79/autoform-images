import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

const imageFile = new ReactiveVar();
const imageURL = new ReactiveVar("");

const uploader = new Slingshot.Upload("myFileUploads");

AutoForm.addInputType('afImage', {
  template:'addImageTemplate',
  valueOut(){
    console.log(imageURL.get());
    return imageURL.get();
  },
});

deleteImage = () => {
  if(imageURL.get() !== ""){
    // TODO complete
    // https://github.com/CulturalMe/meteor-slingshot/issues/50#issuecomment-80965314
  }
}

Template.addImageTemplate.destroyed = function () {
  deleteImage();
};

Template.addImageTemplate.events({
  'change .image-file-button'(event, target){
    deleteImage();
    imageFile.set(event.currentTarget.files[0]);
    uploader.send(imageFile.get(), function (error, downloadUrl) {
      if (error) {
        console.log(error);
        // Log service detailed response.
        // console.error('Error uploading', uploader.xhr.response);
        // alert (error);
      }
      else {
        imageURL.set(downloadUrl);
        // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
      }
    });
  }
});
