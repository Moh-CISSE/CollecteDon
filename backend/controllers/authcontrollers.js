import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// REGISTER

export async function register(req, res) {
  const { name, email, phone, password } = req.body;
  const [existing] = await db.query(
    "SELECT id_user FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    return res.status(400).json({ message: "Email déjà utilisé" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
  "INSERT INTO users (name, email, phone, password, isAdmin, isBlocked, createdAt, photo) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
  [name, email, phone, hashedPassword, 0, 0, ""]
);


  const newUser = {
    id: result.insertId,
    name,
    email,
    isAdmin: false,
    isBlocked: false,
    createdAt: new Date().toISOString(),
  };

  const token = jwt.sign({ id: newUser.id }, "SECRET_KEY", { expiresIn: "1h" });

  return res.json({ token, user: newUser });
}


// LOGIN

export async function login(req, res) {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Utilisateur introuvable" });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  const token = jwt.sign({ id_user: user.id_user }, "SECRET_KEY", { expiresIn: "7d" });

  delete user.password;

  return res.json({ token, user });
}


// GET PROFILE

export async function getProfile(req, res) {
  const [rows] = await db.query(
    "SELECT id_user, name, email, photo, isAdmin, isBlocked, createdAt FROM users WHERE id_user = ?",
    [req.user.id_user]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

    return res.json(rows[0]);
}


// UPDATE PROFILE

export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;

    const [current] = await db.query(
      "SELECT photo FROM users WHERE id_user = ?",
      [req.user.id_user]
    );

    if (!current.length) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const oldPhoto = current[0].photo || null;
    const newPhoto = req.file ? req.file.filename : oldPhoto;

    await db.query(
      "UPDATE users SET name = ?, phone = ?, photo = ? WHERE id_user = ?",
      [name, phone, newPhoto, req.user.id_user]
    );

    const [rows] = await db.query(
      "SELECT id_user, name, email, phone, photo, isAdmin, isBlocked, createdAt FROM users WHERE id_user = ?",
      [req.user.id_user]
    );

    return res.json(rows[0]);

  } catch (err) {
    console.error("Erreur updateProfile :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}


// Create Annonce

export async function create(req, res) {
  try {
    const { titre, description, id_user, id_categorie,ville } = req.body;
    const photo = req.file ? req.file.filename : null;

    const [result] = await db.query(
  `INSERT INTO annonce 
  (titre, description, id_user, id_categorie, photo, status,ville, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
  [titre, description, id_user, id_categorie, photo, "disponible",ville]);

  return res.json({ message: "Annonce créée avec succès", id: result.insertId });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}


//recuperer les annonces

export async function annonce(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        u.name AS userName,
        u.phone AS userPhone,
        u.email AS userEmail,
        u.photo AS userPhoto
      FROM annonce a
      JOIN users u ON a.id_user = u.id_user
      ORDER BY a.createdAt DESC
    `);

    return res.json(rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function reserveAnnonce(req, res) {
  const id = req.params.id_annonce;
  const userId = req.user.id_user;

  try {
    await db.query(
      "UPDATE annonce SET status='reservee', reservedBy=?, updatedAt=NOW() WHERE id_annonce=?",
      [userId, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export async function annulerreserveAnnonce(req, res) {
  const id = req.params.id_annonce;
  const userId = req.user.id_user;

  try {
    await db.query(
      "UPDATE annonce SET status='disponible', reservedBy=?, updatedAt=NOW() WHERE id_annonce=?",
      [userId, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export async function recupereAnnonce(req, res) {
  const { id_annonce } = req.body;

  try {
    await db.query(
      "UPDATE annonce SET status='recuperee', updatedAt=NOW() WHERE id_annonce=?",
      [id_annonce]
    );

    res.json({ success: true, id_annonce });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}



export async function deleteAnnonce(req, res) {
  const { id_annonce } = req.body;

  try {
    await db.query(
      "DELETE FROM annonce WHERE id_annonce=?",
      [id_annonce]
    );

    res.json({ success: true, id_annonce });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function allUser(req, res) {

  try {
    const [row] = await db.query(
      "SELECT * FROM users ORDER BY createdAt DESC ",
    );

    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteUser(req, res) {
  const { userId } = req.body;

  try {
    await db.query(
      "DELETE FROM users WHERE id_user=?",
      [userId]
    );

    res.json({ success: true, userId });
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteUserAnnonce(req, res) {
  const { id_user } = req.body;

  try {
    await db.query(
      "DELETE FROM annonce WHERE id_user=?",
      [id_user]
    );

    res.json({ success: true, id_user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export async function blockUser(req, res) {
  const { userId ,val} = req.body;

  try {
    await db.query(
      "UPDATE users SET isBlocked=? WHERE id_user=?",
      [val,userId]
    );

    res.json({ success: true, userId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function modifyAnnonce(req, res) {
  try {
    const { id_annonce } = req.params;
    const { titre, description, id_categorie,ville } = req.body;

    // Vérifier si l'annonce existe
    const [current] = await db.query(
      "SELECT photo FROM annonce WHERE id_annonce = ?",
      [id_annonce]
    );

    if (!current.length) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    const oldPhoto = current[0].photo;
    const newPhoto = req.file ? req.file.filename : oldPhoto;

    // Mise à jour
    await db.query(
      `UPDATE annonce 
       SET titre = ?, description = ?, id_categorie = ?, photo = ?,ville = ?, updatedAt = NOW()
       WHERE id_annonce = ?`,
      [titre, description, id_categorie, newPhoto, ville, id_annonce]
    );

    // Retourner l'annonce mise à jour
    const [rows] = await db.query(
      `SELECT id_annonce, titre, description, id_categorie, photo, ville, updatedAt 
       FROM annonce WHERE id_annonce = ?`,
      [id_annonce]
    );

    return res.json(rows[0]);

  } catch (err) {
    console.error("Erreur edit-annonce :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
