import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savedCardsList } from '../actions/cardActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import Message from "../components/Message"
import DeleteCardComponent from '../components/DeleteCardComponent'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import api from '../Config/ConfigApi'
import apiRoot from '../Config/ConfigApi'


const CardDetailsPage = () => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [userId, setUserId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [deleteCardNumber, setDeleteCardNumber] = useState("")
    const [dataCart, setDataCart] = useState([])
    const [totalMoney, setTotalMoney] = useState(0)
    const [totalProdct, setTotalProdct] = useState(0)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productArray, setProductArray] = useState([])

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // saved cards list reducer
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { stripeCards, loading } = savedCardsListReducer

    // saved cards list reducer
    const deleteSavedCardReducer = useSelector(state => state.deleteSavedCardReducer)
    const { success } = deleteSavedCardReducer

    const handleCheckboxChange = (product, isChecked) => {
        if (isChecked) {
            setSelectedProducts([...selectedProducts, product]);
            var money = product.productSalePrice ? product.productSalePrice * product.amount : product.productPrice * product.amount
            setTotalMoney(totalMoney + money)
            setTotalProdct(totalProdct + 1)
            setProductArray(prevProductArray => [...prevProductArray, product]);
        } else {
            setSelectedProducts(selectedProducts.filter(p => p.productId !== product.productId));
            var money = product.productSalePrice ? product.productSalePrice * product.amount : product.productPrice * product.amount
            setTotalMoney(totalMoney - money)
            setTotalProdct(totalProdct - 1)
            setProductArray(prevProductArray => prevProductArray.filter(p => p.productId !== product.productId));
        }
    };

    const getCart = async () => {
        try {
            const response = await axios.get(`${apiRoot}Cart/${userInfo.userId}`);
            setDataCart(response.data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    // toggle run card delete handler
    const toggleRunCardDeleteHandler = () => {
        setRunCardDeleteHandler(!runCardDeleteHandler)
    }

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            getCart()
        }
    }, [dispatch])

    useEffect(() => {
        console.log(dataCart)
    }, [dataCart])

    if (!userInfo) {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    // card deletion message
    if (success) {
        window.location.reload()

    }

    return (
        <div style={{
            padding: '0 0 5.5rem 0',
            margin: '0 13%'
        }}>
            <div style={{ width: '100%' }}>
                {loading && <span style={{ display: "flex" }}>
                    <h5>Đang tải dữ liệu...</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span>}

                {/* Modal Start*/}
                <h4 style={{
                    marginTop: '6rem'
                }}>Giỏ hàng của bạn</h4>
                <div>
                    <>
                        <DeleteCardComponent
                            userId={userId}
                            deleteCardNumber={deleteCardNumber}
                            runCardDeleteHandler={runCardDeleteHandler}
                            toggleRunCardDeleteHandler={toggleRunCardDeleteHandler}
                        />
                    </>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    marginBottom: '.4rem',
                    padding: '.6rem 0',
                    borderRadius: '.2rem'
                }}>
                    <div style={{
                        width: '10%',
                        textAlign: 'center'
                    }}>Chọn</div>
                    <div style={{
                        width: '35%',
                        textAlign: 'left'
                    }}>Sản phẩm</div>
                    <div style={{
                        width: '20%',
                        textAlign: 'left'
                    }}>Loại</div>
                    <div style={{
                        width: '10%',
                        textAlign: 'left'
                    }}>Số lượng</div>
                    <div style={{
                        width: '20%',
                        textAlign: 'left'
                    }}>Giá</div>
                    <div style={{
                        width: '6%',
                        textAlign: 'left'
                    }}></div>
                </div>

                {dataCart ? dataCart.map((each, idx) => (
                    <>
                        <div key={idx} style={{
                            backgroundColor: 'white',
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '.9rem',
                            padding: '.2rem',
                            borderRadius: '.2rem'
                        }}>
                            <div style={{
                                width: '10%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <input type='checkbox'
                                    onChange={(e) => handleCheckboxChange(each, e.target.checked)}
                                />
                            </div>
                            <Link to={`/product/${each.productId}`} style={{
                                width: '90%'
                            }}>
                                <div style={{
                                    color: 'black',
                                    width: '100%'
                                }}>
                                    <div className="mr-6 mb-2" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                    }}>
                                        <div>
                                            <img src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly334dw9e3ff7b'
                                                width={'60rem'} height={'60rem'}
                                            />
                                        </div>
                                        <div style={{
                                            width: '25%',
                                            flexWrap: 'wrap',
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            overflow: 'hidden',
                                        }}>
                                            {each.productName ? <p style={{
                                                margin: 0,
                                                padding: 0,
                                                width: '80%'
                                            }}>
                                                {each.productName}
                                            </p>
                                                : "Not Set"}
                                        </div>
                                        <div style={{
                                            width: '20%',
                                            flexWrap: 'wrap',
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            backgroundColor: 'white'
                                        }}>
                                            Loại: {each.productName ? <p style={{
                                                margin: 0,
                                                padding: 0
                                            }}>
                                                {each.productName}
                                            </p>
                                                : "Not Set"}
                                        </div>
                                        <div style={{
                                            width: '10%',
                                            flexWrap: 'wrap',
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                        }}>
                                            <input disabled value={each.amount}
                                                style={{
                                                    width: '90px',
                                                    outline: 'none',
                                                    border: '1px solid lightgrey',
                                                    backgroundColor: 'white',
                                                    textAlign: 'center',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                        <div style={{
                                            width: '20%',
                                            flexWrap: 'wrap',
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            backgroundColor: 'white'
                                        }}>
                                            {each.productSalePrice ? (<p style={{
                                                margin: 0,
                                                padding: 0,
                                                color: 'red'
                                            }}>
                                                {each.productSalePrice * each.amount} vnd
                                            </p>)
                                                : (<p style={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: 'red'
                                                }}>{each.productPrice * each.amount} vnd</p>)}
                                        </div>
                                        <div className="p-3">
                                            <Link to="#"
                                                onClick={() => {
                                                    setDeleteCardNumber(each)
                                                    setUserId(each.userId)
                                                    setRunCardDeleteHandler(!runCardDeleteHandler)
                                                }}
                                            >
                                                <p style={{
                                                    margin: 0,
                                                    padding: 0
                                                }}>Xoá</p>
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </Link>
                        </div>
                    </>
                )) :
                    <div>
                        <Message variant='info'>Chưa có sản phẩm nào trong giỏ hàng</Message>
                    </div>
                }
            </div>
            <div style={{
                position: 'fixed',
                alignItems: 'center',
                bottom: 0,
                backgroundColor: 'white',
                height: '5rem',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '0 0 0 35rem',
                boxShadow: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px'
            }}>
                <div style={{
                    width: '20%'
                }}>
                    Tổng số sản phẩm: {totalProdct}
                </div>
                <div style={{
                    width: '30%'
                }}>
                    Tổng tiền: {totalMoney} vnd
                </div>
                <div style={{
                    width: '30%'
                }}>
                    <Link to={{
                        pathname: `checkout`,
                        state: { productArray }
                    }}
                        onClick={() => {
                            setRunCardDeleteHandler(!runCardDeleteHandler)
                        }}
                        style={{
                            backgroundColor: 'orange',
                            color: 'white',
                            padding: '.8rem 2rem',
                            borderRadius: '.4rem'
                        }}
                    >Thanh toán</Link>
                </div>
            </div>
        </div>
    )
}

export default CardDetailsPage
