import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Temp';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [file, setFile] = useState(null);
  const [error, setError]=useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await updateProfile({
      name,
      phone,
      file,
    });
    if (res){
        toast.success('Profil mis à jour avec succès');
        navigate("/");
    }
    else{
        setError("Echec de la mise à jour du profil");
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
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles pour que les autres utilisateurs puissent vous contacter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          {error && (<Alert variant="destructive"> <AlertDescription>{error}</AlertDescription></Alert>)}
            <div className="flex justify-center mb-6">
              <Avatar className="size-24">
                <AvatarImage src={`http://localhost:3000/uploads/${user.photo}`} />
                <AvatarFallback className="text-2xl">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                placeholder="photo"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="text-xs text-gray-500">
                Collez votre photo de profil
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Enregistrer les modifications
              </Button>
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
