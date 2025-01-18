import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    (async () => {
      console.log(document.cookie);
      console.log(axios.defaults.baseURL);
      const response = await axios.post(
        "/api/v1/product/list-product",
        { itemType: "buy" },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      setCategory(response.data.data);
    })();
  }, []);
  console.log(id);
  return (
    <>
      <h1>
        Category ID: {id} {category}
      </h1>
      ;
    </>
  );
}

export default ProductDetail;
