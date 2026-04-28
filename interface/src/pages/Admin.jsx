import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Temp';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Shield, Trash2, Ban, CheckCircle,MapPin} from 'lucide-react';
import { toast } from 'sonner';
import { defaultCategories } from '@/types/Index';
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

export function Admin() {
  const { user , getAnnonce,getAllUsers,deleteMyannonce,deleteUserAnnonce,deleteUser, blockUser} = useAuth();
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteAnnonceId, setDeleteAnnonceId] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  useEffect(() => {
    if (Number(user.isAdmin)!=1) {
      toast.error('Accès non autorisé');
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData =async () => {
    const storedAnnonces = await getAnnonce();
    const storedUsers = await getAllUsers();
    setAnnonces(storedAnnonces);
    setUsers(storedUsers.filter(u => Number(u.isAdmin) !== 1));
  };

  const handleDeleteAnnonce = async() => {
    if (!deleteAnnonceId) return;

    const res = await deleteMyannonce(deleteAnnonceId);
    if(res){
        loadData();
        toast.success('Annonce supprimée');
        setDeleteAnnonceId(null);
    }
  };

  const handleBlockUser = async(userId,val) => {
    const allUsers = await getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id_user === userId);
    
    if (userIndex !== -1) {
        const isBlocked = Number(allUsers[userIndex].isBlocked) === 1;
        const res = await blockUser(userId,val);
        if (res){
            loadData();
            toast.success(isBlocked ? 'Utilisateur débloqué' : 'Utilisateur bloqué');
        }
      
    }
    setActionUser(null);
  };

  const handleDeleteUser = async (userId) => {
    // Supprimer les annonces de l'utilisateur
    const res1 = await deleteUserAnnonce(userId);
    // Supprimer l'utilisateur
    const res2 = await deleteUser(userId);
    if (res1 && res2){
        loadData();
        toast.success('Utilisateur et ses annonces supprimés');
        setActionUser(null);
    }
    
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="size-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-gray-600">Modération des annonces et gestion des utilisateurs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Annonces</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{annonces.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Utilisateurs bloqués</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.filter(u => Number(u.isBlocked)===1).length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="annonces" className="w-full">
        <TabsList>
          <TabsTrigger value="annonces">Annonces ({annonces.length})</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="annonces" className="mt-6">
          {annonces.length > 0 ? (
            <div className="space-y-4">
              {annonces.map(annonce => (
                <Card key={annonce.id_annonce}>
                  <div className="flex flex-col sm:flex-row">
                    {annonce.photo && (
                      <div className="sm:w-32 h-32 flex-`shrink`-0">
                        <img
                          src={`http://localhost:3000/uploads/${annonce.photo}`} 
                          alt={annonce.titre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{annonce.titre}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{annonce.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{defaultCategories[annonce.id_categorie]}</Badge>
                            <Badge variant={annonce.status === 'disponible' ? 'default' : 'secondary'}>
                              {annonce.status}
                            </Badge>
                            <span className="text-xs text-gray-500">Par {annonce.userName}</span>
                            <span className="relative bottom-0 left-2 flex items-center gap-1 text-xs font-bold capitalize">
                                <MapPin size={14} />
                                {annonce.ville || "Ville inconnue"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/annonce/${annonce.id_annonce}`)}
                          >
                            Voir
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setDeleteAnnonceId(annonce.id_annonce)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Aucune annonce</p>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map(u => (
                <Card key={u.id_user}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar>
                          <AvatarImage src={`http://localhost:3000/uploads/${u.photo}`}  />
                          <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{u.name}</p>
                            {Number(u.isBlocked) === 1 && (
                              <Badge variant="destructive" className="text-xs">
                                <Ban className="size-3 mr-1" />
                                Bloqué
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          <p className="text-xs text-gray-500">
                            {annonces.filter(a => a.userId === u.id_user).length} annonce(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={Number(u.isBlocked) === 1 ? "outline" : "secondary"}
                          onClick={() => setActionUser({ id: u.id_user, action: 'block', isBlocked: u.isBlocked })}
                        >
                          {Number(u.isBlocked) === 1 ? (
                            <>
                              <CheckCircle className="size-4 mr-1" />
                              Débloquer
                            </>
                          ) : (
                            <>
                              <Ban className="size-4 mr-1" />
                              Bloquer
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setActionUser({ id: u.id_user, action: 'delete' })}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Aucun utilisateur</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog pour suppression d'annonce */}
      <AlertDialog open={!!deleteAnnonceId} onOpenChange={(open) => !open && setDeleteAnnonceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'annonce sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnnonce} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour actions utilisateur */}
      <AlertDialog open={!!actionUser} onOpenChange={(open) => !open && setActionUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionUser?.action === 'block' ? 'Bloquer/Débloquer cet utilisateur ?' : 'Supprimer cet utilisateur ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionUser?.action === 'block' 
                ? "L'utilisateur ne pourra plus se connecter s'il est bloqué."
                : "Cette action est irréversible. L'utilisateur et toutes ses annonces seront supprimés."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (actionUser) {
                  if (actionUser.action === 'block') {
                    handleBlockUser(actionUser.id,(Number(actionUser.isBlocked) == 1 ) ? 0 : 1);
                  } else {
                    handleDeleteUser(actionUser.id);
                  }
                }
              }}
              className={actionUser?.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
