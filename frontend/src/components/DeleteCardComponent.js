import React from 'react'
import { Button } from 'react-bootstrap'
import { deleteSavedCard } from '../actions/cardActions'
import { useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'


function DeleteCardComponent({ userId, deleteCardNumber, runCardDeleteHandler, toggleRunCardDeleteHandler }) {

    const dispatch = useDispatch()

    // card delete confirmation
    const confirmDelete = (c_number) => {
        dispatch(deleteSavedCard(c_number))
        toggleRunCardDeleteHandler()
    }

    return (
        <div>
            {/* Modal Start*/}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Modal show={runCardDeleteHandler} onHide={toggleRunCardDeleteHandler} className='mt-5'>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Xác nhận xoá
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            Bạn có chắc chắn muốn xoá sản phẩm <b>{deleteCardNumber.productName}</b> khỏi giỏ hàng không?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete(deleteCardNumber.cartId)}>
                            Xác nhận xoá
                        </Button>
                        <Button variant="primary" onClick={toggleRunCardDeleteHandler}>
                            Huỷ
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}
        </div>
    )
}

export default DeleteCardComponent
