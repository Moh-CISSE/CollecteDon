import { Lock  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button'
import { useState } from "react";
import { useAuth } from '@/contexts/Authcontext';
import { useNavigate } from 'react-router-dom';
import { Alert,AlertDescription } from '@/components/ui/alert';


export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch {
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <Lock  className="size-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
                Connectez-vous à votre compte pour accéder à la plateforme
            </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.fr"
                    value = {email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>

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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading} >
                {loading ? "Connexion..." : "Se connecter"}
                </Button>
                <p className="text-sm text-center text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-green-600 hover:underline font-medium">
                    S'inscrire
                </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
        </div>
    );
}