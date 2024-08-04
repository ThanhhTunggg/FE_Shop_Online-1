import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'
import axios from 'axios'
import { notification, Space } from 'antd';
import apiRoot from '../Config/ConfigApi'
import Product from '../components/Product'

function ProductDetailsPage({ history, match }) {

    const dispatch = useDispatch()

    const [amount, setAmount] = useState(1)

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer
    var productArray = []
    
    useEffect(() => {
        var product1 = {
            productId: product.productId,
            productName: product.productName,
            productPrice: product.productPrice,
            productSalePrice: product.productSalePrice,
            productCost: product.productCost,
            productStock: product.productStock,
            productDescription: product.productDescription,
            productDate: product.productDate,
            userId: product.userId,
            categoryId: product.categoryId,
            amount: amount
        }
        productArray.push(product1)
    }, [product, amount])

    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loadingg, errorr, products } = productsListReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        dispatch({
            type: CARD_CREATE_RESET
        })
    }, [dispatch, match])

    // product delete confirmation
    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id))
        handleClose()
    }

    // after product deletion
    if (productDeletionSuccess) {
        alert("Product successfully deleted.")
        history.push("/")
        dispatch({
            type: DELETE_PRODUCT_RESET
        })
    }

    const [api, contextHolder] = notification.useNotification();

    const AddCart = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const cardData = {
                id: userInfo.userId,
                productId: id,
                detailProductId: 1,
                amount: amount
            }
            // api call
            const { data } = await axios.post(
                `${apiRoot}Cart/AddCart`,
                cardData,
                config
            )
            api['success']({
                message: 'Thêm thành công',
                description:
                    'Sản phẩm đã được thêm thành công vào giỏ hàng',
            });
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const handleButtonAdd = (max) => {
        var value = (amount + 1) > max ? max : (amount + 1)
        setAmount(value);
    };

    const handleButtonSub = () => {
        var value = (amount - 1) < 1 ? 1 : (amount - 1)
        setAmount(value);
    };

    const handleInputChange = (event) => {
        setAmount(event.target.value);
    };

    return (
        <div>
            {contextHolder}
            {/* Modal Start*/}
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                            {" "}
                            Delete Confirmation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product <em>"{product.productName}"</em>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete()}>
                            Confirm Delete
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}

            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {error ? <Message variant='danger'>{error}</Message>
                :
                <div style={{
                    margin: '0 -1rem 1rem -1rem',
                    backgroundColor: 'white',
                    borderRadius: '.5rem',
                    padding: '1rem 0',
                    margin: '0 13%'
                }}>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <Card.Img variant="top" src={product.img1
                                    ? product.img1
                                    : 'https://img.freepik.com/free-psd/3d-realistic-background-podium-product-display_125755-833.jpg?t=st=1719133017~exp=1719136617~hmac=bb11c1b837eb9a791dddd696abe46b63c6e6200ec09cd4ceb3abc09d5d0ce510&w=826'} height="450" />

                                {/* Product edit and delete conditions */}

                                {userInfo && userInfo.userRole === 1 ?
                                    <span style={{ display: "flex" }}>
                                        <button
                                            className="mt-2 btn btn-primary button-focus-css"
                                            onClick={() => history.push(`/product-update/${product.productId}/`)}
                                            style={{ width: "100%" }}
                                        >Chỉnh sửa sản phẩm
                                        </button>

                                        <button
                                            className="ml-2 btn mt-2 btn-danger button-focus-css"
                                            style={{ width: "100%" }}
                                            onClick={() => handleShow()}
                                        >Xoá sản phẩm
                                        </button>
                                    </span>
                                    : ""}
                            </Col>

                            <Col sm>
                                <b>{product.productName}</b>
                                <hr />
                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    height: '50%',
                                    marginBottom: '2rem'
                                }}>
                                    <p className="ml-2"
                                        style={{
                                            fontSize: '24px',
                                            color: 'red',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            backgroundColor: '#fafafa',
                                            height: 'fit-content',
                                            padding: '.3rem 1rem',
                                            borderRadius: '.2rem',
                                        }}
                                    >{product.productSalePrice} vnd</p>
                                </span>

                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    alignItems: 'center'
                                }}>
                                    {userInfo && userInfo.userRole === 1 ?
                                        <div style={{
                                            width: '100%',
                                            display: 'flex',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '.2rem',
                                            padding: '1rem'
                                        }}>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>Số lượng còn lại</p>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem',
                                                fontWeight: 'bold'
                                            }}>{product.productStock}</p>
                                        </div>
                                        :
                                        <>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>Số lượng</p>
                                            <button style={{
                                                width: '30px',
                                                border: '1px solid lightgrey',
                                                borderRadius: '2px 0 0 2px',
                                                fontSize: '20px',
                                                justifyContent: 'center',
                                                backgroundColor: 'white'
                                            }} onClick={handleButtonSub}>-</button>
                                            <input disabled value={amount} onChange={handleInputChange}
                                                style={{
                                                    width: '50px',
                                                    outline: 'none',
                                                    border: '1px solid lightgrey',
                                                    backgroundColor: 'white',
                                                    textAlign: 'center',
                                                    fontSize: '20px'
                                                }}
                                            />
                                            <button style={{
                                                width: '30px',
                                                border: '1px solid lightgrey',
                                                borderRadius: '0 2px 2px 0',
                                                fontSize: '20px',
                                                justifyContent: 'center',
                                                backgroundColor: 'white'
                                            }} onClick={() => handleButtonAdd(product.productStock)}>+</button>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>{product.productStock}</p>
                                        </>
                                    }
                                </span>

                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    marginTop: '2rem'
                                }}>
                                    {!userInfo ?
                                        (
                                            product.productStock > 0 ?
                                                <div style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Link to={{
                                                        pathname: `${product.productId}/checkout`,
                                                        state: { productArray }
                                                    }}
                                                        style={{
                                                            width: '40%'
                                                        }}>
                                                        <button className="btn btn-warning ml-3"
                                                            style={{
                                                                backgroundColor: '#f05d40',
                                                                color: 'white',
                                                                border: '1px solid #f05d40',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            Mua ngay
                                                        </button>
                                                    </Link>

                                                    <Link
                                                        style={{
                                                            width: '50%'
                                                        }}>
                                                        <button className="btn btn-primary"
                                                            style={{
                                                                backgroundColor: 'RGBA(240, 93, 64, 0.2)',
                                                                border: '1px solid #f05d40',
                                                                width: '100%',
                                                                color: '#ee4d2d'
                                                            }}
                                                        >
                                                            Thêm vào giỏ hàng
                                                        </button>
                                                    </Link>
                                                </div>
                                                :
                                                <div className='alert alert-danger' role="alert"
                                                    style={{
                                                        width: '100%',
                                                        height: 'fit-content',
                                                        margin: 0,
                                                        padding: '.4rem',
                                                    }}
                                                >
                                                    Hết hàng!
                                                </div>
                                        )
                                        :
                                        (
                                            userInfo.userRole !== 1 &&
                                            (product.productStock > 0 ?
                                                <div style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Link to={{
                                                        pathname: `${product.productId}/checkout`,
                                                        state: { productArray }
                                                    }}
                                                        style={{
                                                            width: '40%'
                                                        }}>
                                                        <button className="btn btn-warning ml-3"
                                                            style={{
                                                                backgroundColor: '#f05d40',
                                                                color: 'white',
                                                                border: '1px solid #f05d40',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            Mua ngay
                                                        </button>
                                                    </Link>


                                                    <button className="btn btn-primary"
                                                        style={{
                                                            backgroundColor: 'RGBA(240, 93, 64, 0.2)',
                                                            border: '1px solid #f05d40',
                                                            width: '50%',
                                                            color: '#ee4d2d'
                                                        }}
                                                        onClick={() => {
                                                            AddCart(product.productId)
                                                        }}
                                                    >
                                                        Thêm vào giỏ hàng
                                                    </button>
                                                </div>
                                                :
                                                <div className='alert alert-danger' role="alert"
                                                    style={{
                                                        width: '100%',
                                                        height: 'fit-content',
                                                        margin: 0,
                                                        padding: '.4rem',
                                                    }}
                                                >
                                                    Hết hàng!
                                                </div>)
                                        )
                                    }
                                </span>
                            </Col>
                        </Row>
                    </Container>
                </div>
            }

            <div style={{
                backgroundColor: 'white',
                borderRadius: '.5rem',
                padding: '1rem',
                margin: '1rem 13%'
            }}>
                <h5>Mô tả về sản phẩm</h5>
                <p>{product.productDescription}</p>
            </div>

            {
                userInfo && userInfo.userRole === 1 ?
                    <></>
                    :
                    <>
                        <div style={{
                            margin: '0 13%'
                        }}>
                            <h5 style={{
                                backgroundColor: 'white',
                                marginBottom: '.5rem',
                                padding: '.4rem .5rem',
                                border: '1px solid orange',
                                borderBottom: '3px solid orange',
                                borderRadius: '.4rem'
                            }}>Các sản phẩm dành cho bạn</h5>
                        </div>
                        <div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                borderRadius: '.5rem',
                                margin: '0 13%'
                            }}>
                                {products.slice(0, 10).map((product, idx) => (
                                    <div style={{
                                        width: '15.1%',
                                        margin: '0 .7%',
                                    }}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
            }
        </div >

    )
}

export default ProductDetailsPage
