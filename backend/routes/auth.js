const express = require("express");
const upload = require("../middleware/upload");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);

module.exports = router;
