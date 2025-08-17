import axios from '@/lib/axios';

export const saveVenteFlashConfig = async (configData: any) => {
  try {
    const response = await axios.post('/vente-flash/config', configData);
    return response.data;
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
};

export const getVenteFlashConfig = async () => {
  try {
    const response = await axios.get('/vente-flash/config');
    return response.data;
  } catch (error) {
    console.error('Error getting config:', error);
    return {
      sectionTitle: "Ventes Flash",
      sectionDescription: "Profitez de nos offres exclusives avant qu'il ne soit trop tard!",
      maxDisplay: 4,
      showOnFrontend: true,
      products: []
    };
  }
};