import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'


function ProductsListPage() {

    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer

    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        //dispatch(checkTokenValidation())
    }, [dispatch])

    const showNothingMessage = () => {
        return (
            <div>
                {!loading ? <Message variant='info'>Nothing to show</Message> : ""}
            </div>
        )
    }

    return (
        <div>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Products</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            <div>
                <Row>
                    {(products.filter((item) =>
                        item.productName.toLowerCase().includes(searchTerm !== "" ? searchTerm.split("=")[1] : "")
                    )).length === 0 ? showNothingMessage() : (products.filter((item) =>
                        item.productName.toLowerCase().includes(searchTerm !== "" ? searchTerm.split("=")[1] : "")
                    )).map((product, idx) => (
                        <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                            <div className="mx-2">
                                <Product product={product} />
                            </div>
                        </Col>
                    )
                    )}
                </Row>
            </div>
        </div>
    )
}

export default ProductsListPage
