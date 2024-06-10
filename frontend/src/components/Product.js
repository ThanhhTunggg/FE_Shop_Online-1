import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import React, { useState } from 'react'

function Product({ product }) {
    const [imageProduct, setImageProduct] = useState("https://product.hstatic.net/1000362139/product/blog_large_75e6f17c0d894a3191a1bc05ca645705.jpg")
    return (
        <div>
            <div className="mb-4 rounded"
                style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                    width: '100%',
                    border: '1px solid #ffd8bf',
                    borderRadius: '2rem'
                }}
            >
                <Card.Body>
                    <Link to={`/product/${product.productId}`} >
                        <Card.Img variant="top" src={imageProduct} height="170" />
                    </Link>
                    <Link to={`/product/${product.productId}`}>
                        <Card.Title as="h7" style={{borderTop:'1px solid grey', width: '100'}}>
                            <strong>{product.productName}</strong>
                        </Card.Title>
                    </Link>

                    <Card.Text as="p" style={{margin: 0, fontSize: '1.1rem', fontWeight: '500'}}>
                        {product.productSalePrice} vnd
                    </Card.Text>
                    
                    <Card.Text as="p" style={{textDecoration: 'line-through', color: 'red', margin: '0'}}>
                        {product.productPrice} vnd
                    </Card.Text>
                </Card.Body>
            </div>
        </div>
    )
}

export default Product
