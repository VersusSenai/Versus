import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import eventRoute from "./eventRoute.js";
import express from "express"
import teamRoute from "./teamRoute.js";
import matchRoute from "./matchRoute.js";

const router = express.Router()
eventRoute.use(matchRoute);
router.use("/event", eventRoute);
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/team", teamRoute)

export default router;