const express = require('express');
const router = express.Router();
const { listarProfissionais } = require('../controllers/profissionaisController');

router.get('/', listarProfissionais);

module.exports = router;
