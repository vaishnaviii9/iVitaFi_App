import axios from 'axios';

const API_BASE_URL = 'https://dev.ivitafi.com/api'

export const authenticateUser = async( email: string, password: string)=>{
    try {
        const response = await axios.post(`${API_BASE_URL}/User/authenticate`,
            {
                email,
                password
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}