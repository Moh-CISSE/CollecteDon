import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContexte";
import { List, Plus, User, LogOut, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { toast } from "sonner";
export default function Hearder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
useEffect(() => {
  if (user.isBlocked == 1 && navigate ) {
    toast.error("Cette action n'est pas autorisé, Vous êtes bloqués par l'administrateur");
  }
}, [navigate]);
  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
          <img src="../../public/Gemini_Generated_Image_trh359trh359trh3.png" alt="logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-gray-900">DonPlateforme</span>
        </Link>
   <nav className="flex items-center gap-4">
             {user && user.id_user ? (
               <>
                 <Button asChild variant="outline" size="sm">
                   <Link to="/create">
                     <Plus className="size-4 mr-2" />
                     Publier une annonce
                   </Link>
                 </Button>
   
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                       <Avatar className="size-8">
                         <AvatarImage src={`http://localhost:3000/uploads/${user.photo}`} />
                         <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <span className="text-sm font-medium">{user.name}</span>
                     </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuItem asChild>
                       <Link to="/profile" className="cursor-pointer">
                         <User className="size-4 mr-2" />
                         Mon profil
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/my-annonces" className="cursor-pointer">
                         <List className="size-4 mr-2" />
                         Mes annonces
                       </Link>
                     </DropdownMenuItem>
                     { user.isAdmin == 1 && (
                       <>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                           <Link to="/admin" className="cursor-pointer text-orange-600">
                             <Shield className="size-4 mr-2" />
                             Administration
                           </Link>
                         </DropdownMenuItem>
                       </>
                     )}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                       <LogOut className="size-4 mr-2" />
                       Se déconnecter
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </>
             ) : (
               <div className="flex gap-2">
                 <Button asChild variant="outline" size="sm">
                   <Link to="/login">Connexion</Link>
                 </Button>
                 <Button asChild size="sm">
                   <Link to="/register">Inscription</Link>
                 </Button>
               </div>
             )}
           </nav>
        </div>
      </header>
    </>
  );
}
