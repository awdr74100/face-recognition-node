const faceapi = require('face-api.js');
const { Image } = require('canvas');

const base64Convert = (base64) => {
  let mimetype = '';
  if (base64.slice(0, 10) === 'data:image') return base64;
  if (base64.slice(0, 1) === '/') mimetype = 'image/jpeg';
  if (base64.slice(0, 1) === 'i') mimetype = 'image/png';
  if (base64.slice(0, 1) === 'U') mimetype = 'image/webp';
  return `data:${mimetype};base64,${base64}`;
};

module.exports = async (labels, base64) => {
  const faceMatcher = new faceapi.FaceMatcher(labels, 0.45);
  const img = new Image();
  img.src = base64Convert(base64);
  const singleResult = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!singleResult) return Promise.reject(new Error('custom/extraction-fail'));
  return faceMatcher.findBestMatch(singleResult.descriptor);
};
