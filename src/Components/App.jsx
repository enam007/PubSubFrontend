import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import Category from "./Category.jsx";
import ProductDetail from "./ProductDetail.jsx";
import Products from "./Products.jsx";
import AddProduct from "./AddProduct.jsx";
import AddSubCategory from "./AddSubCategory.jsx";
import Missing from "./Missing.jsx";
import RequireAuth from "./RequireAuth.jsx";
import PersistLogin from "./PersistLogin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="category/:categoryId" element={<Category />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="products/:subCategoryID" element={<Products />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="add-subcategory" element={<AddSubCategory />} />
            <Route path="detail/:productID" element={<ProductDetail />} />
          </Route>
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
