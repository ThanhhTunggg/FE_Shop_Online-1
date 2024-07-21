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


const CardDetailsPage = () => {

    let history = useHistory()

    const dispatch = useDispatch()
    const [userId, setUserId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [deleteCardNumber, setDeleteCardNumber] = useState("")
    const [dataCart, setDataCart] = useState([])

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

    const getCart = async () => {
        try {
            const response = await axios.get(`${api}Cart/${userInfo.userId}`);
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
        alert("Card successfully deleted.")
        window.location.reload()

    }

    return (
        <div>
            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Card Information</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}

            {/* Modal Start*/}
            <h4>Giỏ hàng của bạn</h4>
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

            {dataCart ? dataCart.map((each, idx) => (
                <>
                    <div key={idx}>
                        <Link to={`/product/${each.productId}`} >
                            <Container>
                                <Row className="mr-6 mb-2 border border-dark">
                                    <Col className="p-3">
                                        Tên: {each.productName ? <span>
                                            {each.productName}
                                        </span>
                                            : "Not Set"}
                                    </Col>
                                    <Col className="p-3">
                                        Loại: {each.productName ? <span>
                                            {each.productName}
                                        </span>
                                            : "Not Set"}
                                    </Col>
                                    <Col className="p-3">
                                        Số lượng: <span>
                                            {each.amount}
                                        </span>
                                    </Col>
                                    <Col className="p-3">
                                        Giá: {each.productSalePrice ? <span>
                                            {each.productSalePrice} VND
                                        </span>
                                            : each.productPrice} VND
                                    </Col>
                                    <Col className="p-3">
                                        <Link to="#"
                                            onClick={() => {
                                                setDeleteCardNumber(each.userId)
                                                setUserId(each.userId)
                                                setRunCardDeleteHandler(!runCardDeleteHandler)
                                            }}
                                        >
                                            <svg fill="#000000" height="30px" width="30px" version="1.1" viewBox="0 0 315 315" enable-background="new 0 0 315 315">
                                                <g>
                                                    <path d="m256.774,23.942h-64.836v-6.465c0-9.636-7.744-17.477-17.263-17.477h-34.348c-9.521,0-17.266,7.841-17.266,17.478v6.465h-64.835c-9.619,0-17.445,7.76-17.445,17.297v11.429c0,7.168 4.42,13.33 10.698,15.951 1.989,39.623 13.5,231.193 14.018,239.801 0.222,3.696 3.284,6.58 6.987,6.58h170.033c3.703,0 6.766-2.884 6.987-6.58 0.518-8.607 12.028-200.178 14.018-239.801 6.278-2.621 10.698-8.783 10.698-15.951v-11.43c5.68434e-14-9.537-7.826-17.297-17.446-17.297zm-119.713-6.464c0-1.918 1.465-3.478 3.266-3.478h34.348c1.8,0 3.264,1.56 3.264,3.478v6.465h-40.877v-6.465zm-82.282,23.761c0-1.818 1.546-3.297 3.445-3.297h198.549c1.899,0 3.445,1.478 3.445,3.297v11.429c0,1.819-1.546,3.299-3.445,3.299h-198.548c-1.899,0-3.445-1.479-3.445-3.299v-11.429zm181.143,259.761h-156.848c-2.055-34.247-11.479-191.674-13.51-231.033h183.867c-2.031,39.359-11.454,196.786-13.509,231.033z" />
                                                    <path d="m157.5,95.125c-3.866,0-7,3.134-7,7v176.109c0,3.866 3.134,7 7,7 3.866,0 7-3.134 7-7v-176.109c0-3.866-3.134-7-7-7z" />
                                                    <path d="m110.2,102.04c-0.202-3.86-3.507-6.837-7.355-6.625-3.86,0.201-6.827,3.494-6.625,7.355l9.182,175.829c0.195,3.736 3.285,6.635 6.984,6.635 0.123,0 0.247-0.003 0.371-0.01 3.86-0.201 6.827-3.494 6.625-7.355l-9.182-175.829z" />
                                                    <path d="m212.155,95.415c-3.899-0.223-7.153,2.764-7.355,6.625l-9.184,175.829c-0.202,3.861 2.765,7.154 6.625,7.355 0.125,0.007 0.248,0.01 0.371,0.01 3.698,0 6.789-2.898 6.984-6.635l9.184-175.829c0.202-3.861-2.764-7.154-6.625-7.355z" />
                                                </g>
                                            </svg>
                                        </Link>
                                    </Col>

                                </Row>
                            </Container>
                        </Link>
                    </div>
                </>
            )) :
                <div>
                    <Message variant='info'>Card details not available.</Message>
                </div>
            }
            <span style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                <Link to={''}
                    onClick={() => {
                        setRunCardDeleteHandler(!runCardDeleteHandler)
                    }}
                >Thanh toán</Link>
            </span>
        </div>
    )
}

export default CardDetailsPage
