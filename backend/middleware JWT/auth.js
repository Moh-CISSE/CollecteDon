import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = { id_user: decoded.id_user };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}
