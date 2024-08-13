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
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'

const CheckoutPage = ({ match }) => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [addressSelected, setAddressSelected] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState(0)
    const [selectedAddress, setSelectedAddress] = useState('')
    const [address, setAddress] = useState('')
    const [items, setItems] = useState([])

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
    const [listAdd, setListAdd] = useState([])
    const [showChoose, setShowChoose] = useState(false)

    useEffect(() => {
        if (location.state && location.state.productArray) {
            setProductLst(location.state.productArray);
            console.log(location.state.productArray[0]);

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
            GetAddress()
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

    const GetAddress = async () => {
        const { data } = await axios.get(apiRoot + `Address/getByUsId/${userInfo.userId}`)

        setSelectedAddressId(data[0].addressID)
        setSelectedAddress(data[0].detail)
    }

    const HandleAddOrder = async () => {
        const newItems = productLst.map(x => ({
            cartId: x.cartId,
            productDetailName: x.productDetailName,
            TotalMoney: x.productPrice * x.amount,
            productName: x.productName,
            userId: x.userId,
            amount: x.amount,
            productId: x.productId,
            addressId: selectedAddressId,
            productDetailId: x.productDetailId,
            imgUrl: x.img1
        }));

        setItems(newItems);

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        const formData = {
            Items: newItems
        }

        console.log(formData);

        // api call
        const { data } = await axios.post(
            `${apiRoot}AddOrder`,
            formData,
            config
        );

        if (data === 'OK') {
            history.push("/success");
        }
    };

    const ChangeAddressLocate = () => {
        axios.get(`${apiRoot}Address/getByUsId/${userInfo.userId}`)
            .then(res => {
                setListAdd(res.data)
                setShowChoose(true)
            }).catch(err => {
                console.log('loi');
            })
    }

    const handleAdd = (item) => {
        setSelectedAddressId(item.addressID)
        setSelectedAddress(item.detail)
        setShowChoose(false)
    }

    return (
        <div>
            {showChoose && <div style={{
                position: 'fixed', zIndex: '80',
                backgroundColor: 'rgb(31, 31, 31, .5)',
                bottom: '0',
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    width: '50%',
                    minHeight: '20vh',
                    borderRadius: '.5rem',
                    padding: '1rem'
                }}>
                    {listAdd.map((ad, index) => (
                        <div key={index} style={{
                            padding: '1rem',
                            borderRadius: '.5rem',
                            display: 'flex'
                        }}>
                            <div style={{
                                width: '80%'
                            }}>{ad.detail}</div>
                            <button style={{
                                width: '20%',
                                border: '1px solid #1a71ff',
                                padding: '.5rem 3rem',
                                borderRadius: '.5rem',
                                backgroundColor: 'white',
                            }} onClick={() => handleAdd(ad)}>Chọn</button>
                        </div>
                    ))}
                    <button style={{
                        width: '20%',
                        border: 'none',
                        padding: '.5rem 3rem',
                        borderRadius: '.5rem',
                        backgroundColor: '#e6314b',
                        color: 'white'
                    }} onClick={() => setShowChoose(false)}>
                        Đóng
                    </button>
                </div>
            </div>}
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
                        <Col xs={12}>
                            <h3 style={{
                                marginTop: '2rem'
                            }}>Thanh toán</h3>
                            <div style={{
                                borderRadius: '.5rem',
                            }}>
                                {productLst && productLst.length > 0
                                    ? productLst.map(product => (
                                        <Card className="mb-4">
                                            <Card.Body>
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <img src={product.imgUrl} width={'50px'} />
                                                        </Col>
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

                            <div style={{ marginTop: '1rem' }}>
                                <h3>Địa chỉ nhận hàng</h3>
                                <p>{selectedAddress}</p>
                                <button style={{
                                    border: '1px solid #1a71ff',
                                    padding: '.5rem 3rem',
                                    borderRadius: '.5rem',
                                    backgroundColor: 'white',
                                }} onClick={() => ChangeAddressLocate()}>Thay đổi</button>
                            </div>
                            <UserAddressComponent handleAddressId={handleAddressId} />
                        </Col>
                        <Col xs={6}>
                            <h3 style={{
                                marginTop: '2rem'
                            }}>
                                Phương thức thanh toán
                            </h3>
                            <p style={{
                                backgroundColor: 'white',
                                padding: '1rem .5rem',
                                borderRadius: '.2rem',
                                border: '1px solid lightgrey',
                                fontWeight: 'bold',
                                marginBottom: '1rem'
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
                            }} onClick={() => HandleAddOrder()}>Đặt hàng</p>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    )
}

export default CheckoutPage