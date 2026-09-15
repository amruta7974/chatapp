import express from "express";

import {
  signup,
  login,
  logout,
  allUsers,
  updateProfile,
} from "../controller/user.controller.js";

import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/allusers", secureRoute, allUsers);

router.post("/logout", logout);

router.put("/update-profile", secureRoute, updateProfile);

export default router;
