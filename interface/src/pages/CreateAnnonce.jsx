import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexte';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';


export function CreateAnnonce() {
  const { user, createannonce } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState ('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [ville,setVille]=useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

 useEffect(() => {
  if (!user) {
    navigate('/login');
  }
}, [user, navigate]);

if (!user) return null;


const handleSubmit = async (e) => {
  e.preventDefault();

  const newAnnonce = {
    titre: title,
    description,
    id_categorie: Number(category),
    ville,
    photoFile: photoFile || null,
    id_user: user.id_user,
    status: "disponible",
  };
  setLoading(true);
  setError("");
  try {
    const success = await createannonce(newAnnonce);
    if (success) {
      toast.success("Annonce publiée avec succès");
      navigate("/my-annonces");
    } else {
      setError("Erreur lors de la création de l'annonce");
    }
  } catch (err) {
    setError("Erreur lors de la création de l'annonce");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Publier une annonce de don</CardTitle>
          <CardDescription>
            Remplissez les informations sur l'objet que vous souhaitez donner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'annonce *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Canapé 3 places en bon état"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value)}>
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

            <div className="space-y-2">
              <Label htmlFor="photo">Photo de l'objet *</Label>
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
              />
              </div>
              {photoUrl && (
                  <div className="mt-3">
                    <img
                      src={photoUrl}
                      alt="Aperçu"
                      className="w-full max-h-64 object-cover rounded-lg border"
                    />
                  </div>
                )}

           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Informations de contact :</strong> Vos coordonnées (nom, email
                {user.phone && ', téléphone'}) seront visibles dans l'annonce pour que les 
                intéressés puissent vous contacter.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
               {loading ? "Publication..." : "Publier l'annonce"}
              </Button>
              {error && (
                <p className="text-red-600 text-sm font-medium">
                    {error}
                </p>
               )}
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
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
