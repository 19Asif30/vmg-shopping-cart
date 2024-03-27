import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  applyDiscount,
  selectCurrency,
  addToCart,
  removeFromCart,
} from "../reducers/cartSlice";
import { Modal, ModalBody, ModalFooter } from "reactstrap";

const ShoppingCart = () => {
  const { productList, discount, selectedCurrency, originalList } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleQuantityChange = (id, quantity) => {
    if (quantity === "") dispatch(updateQuantity({ id, quantity: 0 }));
    else dispatch(updateQuantity({ id, quantity }));
  };

  const handleDiscountChange = (event) => {
    const discountValue = parseFloat(event.target.value);
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      dispatch(applyDiscount(discountValue));
    }
  };

  const handleCurrencyChange = (event) => {
    dispatch(selectCurrency(event.target.value));
  };

  const handleRemoveProduct = (id) => {
    dispatch(removeFromCart(id));
  };

  const productToAdd = () => {
    return originalList.filter(
      (item) => productList.findIndex((product) => product.id === item.id) < 0
    );
  };

  const handleAddToCart = (id) => {
    // console.log('abcd')
    // console.log(selectedProduct)
    // if (selectedProduct) {
    dispatch(addToCart({ id: id, quantity: 1 }));
    // setShowModal(false);
    // }
  };

  const formatCurrency = (amount) => {
    let locale = selectedCurrency === "USD" ? "en-US" : "en-IN";
    return Number(amount).toLocaleString(locale);
  };

  const calculateTotalPrice = (type) => {
    let totalPrice = productList.reduce((total, product) => {
      const price =
        selectedCurrency === "USD" ? product.priceUSD : product.priceINR;
      return total + price * product.quantity;
    }, 0);
    if (discount > 0 && type === "after") {
      totalPrice -= (totalPrice * discount) / 100;
    }

    return formatCurrency(totalPrice);
  };

  const columns = [
    {
      name: "Name",
      minWidth: "80px",
    },
    {
      name: "Price",
      minWidth: "80px",
    },
    {
      name: "Quantity",
      minWidth: "200px",
    },
    {
      name: "Total",
      minWidth: "120px",
    },
    {
      name: "Action",
      minWidth: "150px",
    },
  ];

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowModal(true)}
        >
          Add Product
        </button>
        <div>
          <label className="me-2">Select Currency:</label>
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="form-select"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>
      <div className="cart-table">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              {columns.map((col) => (
                <th key={col.name} style={{ minWidth: col.minWidth }}>
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productList.length ? (
              productList.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    {selectedCurrency === "USD" ? "$" : "₹"}{" "}
                    {selectedCurrency === "USD"
                      ? formatCurrency(product.priceUSD)
                      : formatCurrency(product.priceINR)}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className="form-control"
                      />
                      <div className="d-flex gap-1 cart-action-btn">
                        <button
                          className="btn btn-success fw-bolder"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                        <button
                          className="btn btn-danger fw-bolder"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity > 1
                                ? product.quantity - 1
                                : product.quantity
                            )
                          }
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    {selectedCurrency === "USD" ? "$" : "₹"}{" "}
                    {selectedCurrency === "USD"
                      ? formatCurrency(product.priceUSD * product.quantity)
                      : formatCurrency(product.priceINR * product.quantity)}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No items in the cart</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="total-price">
        Total Price (Before Discount):{" "}
        <p className="d-inline-block">
          {selectedCurrency === "USD" ? "$" : "₹"} {calculateTotalPrice("before")}
        </p>
      </div>

      <div className="input-group mb-3 mt-3">
        <span className="input-group-text">Discount (%)</span>
        <input
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={handleDiscountChange}
          className="form-control discount-input"
        />
      </div>
      <div className="total-price">
        Total Price (After {`${discount}% of `} Discount):{" "}
        <p className="d-inline-block">
          {" "}
          {selectedCurrency === "USD" ? "$" : "₹"} {calculateTotalPrice("after")}
        </p>
      </div>

      <Modal
        scrollable
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered modal-md h-auto generate-pdf-dialog"
      >
        <ModalBody>
          <h2 className="text-center">Select Product to Add</h2>

          <table className="table table-striped table-bordered">
            <tbody>
              {productToAdd().length ? (
                <>
                  {productToAdd().map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          Add to the cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={2} className="text-center pt-1">
                    No items yet to be added into the cart
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default ShoppingCart;
