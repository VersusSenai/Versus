import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import eventRoute from "./eventRoute.js";
import express from "express"

const router = express.Router()

router.use("/event", eventRoute);
router.use("/user", userRoute);
router.use("/login", authRoute);


export default router;