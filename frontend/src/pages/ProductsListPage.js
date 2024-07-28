import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'


function ProductsListPage() {

    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer


    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        //dispatch(checkTokenValidation())
    }, [dispatch])

    const showNothingMessage = () => {
        return (
            <div style={{
                width: '100%'
            }}>
                {!loading ?
                    <div style={{
                        height: '50vh',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <>
                            <img src={`${process.env.PUBLIC_URL}/404.png`} alt="Logo" height={'100px'} />
                            <p style={{
                                fontWeight: 'bold',
                                fontSize: '24px'
                            }}>Không tìm thấy sản phẩm</p>
                        </>
                    </div>
                    :
                    <></>
                }
            </div>
        )
    }

    return (
        <div>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex", justifyContent: 'center' }}>
                <h5>Đang tải sản phẩm</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {!loading &&
                <div>
                    {userInfo && userInfo.userRole === 1 ?
                        <></>
                        :
                        <div style={{
                            marginBottom: '1rem',
                            width: '100%',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '-1rem',
                            height: '20vh',
                            overflow: 'hidden'
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/banner.jpg`} alt="Logo" style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }} />
                        </div>
                    }
                    {userInfo && userInfo.userRole === 1 ?
                        <div style={{
                            margin: '0 13.5%',
                        }}>
                            <>
                                <Link to="/new-product/">
                                    <p style={{
                                        backgroundColor: '#30d46f',
                                        color: 'white',
                                        padding: '2rem 2rem',
                                        width: '100%',
                                        borderRadius: '.5rem',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '26px'
                                    }}>Quản lý doanh thu</p>
                                </Link>
                                <div style={{
                                    display: 'flex'
                                }}>
                                    <Link to="/new-product/">
                                        <p style={{
                                            backgroundColor: '#4bbad8',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            width: 'fit-content',
                                            borderRadius: '.5rem',
                                            marginRight: '1rem'
                                        }}>Thêm sản phẩm mới</p>
                                    </Link>
                                    <Link to="/new-product/">
                                        <p style={{
                                            backgroundColor: '#e28743',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            width: 'fit-content',
                                            borderRadius: '.5rem',
                                            marginRight: '1rem'
                                        }}>Quản lý danh mục sản phẩm</p>
                                    </Link>
                                </div>
                                <h5 style={{
                                    backgroundColor: 'white',
                                    marginBottom: '.5rem',
                                    padding: '.4rem .5rem',
                                    border: '1px solid orange',
                                    borderBottom: '3px solid orange',
                                    borderRadius: '.4rem'
                                }}>Quản lý sản phẩm</h5>
                            </>
                        </div>

                        :
                        <h5 style={{
                            margin: '0 13.5%',
                            backgroundColor: 'white',
                            marginBottom: '.5rem',
                            padding: '.4rem .5rem',
                            border: '1px solid orange',
                            borderBottom: '3px solid orange',
                            borderRadius: '.4rem'
                        }}>Gợi ý hôm nay</h5>
                    }

                    <div style={{
                        width: '75%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: '0 13%'
                    }}>
                        {(products.filter((item) =>
                            item.productName.toLowerCase().includes(searchTerm !== "" ? searchTerm.split("=")[1] : "")
                        )).length === 0 ? showNothingMessage() : (products.filter((item) =>
                            item.productName.toLowerCase().includes(searchTerm !== "" ? searchTerm.split("=")[1] : "")
                        )).map((product, idx) => (
                            <div style={{
                                width: '15.1%',
                                margin: '0 .7%',
                            }}>
                                <Product product={product} />
                            </div>
                        )
                        )}
                    </div>
                </div>}
        </div>
    )
}

export default ProductsListPage
