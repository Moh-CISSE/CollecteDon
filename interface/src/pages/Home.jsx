/* Importation des hooks React, des composants UI,
   du contexte Auth et des utilitaires */
import { useState, useEffect } from "react";
import { AnnonceCard } from "@/components/AnnonceCard";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectValue,SelectTrigger } from "@/components/ui/select";
import { Filter,Search } from "lucide-react";
import { defaultCategories } from "@/types/Index";
import { useNavigate } from "react-router-dom";

/* Composant Home : affiche la liste des annonces avec recherche et filtres */
export function Home() {
  /* États pour stocker les annonces et les filtres */
  const [annonces, setAnnonces] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  /* Récupération de la fonction pour charger les annonces */
  const { getAnnonce } = useAuth();
  /* Hook de navigation */
  const navigate = useNavigate();
   /* Chargement des annonces au montage du composant */
  useEffect(() => {
    loadAnnonces();
  }, [navigate]);
  /* Fonction pour récupérer les annonces depuis l'API */
  const loadAnnonces = async () => {
  const storedAnnonces = await getAnnonce(); 
  setAnnonces(storedAnnonces);
};
/* Filtrage des annonces selon recherche, catégorie et statut */
  const filteredAnnonces = annonces.filter((annonce) => {
    /* Filtre par mot-clé (titre ou description) */
    const matchesSearch =
      annonce.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.description?.toLowerCase().includes(searchTerm.toLowerCase());
    /* Filtre par catégorie */
    const matchesCategory =
      categoryFilter === 'all' || defaultCategories[annonce.id_categorie] === categoryFilter;
    /* Filtre par statut */
    const matchesStatus =
      statusFilter === 'all' || annonce.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Section d'introduction */}
      <div className="mb-5 flex items-center gap-6 text-left">
          <img 
            src="/image.png" 
            alt="image" 
            className="w-33 h-32 object-contain"
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Plateforme de Don entre Particuliers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Donnez une seconde vie aux objets que vous n'utilisez plus. Partagez, 
              récupérez gratuitement dans une démarche solidaire et écoresponsable.
            </p>
          </div>
        </div>
      {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Champ de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Filtre par catégorie */}  
          <Select value={categoryFilter} onValueChange={setCategoryFilter}  >
            <SelectTrigger className="w-full md:w-48">
              <Filter className="size-4 mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            {/* Filtre par statut */}
            <SelectContent className=" h-48" >
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="Mobilier">Mobilier</SelectItem>
              <SelectItem value="Électronique">Électronique</SelectItem>
              <SelectItem value="Vêtements">Vêtements</SelectItem>
              <SelectItem value="Livres">Livres</SelectItem>
              <SelectItem value="Jouets">Jouets</SelectItem>
              <SelectItem value="Décoration">Décoration</SelectItem>
              <SelectItem value="Sport">Sport</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="reservee">Réservée</SelectItem>
              <SelectItem value="recuperee">Récupérée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Nombre de résultats */}
      <p className="mb-4 text-gray-600">
        {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''}
      </p>

      {/* Affichage des annonces à travers la boucle map*/}
      {filteredAnnonces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnonces.map((annonce) => (
            <AnnonceCard key={annonce.id_annonce} annonce={annonce} />
          ))}
        </div>
      ) : (
        /* Message si aucune annonce */
        <p className="text-center text-gray-500">
          Aucune annonce trouvée
        </p>
      )}
    </div>
  );
}