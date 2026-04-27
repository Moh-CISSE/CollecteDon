import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar,MapPin} from 'lucide-react';
import { defaultAnnonce,defaultCategories } from '../types/Index';

export function AnnonceCard({ annonce = defaultAnnonce })
{
  const getStatusBadge = () => {
    switch (annonce.status) {
      case 'disponible':
        return <Badge className="bg-green-500">Disponible</Badge>;
      case 'reservee':
        return <Badge className="bg-orange-500">Réservée</Badge>;
      case 'recuperee':
        return <Badge className="bg-gray-500">Récupérée</Badge>;
      default:
       return <Badge>Inconnu</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Link to={`/annonce/${annonce.id_annonce}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {annonce.photo && (
          <div className="w-full h-32 overflow-hidden rounded-t-lg">
            <img
              src={`http://localhost:3000/uploads/${annonce.photo}`}
              alt={annonce.titre}
              className="w-full h-full object-cover"
            />
          </div>

        )}
        <CardContent className="flex-1 pt-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{annonce.titre}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{annonce.description}</p>
          <Badge variant="outline" className="mb-3">{defaultCategories[annonce.id_categorie] || "Catégorie inconnue"}</Badge>
          <span className="relative bottom-8 left-56 flex items-center gap-1 text-xs font-bold capitalize">
            <MapPin size={14} />
            {annonce.ville || "Ville inconnue"}
          </span>
        </CardContent>
        <CardFooter className="border-t pt-3 flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={`http://localhost:3000/uploads/${annonce.userPhoto}`} />
            <AvatarFallback className="text-xs">{annonce.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{annonce.userName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="size-3" />
              <span>{formatDate(annonce.createdAt)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
