import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Menu, ChevronDown, User } from 'lucide-react'
import './App.css'
import { Sidebar } from './components/ui/Sidebar'
import Dashboard from './components/Dashboard'
import Auth from './components/auth/Auth'
import { useSelector } from 'react-redux'
import Companies from './components/Companies'
import Subscription from './components/Subscription'
import SuperAdminList from './components/SuperAdminList'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isAuthenticated = useSelector((state)=> state.auth.loggedIn)

  return (
    isAuthenticated ? (
      <div className='flex'>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-55" : "ml-16"}`}>
          <nav className="flex items-center justify-between bg-white border-b p-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-200">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-6">
              {/* Language Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <img src="https://flagcdn.com/w40/in.png" alt="English" className="w-5 h-5 rounded-full" />
                  <span>EN</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <User className="h-6 w-6" />
              </button>
            </div>
          </nav>

          <div className={"p-2"}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path='/subscriptions' element={<Subscription />} />
              <Route path='/super-admin' element={<SuperAdminList />} />
            </Routes>
          </div>
        </div>
      </div>
    ) : (
      <Auth />
    )
  )
}

export default App
