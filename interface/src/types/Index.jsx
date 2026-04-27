
// Modèle User

export const defaultUser = {
  id: "",
  email: "",
  name: "",
  photo: "",
  phone: "",
  isAdmin: false,
  isBlocked: false,
  createdAt: ""
};
//Modele AuthContext
export const defaultAuthContext = {
  user: null,
  token: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => {},
};
// Modèle Annonce
export const defaultAnnonce = {
  id_annonce: "",
  titre: "",
  description: "",
  category: "",
  photo: "",
  id_user: "",
  userName: "",
  userPhoto: "",
  userEmail: "",
  userPhone: "",
  status: "disponible", 
  createdAt: "",
  updatedAt: "",
  reservedBy:""
};

 

// Catégories
export const defaultCategories = {
  1 : "Mobilier",
  2 : "Électronique",
  3 : "Vêtements",
  4 : "Livres",
  5 : "Jouets",
  6 : "Décoration",
  7 : "Sport",
  8 : "Autre"
};
