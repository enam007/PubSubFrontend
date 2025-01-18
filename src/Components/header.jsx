import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { CATEGORY_LIST_URL } from "../constant";
function Header() {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    (async () => {
      console.log(axios.defaults.baseURL);
      const response = await axios.get(CATEGORY_LIST_URL);
      console.log(response);
      setCategory(response.data.data);
    })();
  }, []);

  return (
    <div className="bg-black-200 navbar w-full hidden xl:block bg-gray-100 border-b border-gray-300">
      <nav className="container mx-auto box-border px-xl">
        <ul className="m-2 p-2 flex w-full justify-between">
          {category.map((cat) => (
            <li
              className="ant-dropdown-trigger flex items-center flex-col relative category-list leading-6 bold-family py-lg text-lg gap-xs cursor-pointer hover:text-brand-600 text-gray-500"
              key={cat._id}
            >
              <Link className="p-2 m-2" to={`/category/${cat._id}`}>
                <div className="flex justify-center items-center gap-sm">
                  <span className="text-sm xl:text-base">{cat.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
