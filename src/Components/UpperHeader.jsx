import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import { axiosWithCredentials } from "../api/axios.js";
import { LOGOUT_URL } from "../constant.js";

function UpperHeader() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosWithCredentials.post(LOGOUT_URL);
      setAuth({});
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    auth?.accessToken ? setIsLogin(true) : setIsLogin(false);
  }, [auth]);

  return (
    <div className="z-10 flex justify-between border-b border-yellow-200 shadow-md bg-slate-100 sticky top-0">
      <Logo />
      <div className="m-2 p-2">
        <ul className="flex justify-around p-2 m-2">
          <li>
            {isLogin ? (
              <button
                className="p-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link className="p-2 m-2" to="/login">
                <button className="p-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Login
                </button>
              </Link>
            )}
          </li>
          <li>
            <Link className="p-2 m-2" to="/add-product">
              Add Product
            </Link>
          </li>
          <li>
            <Link className="p-2 m-2" to="/add-subcategory">
              Add Subcategory
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UpperHeader;
