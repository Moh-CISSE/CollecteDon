import express from "express";
import upload from "../middleware/cloudinaryUpload.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
  create,
  annonce,
  reserveAnnonce,
  recupereAnnonce,
  deleteAnnonce,
  annulerreserveAnnonce,
  allUser,
  deleteUser,
  deleteUserAnnonce,
  blockUser,
  modifyAnnonce,
} from "../controllers/authcontrollers.js";

import auth from "../middleware JWT/auth.js";

const router = express.Router();

/* ------------------------- AUTHENTIFICATION ------------------------- */
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getProfile);
router.patch("/update", auth, upload.single("photo"), updateProfile);

/* --------------------------- ANNONCES --------------------------- */
router.post("/annonce/create", auth, upload.single("photo"), create);
router.get("/annonce", annonce);
router.patch("/annonce/reserver/:id_annonce", auth, reserveAnnonce);
router.patch("/annonce/annuler/:id_annonce", auth, annulerreserveAnnonce);
router.patch("/annonce/recupere", auth , recupereAnnonce);
router.delete("/annonce/delete",auth ,  deleteAnnonce);
router.patch("/annonce/edit/:id_annonce", auth, upload.single("photo"), modifyAnnonce);

/* --------------------------- UTILISATEURS --------------------------- */
router.get("/annonce/alluser", auth , allUser);
router.delete("/annonce/deleteuser", auth ,  deleteUser);
router.delete("/annonce/delete/userannonce", auth , deleteUserAnnonce);
router.patch("/annonce/blockuser",auth ,  blockUser);

export default router;
