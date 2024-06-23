import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, userUpdateDetails, checkTokenValidation, logout } from '../actions/userActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { UPDATE_USER_DETAILS_RESET } from '../constants'


function AccountUpdatePage() {

    let history = useHistory()
    const dispatch = useDispatch()


    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // user details reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    // user update details reducer
    const userDetailsUpdateReducer = useSelector(state => state.userDetailsUpdateReducer)
    const { success } = userDetailsUpdateReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
        dispatch(userDetails(userInfo.id))
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const updatedUsername = username === "" ? userAccDetails.username : username
        const updatedEmail = email === "" ? userAccDetails.email : email

        if (password !== confirmPassword) {
            alert("Passwords do not match")
        } else {
            const userData = {
                'username': updatedUsername,
                'email': updatedEmail,
                'password': password,
            }
            dispatch(userUpdateDetails(userData))
        }
    }

    // logout
    const logoutHandler = () => {
        history.push("/login")
        dispatch(logout()) // action        
    }

    if (success) {
        alert("Account successfully updated.")
        dispatch({
            type: UPDATE_USER_DETAILS_RESET
        })
        history.push("/account/")
        dispatch(userDetails(userInfo.id))
    }

    const renderData = () => {
        try {
            return (
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        height: '65vh',
                        justifyContent: 'center',
                        padding: '2rem',
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
                    }}>
                    <h3 style={{
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>Cập nhật thông tin tài khoản</h3>
                    <Row className='justify-content-md-center'>
                        <Col xs={12} md={6}>
                            {loading && <Spinner animation="border" />}
                            <Form onSubmit={onSubmit}>

                                <Form.Group controlId='username'>
                                    <Form.Label>
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        autoFocus={true}
                                        type="text"
                                        defaultValue={userAccDetails.username}
                                        placeholder="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label>
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="enter email"
                                        defaultValue={userAccDetails.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='password'>
                                    <Form.Label>
                                        Reset-Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="enter new password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='confirmPassword'>
                                    <Form.Label>
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="confirm new password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>

                                <Button type="submit" variant='success' class="btn btn-primary mr-3">Save Changes</Button>
                                <Link to={`/account`}>
                                    <button class="btn btn-danger pr-3 pl-3" type="button">
                                        Huỷ
                                    </button>
                                </Link>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )
        } catch (error) {
            return <Message variant='danger'>Something went wrong, go back to <Link
                onClick={logoutHandler} to={`/login`}
            > Login</Link> page.</Message>
        }
    }

    return renderData()
}

export default AccountUpdatePage
