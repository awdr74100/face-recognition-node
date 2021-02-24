const faceapi = require('face-api.js');
const { Image } = require('canvas');
const isBase64 = require('is-base64');

const base64Convert = (base64) => {
  let mimetype = '';
  if (base64.slice(0, 10) === 'data:image') return base64;
  if (base64.slice(0, 1) === '/') mimetype = 'image/jpeg';
  if (base64.slice(0, 1) === 'i') mimetype = 'image/png';
  if (base64.slice(0, 1) === 'U') mimetype = 'image/webp';
  return `data:${mimetype};base64,${base64}`;
};

module.exports = (base64Array) => {
  return Promise.all(
    base64Array.map((base64) => {
      const base64Check = isBase64(base64, {
        allowMime: true,
        allowEmpty: false,
      });
      if (!base64Check) return null;
      const img = new Image();
      img.src = base64Convert(base64);
      return faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
    }),
  );
};
