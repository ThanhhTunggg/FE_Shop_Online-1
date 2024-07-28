import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails } from '../actions/productActions'
import CreateCardComponent from '../components/CreateCardComponent'
import ChargeCardComponent from '../components/ChargeCardComponent'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { savedCardsList } from '../actions/cardActions'
import UserAddressComponent from '../components/UserAddressComponent'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CHARGE_CARD_RESET } from '../constants/index'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

const CheckoutPage = ({ match }) => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [addressSelected, setAddressSelected] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState(0)

    // set address id handler
    const handleAddressId = (id) => {
        if (id) {
            setAddressSelected(true)
        }
        setSelectedAddressId(id)
    }

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    // create card reducer
    const createCardReducer = useSelector(state => state.createCardReducer)
    const { error: cardCreationError, success, loading: cardCreationLoading } = createCardReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // saved cards list reducer
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { stripeCards } = savedCardsListReducer

    const location = useLocation();
    const [productLst, setProductLst] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (location.state && location.state.productArray) {
            setProductLst(location.state.productArray);
            const total = location.state.productArray.reduce((sum, product) => sum + (product.productSalePrice
                ? product.productSalePrice * product.amount
                : product.productPrice * product.amount), 0);
            setTotalPrice(total);
        }
    }, [location.state]);

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(savedCardsList())
            dispatch({
                type: CHARGE_CARD_RESET
            })
        }
    }, [dispatch, match, history, success, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            {cardCreationError ? <Message variant='danger'>{cardCreationError}</Message> : ""}
            {loading
                &&
                <span style={{ display: "flex" }}>
                    <h5>Getting Checkout Info</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span>}
            {!loading && cardCreationLoading ?
                <span style={{ display: "flex" }}>
                    <h5>Checking your card</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span> : ""}
            {error ? <Message variant='danger'>{error}</Message> :
                <Container>
                    <Row>
                        <Col xs={6}>
                            <h3>Thanh toán</h3>
                            <div style={{
                                border: '1px solid lightgrey',
                                borderRadius: '.3rem',
                                backgroundColor: 'white'
                            }}>
                                {productLst && productLst.length > 0
                                    ? productLst.map(product => (
                                        <Card className="mb-4">
                                            <Card.Body>
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <h5 className="card-title text-capitalize">
                                                                {product.productName}
                                                            </h5>
                                                            <span className="card-text text-success"> {product.price}</span>
                                                        </Col>
                                                        <Col>
                                                            <span className="card-text">Số lượng:  {product.amount}</span>
                                                        </Col>
                                                        <Col>
                                                            <h5 className="card-title" style={{
                                                                color: 'red'
                                                            }}>{product.productSalePrice
                                                                ? product.productSalePrice * product.amount
                                                                : product.productPrice * product.amount} vnd
                                                            </h5>
                                                            <span className="card-text text-success"> {product.price}</span>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </Card.Body>
                                        </Card>
                                    ))
                                    :
                                    <></>
                                }
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '.2rem',
                                    padding: '1rem .5rem',
                                    border: '1px solid lightgrey',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h4>Tổng tiền</h4>
                                    <h5 style={{
                                        color: '#0866ff'
                                    }}>{totalPrice} vnd</h5>

                                </div>
                            </div>

                            <div style={{ display: "flex", marginTop: '1rem' }}>
                                <h3>Địa chỉ nhận hàng</h3>
                                <Link
                                    className="ml-2 mt-2"
                                    to="/all-addresses/"
                                >
                                    Chỉnh sửa/Thêm địa chỉ
                                </Link>
                            </div>
                            <UserAddressComponent handleAddressId={handleAddressId} />
                        </Col>
                        <Col xs={6}>
                            <h3>
                                Phương thức thanh toán
                            </h3>
                            <p style={{
                                backgroundColor: 'white',
                                padding: '1rem .5rem',
                                borderRadius: '.2rem',
                                border: '1px solid lightgrey',
                                fontWeight: 'bold'
                            }}>Thanh toán khi nhận hàng</p>

                            <p style={{
                                backgroundColor: '#ff7d29',
                                padding: '1rem .5rem',
                                borderRadius: '.2rem',
                                border: '1px solid lightgrey',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'black',
                                cursor: 'pointer'
                            }}>Đặt hàng</p>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    )
}

export default CheckoutPage