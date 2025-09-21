import { useState, useEffect } from "react";
import ProjectList from "./components/ProjectList";
import ChatBox from "./components/ChatBox";
import AuthForm from "./components/AuthForm";
import { HiMenu } from "react-icons/hi";

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsLoggedIn(false);
  //   setSelectedProject(null);
  // };

  const Header = () => (
    <header className="fixed top-0 left-0 w-full bg-blue-600 text-white font-bold py-3 px-6 text-lg shadow-md z-50">
      ProjectGPT
    </header>
  );

  const Footer = () => (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-gray-700 text-center py-1 border-t z-50 text-sm">
      Vedant Deshmukh © 2025
    </footer>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-100 mt-12 mb-6">
          <AuthForm onAuthSuccess={() => setIsLoggedIn(true)} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 relative bg-gray-50 mt-12 mb-6 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-blue-500 rounded text-white shadow-md"
          >
            <HiMenu size={24} />
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 bg-white border-r border-gray-300 w-64 transform transition-transform duration-300 ease-in-out z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex md:flex-col`}
        >
          <ProjectList
            selectedProject={selectedProject}
            setSelectedProject={(p) => {
              setSelectedProject(p);
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          />

          {/* Fixed Logout
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div> */}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col md:ml-64 overflow-auto">
          {selectedProject ? (
            <ChatBox project={selectedProject} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg px-4 text-center">
              Select a project to start chatting
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
