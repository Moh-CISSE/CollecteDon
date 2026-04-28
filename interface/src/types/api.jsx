const API_URL = import.meta.env.VITE_API_URL;

export async function apiLogin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function apiRegister(name, email, phone, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password }),
  });

 if (!res.ok) {
  const text = await res.text();
  console.error("Erreur API:", text);
  return null;
}return res;}

export async function apiCreateannonce(token,updates) {
  const formData = new FormData();
  formData.append("titre", updates.titre);
  formData.append("description", updates.description);
  formData.append("id_categorie", updates.id_categorie);
  formData.append("id_user", updates.id_user);
  formData.append("status", updates.status);
  formData.append("ville",updates.ville);
 if (updates.photoFile) {
    formData.append("photo", updates.photoFile);
  } 
  const res = await fetch(`${API_URL}/auth/annonce/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });

  if (!res.ok) return null;
  return res.json();
}
export async function apiGetAnnonce() {
  const res = await fetch(`${API_URL}/auth/annonce`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}
export async function apiAnnulerreserverAnnonce(id_annonce) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/annonce/annuler/${id_annonce}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
       }
  });
  if (!res.ok) {
    const text = await res.text(); 
    console.error("Erreur API:", text);
    return null;
  }
  return res.json();
}
export async function apireserverAnnonce(id_annonce) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/annonce/reserver/${id_annonce}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
       }
  });
  if (!res.ok) {
    const text = await res.text(); 
    console.error("Erreur API:", text);
    return null;
  }
  return res.json();
}
export async function apirecupereAnnonce(id_annonce) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/annonce/recupere`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id_annonce })   
  });

  if (!res.ok) return null;
  return res.json();
}

export async function apimodifyAnnonce(updates) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("titre", updates.titre);
  formData.append("description", updates.description);
  formData.append("id_categorie", updates.id_categorie);
  formData.append("ville", updates.ville);


  if (updates.photo) {
    formData.append("photo", updates.photo);
  }

  const res = await fetch(`${API_URL}/auth/annonce/edit/${updates.id_annonce}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text(); 
    console.error("Erreur API:", text);
    return null;
  }
  return res.json();
}
export async function apideleteAnnonce(id_annonce) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/annonce/delete`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id_annonce }) 
  });

  if (!res.ok) return null;
  return res.json();
}


export async function apiGetProfile(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateProfile(token, updates) {
  const formData = new FormData();
  formData.append("name", updates.name);
  formData.append("phone", updates.phone);
 if (updates.file) {
    formData.append("photo", updates.file);
  }

  const res = await fetch(`${API_URL}/auth/update`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });
   if (!res.ok) {
    const text = await res.text(); 
    console.error("Erreur API:", text);
    return null;
  }
  return res.json();
}

export async function apideleteUserAnnonce(userId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/annonce/delete/userannonce`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId }) 
  });

  if (!res.ok) return null;
  return res.json();
}
export async function apiblockUser(userId,val) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/annonce/blockuser`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId,val}) 
  });

  if (!res.ok) return null;
  return res.json();
}
export async function apideleteUser(userId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/annonce/deleteuser`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId }) 
  });

  if (!res.ok) return null;
  return res.json();
}
export async function apigetAllUser() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/annonce/alluser`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }, 
  });

  if (!res.ok) return null;
  return res.json();
}

