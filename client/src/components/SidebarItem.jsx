export default function SidebarItem({ title, icon, active }) {
  return (
    <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${active ? "bg-indigo-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
      <span className="text-xl mr-3">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}
