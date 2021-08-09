// libs
import express from "express";
import { param } from "express-validator";
// controller
import controller from "../controllers/teachers";
// middleware
import validate from "../middleware/validate";
import authorize from "../middleware/authorize";

const router = express.Router();

/** GET all teachers */
router.get(
    "/:id?",
    [
        param("id", "ID w nagłówku zapytania musi być liczbą naturalną.")
            .isInt()
            .optional()
    ],
    authorize,
    validate,
    controller.teachers
)

export = router;