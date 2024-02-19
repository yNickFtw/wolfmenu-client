import styles from './Successfully.module.css'
import { api } from '../../api'
import { useEffect } from 'react'
import { useUserStore } from '../../states/user.state'
import UserService from '../../services/UserService/user.service'
import { toast } from 'react-toastify'

export const Successfully = () => {
    const { isLoggedIn, setLoggedUser, logout } = useUserStore();

    useEffect(() => {
        async function fetchLoggedUser() {
    
        const token = localStorage.getItem("token") as string;
    
        if(isLoggedIn) {
          const response = await new UserService().fetchLoggedUser(token);
    
          if(response.statusCode === 401) {
            toast.error(response.data.message, {
              theme: 'dark'
            })
    
            logout()
          }
    
          if(response.statusCode === 200) {
            setLoggedUser(response.data);
          }
    
        }
      }
    
      fetchLoggedUser()
    
      }, [])

  return (
    <h1>Obrigado por assinar</h1>
  )
}
