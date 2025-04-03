import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import eventRoute from "./eventRoute.js";
import express from "express"
import teamRoute from "./teamRoute.js";

const router = express.Router()

router.use("/event", eventRoute);
router.use("/user", userRoute);
router.use("/login", authRoute);
router.use("/team", teamRoute)

export default router;