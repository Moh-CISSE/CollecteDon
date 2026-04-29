/* Importation des hooks React, du contexte Auth, des composants UI et des utilitaires */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
/* Composant EditAnnonce : permet de modifier une annonce existante */  
export function EditAnnonce() {
  /* Récupération de l'id depuis l'URL */
  const { id_annonce } = useParams();
  /* Récupération des fonctions depuis le contexte Auth */
  const { user, getAnnonce, modifyAnnonce } = useAuth();
  /* Hook de navigation */
  const navigate = useNavigate();
  /* États pour stocker les données de l'annonce */
  const [annonce, setAnnonce] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [ville, setVille] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  /* Chargement des données de l'annonce lors du montage ou lorsque l'id change */
  useEffect(() => {
    const loadData = async () => {
      /*  Vérification si utilisateur connecté */
      if (!user) {
        navigate("/login");
        return;
      }
      const annonces = await getAnnonce();
      /* Recherche de l'annonce */
      const found = annonces.find((a) => a.id_annonce == id_annonce);
      /* Si annonce introuvable */
      if (!found) {
        navigate("/my-annonces");
        return;
      }
      /* Vérification du propriétaire */
      if (found.id_user !== user.id_user) {
        toast.error("Vous ne pouvez pas modifier cette annonce");
        navigate("/my-annonces");
        return;
      }
      /* Initialisation des champs */
      setAnnonce(found);
      setTitre(found.titre);
      setDescription(found.description);
      setCategory(found.category);
      setVille(found.ville);
      setPhotoUrl(found.photo || "");
    };
    loadData();
  }, [id_annonce, user]);
  /* Gestion de la soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!annonce) return;

    const annonces = await getAnnonce();
    const found = annonces.find((a) => a.id_annonce == annonce.id_annonce);
    /* Vérification existence annonce */
    if (!found) {
      setError("Annonce introuvable");
      return;
    }
    /* Vérification catégorie */
    if (category == undefined) {
      toast.error("Erreur Sélectionner une categorie");
    }
     /* Création de l'objet modifié */
    const updatedAnnonce = {
      id_annonce,
      titre,
      description,
      id_categorie: category,
      ville,
      photo: photoFile || null,
    };
    /* Appel API modification */
    const response = await modifyAnnonce(updatedAnnonce);

    if (response) {
      toast.success("Annonce mise à jour avec succès");
      navigate("/my-annonces");
    } else {
      setError("Annonce non mise à jour ou une erreur est survenue");
    }
  };
  /* Si l'annonce n'est pas encore chargée */
  if (!annonce) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={() => navigate("/my-annonces")}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Retour à mes annonces
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Modifier l'annonce</CardTitle>
          <CardDescription>
            Modifiez les informations de votre annonce de don
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Affichage des erreurs */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Champ titre */}
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de l'annonce *</Label>
              <Input
                id="titre"
                type="text"
                placeholder="Ex: Canapé 3 places en bon état"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </div>
            {/* Champ catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={category || ""} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mobilier</SelectItem>
                  <SelectItem value="2">Électronique</SelectItem>
                  <SelectItem value="3">Vêtements</SelectItem>
                  <SelectItem value="4">Livres</SelectItem>
                  <SelectItem value="5">Jouets</SelectItem>
                  <SelectItem value="6">Décoration</SelectItem>
                  <SelectItem value="7">Sport</SelectItem>
                  <SelectItem value="8">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Champ description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'objet, son état, les conditions de récupération..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
            {/* Champ ville */}
            <div className="space-y-2">
              <Label htmlFor="title">Ville *</Label>
              <Input
                id="ville"
                type="text"
                placeholder="Ex: Nice"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                required
              />
            </div>
            {/* Upload image */}
            <div className="space-y-2">
              <Label htmlFor="photo"> photo de l'objet</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPhotoUrl(URL.createObjectURL(file));
                    setPhotoFile(file);
                  }
                }}
                required
              />
              <p className="text-xs text-gray-500">
                Collez l'URL d'une image de l'objet (optionnel)
              </p>
            </div>
            {/* Aperçu image */}
            {photoUrl && (
              <div className="mt-3">
                <img
                  src={photoUrl}
                  alt="Aperçu"
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            )}
            {/* Boutons */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Enregistrer les modifications
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/my-annonces")}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
