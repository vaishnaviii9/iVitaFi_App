import axios from "axios";

const API_BASE_URL = 'https://dev.ivitafi.com/api'

export const resetPasswordService = async (email: string)=>{
    try {
         await axios.get(`${API_BASE_URL}/User/create-reset-password`,
            {
                params:{email}
              }
        )
       

    } catch (error) {
        throw error
    }
}