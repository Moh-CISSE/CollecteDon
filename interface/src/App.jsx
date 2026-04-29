import { Route, Routes,BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import "./index.css";
import { Register } from "./pages/Register";
import { CreateAnnonce } from "./pages/CreateAnnonce";
import { AnnonceDetail } from "./pages/AnnonceDetail";
import { EditAnnonce } from "./pages/EditAnnonce";
import { MyAnnonces } from "./pages/MyAnnonces";
import { Profile } from "./pages/Profile";
import { Toaster } from "sonner";
import { Admin } from "./pages/Admin";
import { ProtectedRouter } from "./contexts/ProtectedRouter";
import { NotFound } from "./pages/NotFound";


export default function App() {
  return (
    
    <BrowserRouter>
       <Toaster richColors position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/create" element={<ProtectedRouter><CreateAnnonce /></ProtectedRouter>} />
        <Route path="/annonce/:id_annonce" element={<ProtectedRouter><AnnonceDetail /></ProtectedRouter>} />
        <Route path="/edit-annonce/:id_annonce" element={<ProtectedRouter><EditAnnonce/></ProtectedRouter>} />
        <Route path="/my-annonces" element={<ProtectedRouter><MyAnnonces/></ProtectedRouter>} />
        <Route path="/profile" element={<ProtectedRouter><Profile/></ProtectedRouter>} />
        <Route path="/admin" element={<ProtectedRouter><Admin/></ProtectedRouter>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>

    </BrowserRouter>
    
  );
}
