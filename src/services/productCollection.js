import api from "./api";

 export const getAllCollections = async()=>{
    try{
        const response = await api.get("/productcollection");
        return response.data;
    }
    catch (error) {
    console.error("Error fetching collections:", error.response?.data || error.message);
    throw error;
  }

}