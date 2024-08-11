import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Form } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { calc } from 'antd/es/theme/internal'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'


function SaleProductPage() {
    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer
    const [prNotSaleList, setPrNotSaleList] = useState([])
    const [prSaleList, setPrSaleList] = useState([])
    const [show, setShow] = useState(false)
    const [selectProduct, setSelectProduct] = useState('');
    const [inputValue, setInputValue] = useState('');
    
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };


    useEffect(() => {
        fetchData1()
        fetchData2()
    }, [])

    const AddSalePrice = (id) => {
        setSelectProduct(id)
        setShow(true)
    }

    const HandleAddSale = () => {
        if (inputValue > 100 || inputValue < 1) {
            alert("Giá trị từ 1 - 100")
        } else {
            axios.post(apiRoot + `Product/UpdateSale/${selectProduct}/${inputValue}`)
                .then(res => {
                    fetchData1()
                    fetchData2()
                    setInputValue('')
                    setShow(false)
                }).catch(err => {
                    console.log(err);
                })
        }
    }

    const HandleRemoveSale = (id) => {
        axios.post(apiRoot + `Product/RemoveSale/${id}`)
            .then(res => {
                fetchData1()
                fetchData2()
            }).catch(err => {
                console.log(err);
            })
    }

    const fetchData1 = () => {
        axios.get(apiRoot + 'Product/GetProductsNotSale')
            .then(res => {
                setPrNotSaleList(res.data)
            }).catch(err => {
                console.log(err);
            })
    }
    const fetchData2 = () => {
        axios.get(apiRoot + 'Product/GetProductsSale')
            .then(res => {
                setPrSaleList(res.data)
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div>
            {show && <div style={{
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
                    <h5 style={{ textAlign: 'center', marginBottom: '1rem' }}>Thêm giảm giá</h5>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginBottom: '1rem'
                    }}>
                        <p>Nhập số phần trăm bạn muốn giảm</p>
                        <input style={{
                            width: '60%',
                            borderRadius: '.5rem',
                            padding: '.2rem 1rem'
                        }} type='number' placeholder='Nhập số phần trăm' value={inputValue}
                            onChange={handleInputChange} />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <button style={{
                            width: '20%',
                            border: 'none',
                            padding: '.5rem 3rem',
                            borderRadius: '.5rem',
                            backgroundColor: '#e6314b',
                            color: 'white'
                        }} onClick={() => setShow(false)}>
                            Đóng
                        </button>
                        <button style={{
                            width: '20%',
                            border: 'none',
                            padding: '.5rem 3rem',
                            borderRadius: '.5rem',
                            backgroundColor: '#43e2df',
                            marginLeft: '1rem',
                            color: 'white'
                        }} onClick={() => HandleAddSale()}>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex", justifyContent: 'center' }}>
                <h5>Đang tải sản phẩm</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {!loading && (
                <>
                    <h4 style={{
                        textAlign: 'center',
                        marginTop:'6rem'
                    }}>Quản lý giảm giá sản phẩm</h4>
                    <div style={{
                        height: '80vh',
                        margin: '1rem 2rem 2rem 2rem',
                        backgroundColor: 'white',
                        padding: '.4rem',
                        borderRadius: '.8rem',
                        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            width: '49%',
                            height: '100%',
                            overflowY: 'auto',

                        }}>
                            <h6 style={{
                                textAlign: 'center'
                            }}>Sản phẩm</h6>
                            {prNotSaleList.map(cate => (
                                <div className='cateAdmin' style={{
                                    border: '1px solid grey',
                                    width: '100%',
                                    borderRadius: '.5rem',
                                    padding: '.2rem .4rem',
                                    marginBottom: '.3rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <p style={{
                                        width: '40%'
                                    }}>{cate.productName}</p>
                                    <p style={{
                                        width: '20%'
                                    }}>{cate.productPrice} VND</p>
                                    <button style={{
                                        border: 'none',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '.5rem'
                                    }} onClick={() => AddSalePrice(cate.productId)}>Thêm</button>
                                </div>
                            ))}
                        </div>
                        <div style={{
                            width: '49%',
                            height: '100%',
                            overflowY: 'auto',

                        }}>
                            <h6 style={{
                                textAlign: 'center'
                            }}>Giảm giá</h6>
                            {prSaleList.map(cate => (
                                <div className='cateAdmin' style={{
                                    border: '1px solid grey',
                                    width: '100%',
                                    borderRadius: '.5rem',
                                    padding: '.2rem .4rem',
                                    marginBottom: '.3rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <p style={{
                                        width: '40%'
                                    }}>{cate.productName}</p>
                                    <p style={{
                                        width: '15%'
                                    }}>{cate.productSalePrice} vnd</p>
                                    <p style={{
                                        width: '15%'
                                    }}>{cate.salePercent} %</p>
                                    <p style={{
                                        width: '15%'
                                    }}>{cate.productSalePrice} vnd</p>
                                    <button style={{
                                        border: 'none',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '.5rem'
                                    }} onClick={() => HandleRemoveSale(cate.productId)}>Bỏ</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SaleProductPage
