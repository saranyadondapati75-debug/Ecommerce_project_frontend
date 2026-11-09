import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { demoProducts } from "../data/demoProducts";

function AdminProducts() {

  const [products, setProducts] = useState(demoProducts);
  const [errorMessage, setErrorMessage] = useState("");
  const [usingDemoProducts, setUsingDemoProducts] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
  const res = await axios.get(
    "https://ecommerce-flask.duckdns.org/admin/allitems",
    {
      withCredentials: true,
      timeout: 8000
    }
  );

  console.log("API Response:", res.data);

  if (res.data.status !== "success") {
    throw new Error(res.data.message || "Unable to fetch products");
  }

  if (!Array.isArray(res.data.products)) {
    throw new Error("Products data is not an array");
  }

  return res.data.products;
}, []);
  function retryGetProducts() {
    setErrorMessage("");
    fetchProducts().then((data) => {
      setProducts(data);
      setUsingDemoProducts(false);
    }).catch((error) => {
      console.log(error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setProducts(demoProducts);
        setUsingDemoProducts(true);
      }
    });
  }

  async function deleteProduct(id) {
    try {

      const res = await axios.delete(
        `https://ecommerce-flask.duckdns.org/admin/deleteitem/${id}`,
        {
          withCredentials: true
        }
      );

      alert(res.data.message);

      fetchProducts().then(setProducts);

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  useEffect(() => {
    let active = true;
    fetchProducts().then((data) => {
      if (active) {
        setProducts(data);
        setErrorMessage("");
        setUsingDemoProducts(false);
      }
    }).catch((error) => {
      console.log(error.response?.data || error.message);
      if (active) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setProducts(demoProducts);
          setUsingDemoProducts(true);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [fetchProducts, navigate]);

  return (
    <>
      

      {/* CUSTOM STYLE */}
      <style>{`
        .products-page{
          min-height: 100vh;
          background: #f1f5f9;
          padding: 40px 20px;
        }

        .page-title{
          text-align: center;
          font-size: 42px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 40px;
        }

        .product-card{
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          transition: 0.3s;
          height: 100%;
        }

        .product-card:hover{
          transform: translateY(-8px);
        }

        .product-img{
          width: 100%;
          height: 250px;
          object-fit: cover;
        }

        .product-body{
          padding: 20px;
        }

        .product-title{
          font-size: 24px;
          font-weight: bold;
          color: #0f172a;
        }

        .product-desc{
          color: #64748b;
          margin: 15px 0;
        }

        .product-price{
          color: #38bdf8;
          font-size: 24px;
          font-weight: bold;
        }

        .btn-custom{
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          color: white;
          text-decoration: none;
          transition: 0.3s;
          font-weight: 500;
        }

        .view-btn{
          background: #0ea5e9;
        }

        .edit-btn{
          background: #22c55e;
        }

        .delete-btn{
          background: #ef4444;
        }

        .btn-custom:hover{
          opacity: 0.9;
          color: white;
        }

        @media(max-width:768px){
          .page-title{
            font-size: 32px;
          }

          .product-img{
            height: 220px;
          }
        }
      `}</style>

      <div className="products-page">

        <h1 className="page-title">
          Admin Products
        </h1>

        <div className="container">
          <div className="row g-4">

            {(errorMessage || usingDemoProducts) && (
              <div className="alert alert-warning text-center" role="alert">
                {usingDemoProducts
                  ? "The product server is unavailable. Showing sample products; admin actions are disabled."
                  : errorMessage}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={retryGetProducts}
                >
                  Try again
                </button>
              </div>
            )}

            {!errorMessage && products.length === 0 && (
              <p className="text-center">No products have been added yet.</p>
            )}

            {!errorMessage && products.map((item) => (
              
              <div
                className="col-12 col-sm-6 col-lg-4"
                key={item.itemid}
              >
                <div className="product-card">

<img
  src={item.image}
  alt={item.itemname}
  className="product-img"
/>
                  <div className="product-body">

                    <h2 className="product-title">
                      {item.itemname}
                    </h2>

                    <p className="product-desc">
                      {item.item_desc}
                    </p>

                    <h3 className="product-price">
                      ₹{item.price}
                    </h3>

                    <div className="d-flex gap-2 mt-4 flex-wrap">

                      {!item.isDemo && (
                        <>
                          <Link
                            to={`/single/${item.itemid}`}
                            className="btn-custom view-btn"
                          >
                            View
                          </Link>

                          <Link
                            to={`/edit/${item.itemid}`}
                            className="btn-custom edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn-custom delete-btn"
                            onClick={() => deleteProduct(item.itemid)}
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </>
  );
}

export default AdminProducts;