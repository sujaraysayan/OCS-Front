import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import api from '../api/axios';

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh")
    if (refreshToken) {
      try {
        await api.post('/api/token/', {
            refresh: refreshToken
        });
      } catch (error) {
        // handle error if needed
      }
    }
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    navigate("/login")
  }, [navigate])

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
      Logout
    </button>
  )
}

export default Logout