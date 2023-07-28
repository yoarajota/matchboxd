import axios, { AxiosResponse } from "axios";

export async function socketInit(room: string): Promise<AxiosResponse> {
  return await axios.get(process.env.API_URL + "/socket", { params: {} });
}
