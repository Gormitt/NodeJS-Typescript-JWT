// libs
import express from "express";
import { body } from "express-validator";
// controller
import controller from "../controllers/sessions";
// middleware
import validate from "../middleware/validate";
import authorize from "../middleware/authorize";

const router = express.Router();

/** login route */
router.post(
    "/new", 
    [
        body("email", "Login musi być adresem e-mail.")
            .exists()
            .withMessage("Brak dostarczonego loginu.")
            .isEmail(),
        body("password", "Hasło musi co najmniej 6 znaków.")
            .exists()
            .withMessage("Brak dostarczonego hasła.")
            .isLength({ min: 6 })
    ], 
    validate,
    controller.login
);

/** token checking route */
router.get(
    "/check_token",
    authorize,
    controller.checkToken
)

export = router;