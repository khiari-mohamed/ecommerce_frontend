import axios from '@/lib/axios';

export const getNewArrivalWithConfig = async () => {
  try {
    // Get products and config from backend
    const response = await axios.get('/products/new-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrival config:', error);
    return {
      data: [],
      config: {
        sectionTitle: "Nouveautés",
        sectionDescription: "Découvrez nos nouveaux produits fraîchement arrivés !",
        maxDisplay: 100,
        showOnFrontend: true
      }
    };
  }
};