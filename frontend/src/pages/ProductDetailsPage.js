import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'


function ProductDetailsPage({ history, match }) {

    const dispatch = useDispatch()

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

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

    return (
        <div>

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
                    padding: '1rem 0'
                }}>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <Card.Img variant="top" src={product.image
                                    ? product.image
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
                                    height: '71%',
                                    marginBottom: '2rem'
                                }}>
                                    Price:<span className="text-success ml-2">{product.productSalePrice} VND</span>
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
                                                    <Link to={`${product.productId}/checkout/`}
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

                                                    <Link to={`${product.productId}/checkout/`}
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
                                                    <Link to={`${product.productId}/checkout/`}
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

                                                    <Link to={`${product.productId}/checkout/`}
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
                margin: '0 -1rem 2rem -1rem',
                backgroundColor: 'white',
                borderRadius: '.5rem',
                padding: '1rem'
            }}>
                <h5>Mô tả về sản phẩm</h5>
                <p>{product.productDescription}</p>
            </div>

            <div>
                <h5>Các sản phẩm khác dành cho bạn</h5>
            </div>
        </div>

    )
}

export default ProductDetailsPage
