import axios from "axios";
import type { ApiResponse } from "../types/artwork";

const BASE_URL = "https://api.artic.edu/api/v1/artworks";

export const fetchArtworks = async (page: number): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`${BASE_URL}?page=${page}`);
  return res.data;
};
