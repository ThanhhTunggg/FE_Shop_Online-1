import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { calc } from 'antd/es/theme/internal'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'
import ProductSale from '../components/ProductSale'


function ProductsListPage() {

    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer
    const [categoryList, setcategoryList] = useState([])
    const [visibleCount, setVisibleCount] = useState(10);
    const [productsSale, setProductsSale] = useState([]);

    const displayedProducts = products.slice(0, visibleCount);
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const loadMore = () => {
        // Tăng số lượng sản phẩm hiển thị lên 10
        setVisibleCount(prevCount => prevCount + 10);
    };

    const images = [
        `${process.env.PUBLIC_URL}/anhsl1.jpg`,
        `${process.env.PUBLIC_URL}/anhsl2.jpg`,
        `${process.env.PUBLIC_URL}/anhsl3.jpg`,
        `${process.env.PUBLIC_URL}/anhsl6.jpg`,
        `${process.env.PUBLIC_URL}/anhsl7.jpg`,
        `${process.env.PUBLIC_URL}/anhsl8.jpg`,
    ];

    let footer = `${process.env.PUBLIC_URL}/footer.png`

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000); // 3000ms = 3s

        return () => clearInterval(interval); // Xóa interval khi component bị hủy
    }, [images.length]);


    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        LoadCategory()
        LoadProductSale()
    }, [dispatch])

    const LoadCategory = async () => {
        try {
            const { data } = await axios.get(
                `${apiRoot}Category`
            )
            console.log(data)
            setcategoryList(data)
        } catch {
            setcategoryList([])
        }
    }

    const LoadProductSale = async () => {
        try {
            const { data } = await axios.get(
                `${apiRoot}Product/GetProductsSale`
            )
            setProductsSale(data)
        } catch {
            setProductsSale([])
        }
    }


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
                            marginTop: '1rem',
                            // height: '30vh',
                            overflow: 'hidden',
                            padding: '1rem',
                            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
                        }}>
                            <div className="slideshow-container">
                                <img src={images[currentIndex]} width={'100%'} alt={`Slideshow ${currentIndex}`} className="slideshow-image" />
                            </div>
                        </div>
                    }
                    {userInfo && userInfo.userRole === 1 ?
                        <div style={{
                            margin: '0 13.5%',
                            marginTop: '6rem'
                        }}>
                            <>
                                <div style={{
                                    display: 'flex',
                                    marginBottom: '1rem',
                                    justifyContent: 'space-between'
                                }}>
                                    <Link to="/new-product/">
                                        <p style={{
                                            backgroundColor: '#4bbad8',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            width: 'fit-content',
                                            borderRadius: '.5rem',
                                            fontSize: '22px',
                                            marginRight: '1rem'
                                        }}>Thêm sản phẩm mới</p>
                                    </Link>
                                    <Link to="/sale/">
                                        <p style={{
                                            backgroundColor: '#e8696b',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            width: 'fit-content',
                                            borderRadius: '.5rem',
                                            fontSize: '22px',
                                            marginRight: '1rem'
                                        }}>Sản phẩm giảm giá</p>
                                    </Link>
                                    <Link to="/category/">
                                        <p style={{
                                            backgroundColor: '#e28743',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            width: 'fit-content',
                                            borderRadius: '.5rem',
                                            marginRight: '1rem',
                                            fontSize: '22px',
                                        }}>Quản lý danh mục sản phẩm</p>
                                    </Link>
                                    <Link to="/manage/">
                                        <p style={{
                                            backgroundColor: '#30d46f',
                                            color: 'white',
                                            padding: '2rem 2rem',
                                            borderRadius: '.5rem',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '22px',
                                            marginBottom: '1rem'
                                        }}>Quản lý doanh thu</p>
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
                        <div style={{
                            margin: '0 15%',
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '2px',
                                marginBottom: '1rem',
                                boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px'
                            }}>
                                <div style={{
                                    padding: '.4rem .5rem',
                                    height: '50px',
                                    alignContent: 'center'
                                }}>
                                    <p style={{
                                        padding: 0,
                                        margin: 0
                                    }}>DANH MỤC</p>
                                </div>
                                <div className="scroll-container" style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    height: '220px',
                                    overflow: "auto"
                                }}>
                                    {categoryList.map(x => (
                                        <div style={{
                                            height: '50%',
                                            borderTop: '.5px solid lightgrey',
                                            borderRight: '.5px solid lightgrey',
                                            borderLeft: '.5px solid lightgrey',
                                            borderBottom: '.5px solid lightgrey',
                                            width: '10%',
                                            textAlign: 'center',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            padding: '.1rem .5rem',
                                            backgroundColor: 'white',
                                            overflow: 'hidden'
                                        }}>
                                            <Link to={`categoryProduct/${x.categoryId}`}>
                                                <img width={'60%'} src={x.imageUrl !== null ? x.imageUrl : `${process.env.PUBLIC_URL}/bong.png`} />
                                                <p>{x.categoryName}</p>
                                            </Link>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <img src={`${process.env.PUBLIC_URL}/slideSale.png`} width={'100%'} style={{
                                marginBottom: '1rem'
                            }}/>
                            {productsSale.length > 0 &&
                                <>
                                    <h5 style={{
                                        backgroundColor: 'white',
                                        marginBottom: '1rem',
                                        padding: '.8rem .5rem',
                                        borderBottom: '5px solid orange',
                                        borderRadius: '2px',
                                        textAlign: 'center',
                                        color: '#fb6445',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px'
                                    }}>DEAL CHỚP NHOÁNG</h5>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                    }}>
                                        {productsSale.map((product, idx) => (
                                            <div key={idx} style={{
                                                width: 'calc(100%/7)',
                                                margin: '0 .5rem',
                                            }}>
                                                <ProductSale product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </>}
                            <h5 style={{
                                backgroundColor: 'white',
                                marginBottom: '1rem',
                                padding: '.8rem .5rem',
                                borderBottom: '5px solid orange',
                                borderRadius: '2px',
                                textAlign: 'center',
                                color: '#fb6445',
                                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px'
                            }}>GỢI Ý HÔM NAY</h5>
                        </div>
                    }

                    <div style={{
                        width: '75%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: '0 15%'
                    }}>
                        {products.length === 0 ? showNothingMessage() : displayedProducts.map((product, idx) => (
                            <div key={idx} style={{
                                width: 'calc(100%/7)',
                                margin: '0 .5rem',
                            }}>
                                <Product product={product} />
                            </div>
                        ))}
                    </div>
                    {visibleCount < products.length && (
                        <div style={{
                            width: '100%', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'
                        }}>
                            <button style={{
                                border: '1px solid #1a71ff',
                                borderRadius: '.5rem',
                                padding: '.5rem 4rem',
                                color: '#1a71ff'
                            }} onClick={loadMore}>Load More</button>
                        </div>
                    )}

                    <div>
                        <img src={footer} width={'100%'} />
                    </div>
                </div>}
        </div>
    )
}

export default ProductsListPage
