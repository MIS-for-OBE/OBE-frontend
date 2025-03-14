import apiService from "@/services/apiService";

export const studentController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/student";

  return {
    getEnrollCourse: async (params: {
      year?: number;
      semester?: number;
      all?: boolean;
    }) => {
      return service.get(`${prefix}`, { ...params });
    },
  };
};
