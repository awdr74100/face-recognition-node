const express = require('express');
const { body, validationResult } = require('express-validator');
const extraction = require('../utils/extraction');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/',
  body('base64Array').isArray({ min: 1 }).toArray(),
  body('username').isString().isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).send({ message: errs.array() });
    const { base64Array, username } = req.body;
    try {
      const features = await extraction(base64Array);
      const hasEmptyFeature = features.some((feature) => !feature);
      if (hasEmptyFeature) throw new Error('custom/extraction-fail');
      const descriptorsStringify = features.map((feature) => {
        return JSON.stringify(feature.descriptor);
      });
      await new User({ username, descriptors: descriptorsStringify }).save();
      return res.send({ success: true, message: '註冊成功' });
    } catch (error) {
      if (
        error.errors &&
        error.errors.username &&
        error.errors.username.kind === 'unique'
      )
        return res.send({ success: false, message: '用戶名已被使用' });
      if (error.message === 'custom/extraction-fail')
        return res.send({ success: false, message: '特徵提取失敗' });
      return res.status(500).send({ success: false, message: error.message });
    }
  },
);

module.exports = router;
