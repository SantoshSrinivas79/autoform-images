# Autoform Images
An atmosphere package for adding image cropping and upload support to Autoform
[![Build Status](https://travis-ci.org/macsj200/autoform-images.svg?branch=master)](https://travis-ci.org/macsj200/autoform-images)

## Installation

### Add package
```bash
meteor add maxjohansen:autoform-images
```

### Install peer dependencies
```bash
meteor npm install --save croppie
```

## Configuration

### Settings configuration
We assume you have various S3 variables configured in your `Meteor.settings` file

```json
{
    "AWSAccessKeyId": "********************",
    "AWSSecretAccessKey": "****************************************",
    "AWSRegion": "*********",
    "AWSBucket": "*************"
}
```


### Add image[s] key to schema
You can just add a key of `type: String` if you want. It's ok to declare this as an array of strings if you want multiple images.

You can specify the custom autoform component inline in the schema, or you can specify it after-the-fact in your UI code via `Collection.simpleSchema().addAutoFormOptions(options)`.

Inline example
```javascript
new SimpleSchema({
    image:{
        type: String,
        autoform:{
            afFieldInput:{
                type: 'afImageElem',
            }
        },
    },
});
```

Outside of schema example
```javascript
dogsSchema = SimpleSchema({
    image:{
        type: String,
    },
});
// ...
// possibly in some other file
Dogs.simpleSchema.addAutoFormOptions({
    image:{
        afFieldInput:{
            type: 'afImageElem',
        }
    } 
});
```

Now, just render an autoform somewhere that uses this schema.

## Development
To test the latest version, clone the package from github.
```bash
git clone git@github.com:macsj200/autoform-images.git
```

Then, put the `autoform-images` folder inside your app's top-level `packages` directory. You can also symlink the folder in (`cd packages; ln -s /path/to/autoform-images .`). Make sure you've checked out the relevant branch.

## Todos
### Testing
### Clean up UI
### Create API
### Handle errors
### Verify efficiency in file handling (share uploaders, readers, etc.)


## Bugs
### Croppie UI should disappear after crop pressed
(It shouldn't wait for the upload to finish)
### File name is `undefined`
The primary issue is that we share file names across the whole bucket, and we don't want to overwrite the wrong files.  **This is likely exposing some underlying user auth/permission problems**. Meanwhile, to fix the name collision issues, we can implement some sort of hashing scheme. 

- MD5
    This is probably the safest route (least collision-prone). We will need to add an external dependency for computing this hash. We could use CryptoJS, but that's a very large dependency to introduce for one function.

- Original file name + current system time
    This would likely work pretty well also.

### iOS rotation metadata handling
We should probably just read the metadata, re-orient the image, then strip the metadata back out.
### Cleaning up unused images
Currently, no images are deleted from the bucket, *ever*. We should figure out a reasonable schedule to do so. Also, we should look into adding user permissions so people can't trample other users' files.
- Delete when component destroyed (array minus button)
    This strategy doesn't make much sense in the singleton case. Also, this may have issues with the way components are torn down (we don't want all the images removed when we refresh/navigate away)

- Delete after a certain period of time
    This could also be problematic. I don't really like this option.

- Add a remove button (distinct from array minus button)
Here, the user would manage their files. Ideally, this would mean that somehow even unsubmitted images persist somehow, possibly across forms. IDK if the user will actually be diligent about this though.


