const faceapi = require('face-api.js');
const User = require('../models/User');

module.exports = async () => {
  const users = await User.find().lean();
  return users.map((user) => {
    const descriptions = [];
    user.descriptors.forEach((descriptorStr) => {
      const descriptor = Object.values(JSON.parse(descriptorStr));
      descriptions.push(Float32Array.from(descriptor));
    });
    return new faceapi.LabeledFaceDescriptors(user.username, descriptions);
  });
};
