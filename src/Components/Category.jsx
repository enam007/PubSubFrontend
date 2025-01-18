import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import { CATEGORY_LIST_URL } from "../constant";
import useRefreshToken from "../hooks/useRefreshToken.js";

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState([]);
  const refresh = useRefreshToken();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getSubCategory = async () => {
      try {
        const response = await axios.get(
          `${CATEGORY_LIST_URL}?parentCategory=${categoryId}`,
          {
            signal: controller.signal,
          }
        );
        setCategory(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getSubCategory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [categoryId]);
  console.log(categoryId);
  return (
    <>
      <h1>Category List {categoryId}</h1>
      {category?.length ? (
        <ul className="m-2 p-2 flex w-full justify-between">
          {category.map((cat) => (
            <li
              className="ant-dropdown-trigger flex items-center flex-col relative category-list leading-6 bold-family py-lg text-lg gap-xs cursor-pointer hover:text-brand-600 text-gray-500"
              key={cat._id}
            >
              <Link className="p-2 m-2" to={`/products/${cat._id}`}>
                <div className="flex justify-center items-center gap-sm">
                  <span className="text-sm xl:text-base">{cat.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Category</p>
      )}
      <button onClick={() => refresh()}>Refresh</button>
    </>
  );
};

export default Category;
