import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Alert } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import { useHistory } from 'react-router'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CREATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message';
import axios from 'axios'
import api from '../Config/ConfigApi'


const ProductCreatePage = () => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [priceDiscount, setPriceDiscount] = useState("")
    const [stock, setStock] = useState("")
    const [image, setImage] = useState(null)
    const [category, setcategory] = useState(null)
    const [categoryList, setcategoryList] = useState('')

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // create product reducer
    const createProductReducer = useSelector(state => state.createProductReducer)
    const { product, success: productCreationSuccess, error: productCreationError } = createProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
    }, [dispatch, userInfo, history])

    useEffect(() => {
        LoadCategory()
    }, [])

    const LoadCategory = async () => {
        try {
            const { data } = await axios.get(
                `${api}Category`
            )
            console.log(data)
            setcategoryList(data)
        } catch {
            setcategoryList([])
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()

        let form_data = {
            "productName": name,
            "productPrice": price,
            "productSalePrice": priceDiscount,
            "productCost": price,
            "productStock": stock,
            "productDescription": description,
            "productDate": "2024-06-23T08:39:10.722Z",
            "updateAt": "2024-06-23T08:39:10.722Z",
            "deleteAt": "2024-06-23T08:39:10.722Z",
            "createAt": "2024-06-23T08:39:10.722Z",
            "userId": userInfo.userId,
            "categoryId": category
        }
        dispatch(createProduct(form_data))
    }

    if (productCreationSuccess) {
        alert("Product successfully created.")
        history.push(`/product/${product}/`)
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert('You can only select up to 5 images.');
            return;
        }
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '20px',
            height: '90vh',
            justifyContent: 'center',
            padding: '2rem',
            overflowY: 'auto',
            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
        }}>
            {/* {productCreationError && <Message variant='danger'>{productCreationError.image[0]}</Message>} */}
            <h3 style={{
                textAlign: 'center'
            }}>Thêm sản phẩm mới</h3>
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>
                            Tên sản phẩm
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        autoFocus={true}
                        type="text"
                        value={name}
                        placeholder="Nhập tên sản phẩm"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>
                        <b>
                            Mô tả sản phẩm
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        value={description}
                        placeholder="Nhập mô tả sản phẩm"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>
                        <b>
                            Giá
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={price}
                        placeholder="Nhập giá VND"
                        step="0.01"
                        onChange={(e) => setPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='priceDiscount'>
                    <Form.Label>
                        <b>
                            Giảm giá
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={priceDiscount}
                        placeholder="Nhập giá đã giảm VND"
                        step="0.01"
                        onChange={(e) => setPriceDiscount(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='priceDiscount'>
                    <Form.Label>
                        <b>
                            Số lượng hàng
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={stock}
                        placeholder="Nhập giá đã giảm VND"
                        step="1"
                        onChange={(e) => setStock(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="category">
                    <Form.Label>
                        <b>Loại mặt hàng</b>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        {categoryList.length > 0 ? (
                            categoryList.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.categoryName}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                <option value="">Select a category</option>
                            </option>
                        )}
                    </Form.Control>
                </Form.Group>

                {/* {category === '1' &&
                    (<Form.Group controlId='date'>
                        <Form.Label>
                            <b>
                                Hạn sử dụng
                            </b>
                        </Form.Label>
                        <Form.Control
                            required
                            type="Date"
                            value={price}
                            placeholder="Nhập hạn sử dụng"
                            onChange={(e) => setPriceDiscount(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>)
                } */}

                <Form.Group controlId="imageUpload">
                    <Form.Label>
                        <b>Upload Images</b>
                    </Form.Label>
                </Form.Group>
                <div style={{
                    display: 'flex',
                }}>
                    {images.map((image, index) => (
                        <div key={index} xs={6} md={4} lg={3} className="mb-3"
                            style={{
                                width: '18%',
                                marginRight: '.1rem',
                            }}>
                            <div className="image-preview">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: '100%', height: '100px', border: '1px solid black' }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveImage(index)}
                                    className="mt-2"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Form.Group controlId="imageUpload">
                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={images.length >= 5}
                    />
                    <Form.Text className="text-muted">
                        You can upload up to 5 images.
                    </Form.Text>
                </Form.Group>

                <button type="submit" class="btn btn-success mr-4"
                    style={{
                        borderRadius: '.5rem',
                        padding: '.5rem 2rem'
                    }}>
                    Thêm sản phẩm
                </button>
                <button type="submit" class="btn btn-danger"
                    style={{
                        borderRadius: '.5rem',
                        padding: '.5rem 2rem'
                    }}
                    onClick={() => history.push("/")}
                >
                    Huỷ
                </button>
            </Form >
        </div >
    )
}

export default ProductCreatePage
