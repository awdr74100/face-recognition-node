const express = require('express');
const { body, validationResult } = require('express-validator');
const loadLabels = require('../utils/loadLabels');
const recognition = require('../utils/recognition');

const router = express.Router();

router.post(
  '/',
  body('base64').isString().isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).send({ message: errs.array() });
    const { base64 } = req.body;
    try {
      const labels = await loadLabels();
      if (!labels.length) throw new Error('custom/empty-labels');
      const { distance, label } = await recognition(labels, base64);
      return res.send({
        success: true,
        username: label,
        distance: Math.round(distance * 1000) / 1000,
      });
    } catch (error) {
      if (error.message === 'custom/empty-labels')
        return res.send({ success: true, username: 'unknown' });
      if (error.message === 'custom/extraction-fail')
        return res.send({ success: false, message: '特徵提取失敗' });
      return res.status(500).send({ success: false, message: error.message });
    }
  },
);

module.exports = router;
