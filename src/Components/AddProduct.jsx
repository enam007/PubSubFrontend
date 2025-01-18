import { useState, useEffect } from "react";
import axios, { axiosPrivate } from "../api/axios.js";

import {
  ADD_PRODUCT_URL,
  CATEGORY_LIST_URL,
  DELETE_IMAGE_URL,
  UPLOAD_IMAGE_URL,
} from "../constant.js";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [itemType, setItemType] = useState("sell");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_LIST_URL);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(
            `${CATEGORY_LIST_URL}?parentCategory=${selectedCategory}`
          ); // Fetch subcategories
          setSubCategories(response.data.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubCategories();
    } else {
      setSubCategories([]); // Clear subcategories if no category is selected
    }
  }, [selectedCategory]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (images.length >= 3) {
      alert("You can upload up to 3 images.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const response = await axiosPrivate.post(UPLOAD_IMAGE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImages((prev) => [
        ...prev,
        {
          url: response.data.data.url,
          publicId: response.data.data.publicId,
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    const { publicId } = imageToRemove;
    try {
      await axiosPrivate.delete(`${DELETE_IMAGE_URL}?publicId=${publicId}`);
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      const fileInput = document.getElementById("file-input");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      name,
      category: selectedSubCategory,
      price,
      description,
      stock,
      images: images.map((image) => image.url),
      itemType,
    };

    try {
      const response = await axiosPrivate.post(ADD_PRODUCT_URL, productData);
      console.log(response);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <label className="block mb-2 font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Subcategory Dropdown */}
        <label className="block mb-2 font-medium">Subcategory</label>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory._id}>
              {subCategory.name}
            </option>
          ))}
        </select>
        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {/* Price Input */}
        <label className="block mb-2 font-medium">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Stock Input */}
        <label className="block mb-2 font-medium">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Description Input */}
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          rows="4"
          required
        ></textarea>

        {/* Item Type Dropdown */}
        <label className="block mb-2 font-medium">Item Type</label>
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        {/* Image Upload */}
        <label className="block mb-2 font-medium">Upload Images (Max: 3)</label>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
          disabled={isUploading}
        />
        {isUploading && <div className="text-blue-500 mb-4">Uploading...</div>}
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              {/* Image Preview */}
              <img
                src={image.url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
