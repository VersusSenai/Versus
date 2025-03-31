import { FaHome, FaUsers, FaCog, FaSignOutAlt, FaTrophy, FaUserGraduate, FaFileAlt } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import logo from "../assets/logo.svg";

const menuItems = [
  { title: "Dashboard", icon: <FaHome />, active: true },
  { title: "Torneios", icon: <FaTrophy /> },
  { title: "Jogadores", icon: <FaUsers /> },
  { title: "Organizadores", icon: <FaUserGraduate /> },
  { title: "Inscrições", icon: <FaFileAlt /> },
  { title: "Relatórios", icon: <FaFileAlt /> },
  { title: "Configurações", icon: <FaCog /> },
];

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
      <div>
        <img src={logo} alt="Logo" className="w-12 h-12 mx-auto" />
        <h1 className="text-center text-lg font-semibold mt-2">Versus</h1>
      </div>

      <nav className="flex-1 mt-5">
        {menuItems.map((item, index) => (
          <SidebarItem key={index} title={item.title} icon={item.icon} active={item.active} />
        ))}
      </nav>

      <div className="bg-indigo-500 text-white p-4 rounded-lg text-center">
        <h2 className="text-sm font-semibold">Propaganda</h2>
        <p className="text-xs">bla bla bla bla</p>
        <button className="bg-white text-indigo-500 px-3 py-1 mt-2 rounded-full text-sm">Entrar</button>
      </div>
    </div>
  );
}
