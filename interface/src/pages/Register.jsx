  /* Importation des hooks React, des outils de navigation, 
     du contexte Auth et des composants UI */
  import { useState,useEffect } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import { useAuth } from "../contexts/AuthContext";
  import {  UserRoundPlus } from "lucide-react";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card";
  import { Button } from "../components/ui/button";
  import { Label } from "../components/ui/label";
  import { Input } from "../components/ui/input";
  import { Alert, AlertDescription } from "../components/ui/alert";
/* Composant Register : permet de créer un compte 
   puis redirige vers la page de connexion */
export function Register() {
   /* Initialisation des états avec le hook useState */
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  /* Récupération de la fonction register depuis le contexte Auth */
  const { register } = useAuth();
  /* Hook de navigation */
  const navigate = useNavigate();
 /* Réinitialisation du message d'erreur à chaque modification des champs */
  useEffect(() => {
      setError("");
    }, [email , name, password,confirmPassword,phone]);
 /* La fonction permet la gestion de la soumission du formulaire : validation des champs,
     appel à l'API d'inscription et gestion des erreurs */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    /* Vérification du format de l'email */
    const emailRegex = /^[a-z]+[0-9]*[.]*[a-z]*@(gmail\.com|[a-z]+\.fr)+$/;
    if (!emailRegex.test(email) || email.length < 20) {
      setError("Email invalide");
      return;
    }
    /* Vérification de la correspondance des mots de passe */
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    /* Vérification de la longueur du mot de passe */
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    /* Activation du loading */
    setLoading(true);
    try {
      /*  Appel à la fonction d'inscription */
      const success = await register(name, email, phone, password);
      if (success) {
        /* Redirection vers la page login */
        navigate("/login");
      } else {
        setError("Cet email est déjà utilisé ou une erreur est survenue");
      }
    } catch {
      setError("Erreur lors de l'inscription");
    } finally {
      /* Désactivation du loading */
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <UserRoundPlus className="size-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour commencer à donner et récupérer des objets
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Affichage du message d'erreur */}
            {error &&  (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Champ Nom */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nom prenom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Champ Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrer Votre Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Champ Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone">phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Entrez Votre Numero de telephone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Champ Confirmation mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {/* Bouton de soumission */}
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>

            {/* Lien vers login */}
            <p className="text-sm text-center text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
