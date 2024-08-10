import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { calc } from 'antd/es/theme/internal'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'


function ProductCategoryPage({ match }) {

    let { key } = useParams();
    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error } = productsListReducer
    const [products, setProducts] = useState([]);
    const [categoryList, setcategoryList] = useState([])
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer
    const [sortOption, setSortOption] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');


    useEffect(() => {
        LoadProductSearch()
    }, [key])

    const LoadProductSearch = async () => {
        try {
            const { data } = await axios.get(
                `${apiRoot}Product/GetProductByCateId/${match.params.id}`
            )
            setProducts(data)
        } catch {
            setProducts([])
        }
    }

    const handlePriceFilter = () => {
        const filteredProducts = products.filter(product => {
            return product.productPrice >= parseFloat(minPrice) && product.productPrice <= parseFloat(maxPrice);
        });
        setProducts(filteredProducts);
    };

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


    useEffect(() => {
        sortProducts(sortOption);
    }, [sortOption]);

    const sortProducts = (option) => {
        let sortedProducts = [...products];
        switch (option) {
            case 'lowToHigh':
                sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
                break;
            case 'highToLow':
                sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
                break;
            case 'aToZ':
                sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            case 'zToA':
                sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
                break;
            default:
                break;
        }
        setProducts(sortedProducts);
    }; 

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex", justifyContent: 'center' }}>
                <h5>Đang tải sản phẩm</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            <div style={{
                marginTop: '6rem',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '75%',
                    margin: '1rem 15%',
                    backgroundColor: 'white',
                    padding: '1rem 1rem',
                    boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
                    borderRadius: '.2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        width: '22%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <p style={{ fontWeight: 'bold' }}>Bộ Lọc</p>
                        <select onChange={handleSortChange} style={{
                            appearance: 'none',
                            webkitAppearance: 'none',
                            mozAppearance: 'none',
                            padding: '5px',
                            border: '1px solid grey',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                        }}>
                            <option value="">Chọn tùy chọn sắp xếp</option>
                            <option value="lowToHigh">Giá từ thấp đến cao</option>
                            <option value="highToLow">Giá từ cao đến thấp</option>
                            <option value="aToZ">Từ A-Z</option>
                            <option value="zToA">Từ Z-A</option>
                        </select>
                    </div> 

                    <div style={{
                        display: 'flex',
                        width: '60%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <p style={{ fontWeight: 'bold' }}>Giá trong khoảng</p>
                        <input 
                        style={{
                            border: '1px solid grey',
                            borderRadius: '5px',
                            padding: '5px 10px'
                        }}
                            type="number"
                            placeholder="Từ"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <p>-</p>
                        <input 
                        style={{
                            border: '1px solid grey',
                            borderRadius: '5px',
                            padding: '5px 10px'
                        }}
                            type="number"
                            placeholder="Đến"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <button onClick={handlePriceFilter} style={{
                            border: 'none',
                            backgroundColor: '#fb6445',
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px'
                        }}>Áp dụng</button>
                    </div>
                </div>
                <div style={{
                    width: '75%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: '0 15%'
                }}>
                    {products.length > 0
                        ? (products.map(product => (
                            <div style={{
                                width: 'calc(100%/7)',
                                margin: '0 .8rem',
                            }}>
                                <Product product={product} />
                            </div>
                        )))
                        : (
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
                        )
                    }
                </div>
            </div>
        </div >
    )
}

export default ProductCategoryPage
