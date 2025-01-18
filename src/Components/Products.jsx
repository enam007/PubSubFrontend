import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { PRODUCT_LIST_URL } from "../constant";

const Products = () => {
  const { subCategoryID } = useParams();
  const [products, setProducts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getSubCategory = async () => {
      try {
        const response = await axiosPrivate.post(
          PRODUCT_LIST_URL,
          { category: subCategoryID },
          {
            signal: controller.signal,
          }
        );
        setProducts(response.data.data.products);
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          console.log("Request canceled:", error.message);
          return;
        }
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getSubCategory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [subCategoryID]);
  return (
    <div>
      Products {subCategoryID}
      {products?.length ? (
        <ul className="m-2 p-2 flex w-full justify-between">
          {products.map((cat) => (
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
    </div>
  );
};

export default Products;
