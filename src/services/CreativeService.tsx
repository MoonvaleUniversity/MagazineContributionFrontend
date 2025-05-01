import { deleteData, getData, updateMultimedia, uploadMultimedia } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";

export const CreativeService = {
  fetchSparks: async () => {
    try {
      const response = await getData(MvUrl.CREATIVE_SPARKS.INDEX);
      return response.data.creative_sparks.data; // Adjust based on API response structure
    } catch (err) {
      console.error("Failed to fetch creative sparks:", err);
      throw new Error("Failed to load creative sparks");
    }
  },

  deleteSpark: async (id: string) => {
    try {
      await deleteData(MvUrl.CREATIVE_SPARKS.DESTROY(Number(id)));
      console.log(`Spark with ID ${id} deleted successfully.`);
    } catch (err) {
      console.error(`Failed to delete spark with ID ${id}:`, err);
      throw new Error(`Failed to delete spark with ID ${id}`)
    }
},

    
        updateSpark: async (FormData: FormData, id: string) => {
            try {
                await updateMultimedia(MvUrl.CREATIVE_SPARKS.UPDATE(Number(id)), FormData);
                console.log(`Spark with ID ${id} updated successfully.`);
            } catch (err) {
                console.error(`Failed to update spark with ID ${id}:`, err);
                throw new Error(`Failed to update spark with ID ${id}`);
            }
        },

        createSpark: async (FormData: FormData) => {
            try {
                await uploadMultimedia(MvUrl.CREATIVE_SPARKS.STORE, FormData);
                console.log("New spark created successfully.");
            } catch (err) {
                console.error("Failed to create spark:", err);
                throw new Error("Failed to create spark");
            }
        },

    };
