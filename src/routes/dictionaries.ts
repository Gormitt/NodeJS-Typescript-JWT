// libs
import express from "express";
// controller
import controller from "../controllers/dictionaries";
// middleware
import authorize from "../middleware/authorize";

const router = express.Router();

/** GET classes */
router.get(
    "/classes",
    authorize,
    controller.classes
)

export = router;