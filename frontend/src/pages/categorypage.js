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


function CategoryPage() {

    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer
    const [categoryList, setcategoryList] = useState([])
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [file5, setFile5] = useState(null);

    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [url3, setUrl3] = useState(null);
    const [url4, setUrl4] = useState(null);
    const [url5, setUrl5] = useState(null);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null)


    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        LoadCategory()
        //dispatch(checkTokenValidation())
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

    const handleFileChange5 = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl5(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile5(postData);
            })
        }
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
            {!loading && (
                <div style={{
                    height: '70vh',
                    margin: '6rem 2rem',
                    backgroundColor: 'white',
                    padding: '.4rem',
                    borderRadius: '.8rem',
                    boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        width: '50%',
                        height: '100%',
                        overflowY: 'auto',

                    }}>
                        {categoryList.map(cate => (
                            <div className='cateAdmin' style={{
                                border: '1px solid grey',
                                width: '100%',
                                borderRadius: '.5rem',
                                padding: '.2rem .4rem',
                                marginBottom: '.3rem',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <p>{cate.categoryName}</p>
                                <button style={{
                                    border: 'none',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '.5rem'
                                }}>Sửa</button>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        width: '50%',
                        padding: '.5rem 1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                        }}>
                            <button style={{
                                border: 'none',
                                padding: '.5rem 2rem',
                                borderRadius: '.5rem',
                                backgroundColor: '#fb6445',
                                color: 'white'
                            }}>Thêm mới</button>
                            <button style={{
                                border: 'none',
                                padding: '.5rem 2rem',
                                borderRadius: '.5rem',
                                backgroundColor: '#fb6445',
                                color: 'white'
                            }}>Chỉnh sửa</button>
                        </div>
                        <div style={{
                            alignItems: 'center',
                            alignContent: 'center'
                        }}>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Form.Group controlId="imageUpload">
                                    <div className="file-upload-container">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange5}
                                            disabled={images.length >= 1}
                                        />
                                        {url5 ? (
                                            <img src={url5} alt="Uploaded" width={'100px'} className="uploaded-image" />
                                        ) : (
                                            <div className="file-upload-text">
                                                {image ? 'Tải ảnh' : 'Tải ảnh'}
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'left',
                                marginBottom: '3rem',
                                marginLeft: '3rem'
                            }}>
                                <b style={{
                                    marginRight: '2rem'
                                }}>Nhập tên danh mục</b>
                                <input type='text' placeholder='Nhập tên danh mục' style={{
                                    width: '50%',
                                    borderRadius: '.5rem',
                                    border:'1px solid grey',
                                    padding: '.3rem 1rem'
                                }}/>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                width: '50%',
                            }}>
                                <button style={{
                                    border: 'none',
                                    padding: '.5rem 2rem',
                                    borderRadius: '.5rem',
                                    backgroundColor: '#fb6445',
                                    color: 'white'
                                }}>Clear</button>
                                <button style={{
                                    border: 'none',
                                    padding: '.5rem 2rem',
                                    borderRadius: '.5rem',
                                    backgroundColor: '#fb6445',
                                    color: 'white'
                                }}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryPage
