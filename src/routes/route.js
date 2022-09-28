const express = require("express");
const  router  = express.Router();
const constroller = require("../controller/roomsController");

router.post("/roombook", constroller.roombook);
router.post("/roomresources", constroller.updateresources);



module.exports = router;
