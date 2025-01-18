import { axiosWithCredentials } from "../api/axios.js";
import { REFRESH_TOKEN_URL } from "../constant.js";
import useAuth from "./useAuth.js";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosWithCredentials.post(REFRESH_TOKEN_URL, {});
    setAuth((prev) => {
      console.log(response.data);
      return { ...prev, accessToken: response.data.data.accessToken };
    });
    return response.data.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
