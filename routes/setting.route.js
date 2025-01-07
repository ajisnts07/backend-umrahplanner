const express = require('express');
const router = express.Router();
const { indexSetting, showSetting, storeSetting, updateSetting, deleteSetting } = require('../controllers/setting.controller');

router.get('/', indexSetting);
router.get('/:id', showSetting);
router.post('/', storeSetting);
router.put('/:id', updateSetting);
router.delete('/:id', deleteSetting);

module.exports = router;
