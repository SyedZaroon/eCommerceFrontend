import api from "./api";

export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/products", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};

export const getSingleProduct = async(slug) =>{
  try{
    const res = await api.get(`/products/${slug}`)
    return res
  }
  catch(error){
    console.log(error)
    throw error
  }
}