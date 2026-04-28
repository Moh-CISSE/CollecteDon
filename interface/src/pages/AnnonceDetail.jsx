import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, Calendar, Mail, Phone,MapPin } from 'lucide-react';
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
import { defaultCategories} from '../types/Index';


export function AnnonceDetail() {
  const { id_annonce } = useParams();
  const { user, getAnnonce ,reserverAnnonce,AnnulerreserverAnnonce } = useAuth();
  const navigate = useNavigate('');
  const [annonce, setAnnonce] = useState(null);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [showAnnulerDialog, setShowAnnulerDialog] = useState(false);


  useEffect(() => {
    loadAnnonce();
  }, [id_annonce]);

  const loadAnnonce = async () => {
    const annonces = await getAnnonce();
    const found = annonces.find(a => a.id_annonce == id_annonce);
    setAnnonce(found || null);
  };
  const handleAnnuler= async () => {
  if (!user || !annonce) return;

  const res = await AnnulerreserverAnnonce(id_annonce);

  if (res) {
    setAnnonce({
      ...annonce,
      status: "disponible",
      reservedBy: user.id_user,
    });

    toast.success("Objet annulé avec succès");
    setShowAnnulerDialog(false);
  }
};
  const handleReserve = async () => {
  if (!user || !annonce) return;

  const res = await reserverAnnonce(id_annonce);

  if (res) {
    setAnnonce({
      ...annonce,
      status: "reservee",
      reservedBy: user.id_user,
    });

    toast.success("Objet réservé avec succès");
    setShowReserveDialog(false);
  }
};


  if (!annonce) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Annonce non trouvée</p>
      </div>
    );
  }

  const isOwner = user?.id_user === annonce.id_user;
  const isReservedByMe = user?.id_user === annonce.reservedBy;
  const canReserve = user && !isOwner && annonce.status === 'disponible';
  const canAnnuler =user &&  !isOwner && annonce.status === 'reservee';

  const getStatusBadge = () => {
    switch (annonce.status) {
      case 'disponible':
        return <Badge className="bg-green-500 text-lg px-4 py-1">Disponible</Badge>;
      case 'reservee':
        return <Badge className="bg-orange-500 text-lg px-4 py-1">Réservée</Badge>;
      case 'recuperee':
        return <Badge className="bg-gray-500 text-lg px-4 py-1">Récupérée</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Retour
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {annonce.photo ? (
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={`http://localhost:3000/uploads/${annonce.photo}`} 
                alt={annonce.titre}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">Aucune photo</p>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold">{annonce.titre}</h1>
              {getStatusBadge()}
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              {defaultCategories[annonce.id_categorie]}
            </Badge>
             <span className="relative bottom-6 left-68 flex items-center gap-1 text-xs font-bold capitalize">
            <MapPin size={14} />
            {annonce.ville || "Ville inconnue"}
           </span>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{annonce.description}</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Informations du donneur</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`http://localhost:3000/uploads/${annonce.userPhoto}`}  />
                    <AvatarFallback>{annonce.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{annonce.userName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="size-3" />
                      <span>Publié le {formatDate(annonce.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-gray-500" />
                    <a href={`mailto:${annonce.userEmail}`} className="text-blue-600 hover:underline">
                      {annonce.userEmail}
                    </a>
                  </div>
                  {annonce.userphone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-gray-500" />
                      <a href={`tel:${annonce.userphone}`} className="text-blue-600 hover:underline">
                        {annonce.userphone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {canReserve && (
              <Button 
                className="w-full"
                size="lg"
                onClick={() => setShowReserveDialog(true)}
              >
                Réserver cet objet
              </Button>
            )}

            {isReservedByMe && annonce.status === 'reservee' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Vous avez réservé cet objet.</strong> Contactez le donneur pour 
                  organiser la récupération.
                </p>
              </div>
             )}

             {canAnnuler && (
              <Button 
                className="w-full"
                size="lg"
                onClick={() => setShowAnnulerDialog(true)}
              >
               Annuler la Réservation 
              </Button>
            )}

            {isReservedByMe && annonce.status === 'disponible' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Vous avez annulé la reservation de cet objet.</strong>
                </p>
              </div>
             )}

            {isOwner && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/edit-annonce/${annonce.id_annonce}`)}
              >
                Modifier l'annonce
              </Button>
            )}

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Connectez-vous</strong> pour réserver cet objet et contacter le donneur.
                </p>
                <Button 
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/login')}
                >
                  Se connecter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showReserveDialog} onOpenChange={setShowReserveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réserver cet objet ? Le donneur sera notifié 
              et vous pourrez le contacter pour organiser la récupération.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReserve}>
              Confirmer la réservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAnnulerDialog} onOpenChange={setShowAnnulerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmez vous l'annulation de la réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la reservation de  cet objet ? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleAnnuler}>
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
