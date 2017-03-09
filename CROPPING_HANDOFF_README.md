# Getting this plugin to draw croppie

## Install croppie
In your top-level app directory (~/projects/oji):
```bash
meteor npm install --save croppie
```

## Verify S3 settings
Make sure you're using `meteor --settings settings.json`, and that your settings file has all the necessary keys

## Check your schemas
Make sure your schema contains an image[s] attribute

## Check your autoform options
Make sure you're applying the right autoform options to the autoform

## Spin it up
Pull up your autoform and give the cropper a try

# Things to look at

- User interaction pattern (sequence of clicks)
- User interface
    - Appearance (button styles, positioning, etc.)
    - Timing (do UI elements appear/disappear at appropriate times?)
- API
    - Since this is a package, we want a way to pass options/config to croppie
- S3 file name. We can probably use the MD5 hash from CryptoJS, but that's a large dependency for one function.
