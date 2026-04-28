import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { defaultCategories } from '../types/Index';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Edit, Trash2, CheckCircle,MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export function MyAnnonces() {
  const { user, getAnnonce, deleteMyannonce , recupereAnnonce} = useAuth();
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAnnonces();
  }, [user, navigate]);

  const loadAnnonces = async() => {
    const allAnnonces = await getAnnonce() ;
    const myAnnonces = allAnnonces.filter(a => a.id_user == user?.id_user);
    setAnnonces(myAnnonces);
  };

 const handleDelete = async () => {
  if (!deleteId) return;

  const res = await deleteMyannonce(deleteId);

  if (res) {
    loadAnnonces();
    toast.success('Annonce supprimée avec succès');
    setDeleteId(null);
  }
};

 const handleMarkAsRecuperated = async (id_annonce) => {
 const res = await recupereAnnonce(id_annonce);

  if (res) {
    loadAnnonces();
    toast.success('Annonce marquée comme récupérée');
  }
};
  if (!user) return null;

  const disponibles = annonces?.filter(a => a.status === 'disponible') || [];
  const reservees = annonces?.filter(a => a.status === 'reservee') || [];
  const recuperees = annonces?.filter(a => a.status === 'recuperee') || [];

  const AnnonceCard = ( {annonce} ) => (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {annonce.photo ? (
          <div className="sm:w-48 h-48 sm:h-auto flex-`shrink`-0">
            <img
              src={`http://localhost:3000/uploads/${annonce.photo}`} 
              alt={annonce.titre}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="sm:w-48 h-48 sm:h-auto flex-`shrink`-0 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Aucune photo</p>
          </div>
        )}
        
        <div className="flex-1 flex flex-col">
          <CardContent className="flex-1 pt-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg">{annonce.titre}</h3>
              <Badge variant={annonce.status == 'disponible' ? 'default' : 'secondary'}>
                {annonce.status == 'disponible' ? 'Disponible' : 
                 annonce.status == 'reservee' ? 'Réservée' : 'Récupérée'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{annonce.description}</p>
            <Badge variant="outline" className="text-xs">{defaultCategories[annonce.id_categorie]}</Badge>
            <span className="relative bottom-6 left-105 flex items-center gap-1 text-xs font-bold capitalize">
                  <MapPin size={14} />
                  {annonce.ville || "Ville inconnue"}
           </span>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/annonce/${annonce.id_annonce}`)}
            >
              Voir
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/edit-annonce/${annonce.id_annonce}`)}
            >
              <Edit className="size-4 mr-1" />
              Modifier
            </Button>
            {annonce.status !== 'recuperee' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleMarkAsRecuperated(annonce.id_annonce)}
              >
                <CheckCircle className="size-4 mr-1" />
                Marquer récupérée
              </Button>
            )}
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => setDeleteId(annonce.id_annonce)}
            >
              <Trash2 className="size-4 mr-1" />
              Supprimer
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes annonces</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos annonces de don d'objets
          </p>
        </div>
        <Button onClick={() => navigate('/create')}>
          Nouvelle annonce
        </Button>
      </div>

      <Tabs defaultValue="disponible" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="disponible">
            Disponibles ({disponibles.length})
          </TabsTrigger>
          <TabsTrigger value="reservee">
            Réservées ({reservees.length})
          </TabsTrigger>
          <TabsTrigger value="recuperee">
            Récupérées ({recuperees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disponible" className="mt-6">
          {disponibles.length > 0 ? (
            <div className="space-y-4">
              {disponibles.map(annonce => (
                <AnnonceCard key={annonce.id_annonce} annonce={annonce} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Aucune annonce disponible
            </p>
          )}
        </TabsContent>

        <TabsContent value="reservee" className="mt-6">
          {reservees.length > 0 ? (
            <div className="space-y-4">
              {reservees.map(annonce => (
                <AnnonceCard key={annonce.id_annonce} annonce={annonce} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Aucune annonce réservée
            </p>
          )}
        </TabsContent>

        <TabsContent value="recuperee" className="mt-6">
          {recuperees.length > 0 ? (
            <div className="space-y-4">
              {recuperees.map(annonce => (
                <AnnonceCard key={annonce.id_annonce} annonce={annonce} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Aucune annonce récupérée
            </p>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
