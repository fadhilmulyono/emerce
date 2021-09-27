import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { connect } from "react-redux";
import { getCartData } from "../redux/actions/cart";

class ProductDetail extends React.Component {
    state = {
        productData: {},
        productNotFound: false,
        quantity: 1,
    };

    fetchProductData = () => {
        Axios.get(`${API_URL}/products`, {
        params: {
            id: this.props.match.params.productId,
            },
        })
        .then((result) => {
            if (result.data.length) {
                this.setState({ productData: result.data[0] });
            } else {
                this.setState({ productNotFound: true });
            }
        })
        .catch(() => {
            alert("404 Not Found");
        });
    };

    qtyBtnHandler = (action) => {
        if (action === "increment") {
            this.setState({ quantity: this.state.quantity + 1 });
        } else if (action === "decrement" && this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    };

    addToCartHandler = () => {
        Axios.get(`${API_URL}/carts`, {
        params: {
            userId: this.props.userGlobal.id,
            productId: this.state.productData.id,
            },
        })
        .then((result) => {
            if (result.data.length) {
                Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                quantity: result.data[0].quantity + this.state.quantity,
            })
                .then(() => {
                    alert("Add to cart successful!");
                    this.props.getCartData(this.props.userGlobal.id);
                })
                .catch(() => {
                    alert("Unable to add to cart, please try again.");
                });
            } else {
            //new product ID in current user
            Axios.post(`${API_URL}/carts`, {
                userId: this.props.userGlobal.id,
                productId: this.state.productData.id,
                price: this.state.productData.price,
                productName: this.state.productData.productName,
                productImage: this.state.productData.productImage,
                quantity: this.state.quantity,
            })
                .then(() => {
                    alert("Add to cart successful!");
                    this.props.getCartData(this.props.userGlobal.id);
                })
                .catch(() => {
                    alert("Unable to add to cart, please try again.");
                });
            }
        })
        .catch(() => {
            alert("404 Not Found");
        });
    };

    componentDidMount() {
        this.fetchProductData();
    }

    render() {
        return (
        <div className="container">
            {this.state.productNotFound ? (
            <div className="alert alert-warning mt-4">
                {" "}
                Product with ID: {this.props.match.params.productId} is not available.{" "}
            </div>
            ) : (
            <div className="row mt-3">
                <div className="col-6">
                    <img style={{ width: "100%" }} src={this.state.productData.productImage} alt=""/>
                </div>
                <div className="col-6 d-flex flex-column justify-content-center">
                <h4>{this.state.productData.productName}</h4>
                <h5>Rp. {this.state.productData.price}</h5>
                <p>{this.state.productData.description}</p>
                <div className="d-flex flex-row align-items-center">
                    <button onClick={() => this.qtyBtnHandler("decrement")} className="btn btn-primary mr-4" > - </button>
                    {this.state.quantity}
                    <button onClick={() => this.qtyBtnHandler("increment")} className="btn btn-primary mx-4" > + </button>
                </div>
                <button
                    onClick={this.addToCartHandler} className="btn btn-success mt-3" > Add to cart </button>
                </div>
            </div>
            )}
        </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);