const router = require("express").Router();

const {addMessage} = require('../controllers/messagesController');
const {getAllMessage} = require('../controllers/messagesController');

router.post('/addMsg', addMessage);
router.post('/getMsg', getAllMessage);

module.exports = router;