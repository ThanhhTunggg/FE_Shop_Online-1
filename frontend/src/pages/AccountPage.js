import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
//import { UPDATE_USER_ACCOUNT_RESET } from '../constants'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


function AccountPage() {


    let history = useHistory()
    const dispatch = useDispatch()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // user details reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            try {
                dispatch(checkTokenValidation())
                dispatch(userDetails(userInfo.userId))
            } catch (error) {
                history.push("/")
            }
        }
    }, [history, userInfo, dispatch])

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const renderData = () => {
        try {
            return (
                <div style={{
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
                    }}>Thông tin tài khoản</h3>
                    {loading && <span style={{ display: "flex" }}><h5>Getting User Information</h5><span className="ml-2"><Spinner animation="border" /></span></span>}
                    <Container>
                        <Row className="mr-6 mb-3"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                                borderRadius: '.5rem'
                            }}>
                            <Col xs={2} className="p-3 text-white"
                                style={{
                                    borderRadius: '.5rem 0 0 .5rem',
                                    backgroundColor: '#b82d17'
                                }}>Name:</Col>
                            <Col className="p-3"
                                style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#250905',
                                    borderRadius: '0 .5rem .5rem 0',
                                }}
                            >{userAccDetails.userName}</Col>
                        </Row>
                        <Row className="mb-3"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                                borderRadius: '.5rem'
                            }}
                        >
                            <Col xs={2} className="p-3 text-white"
                                style={{
                                    borderRadius: '.5rem 0 0 .5rem',
                                    backgroundColor: '#b82d17'
                                }}
                            >Email:</Col>
                            <Col className="p-3"
                                style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#250905',
                                    borderRadius: '0 .5rem .5rem 0'
                                }}
                            >{userAccDetails.userEmail}</Col>
                        </Row>
                        <Row className="mb-3"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                                borderRadius: '.5rem'
                            }}
                        >
                            <Col xs={2} className="p-3 text-white"
                                style={{
                                    borderRadius: '.5rem 0 0 .5rem',
                                    backgroundColor: '#b82d17'
                                }}
                            >Admin Privileges:</Col>
                            <Col className="p-3"
                                style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#250905',
                                    borderRadius: '0 .5rem .5rem 0'
                                }}
                            >{userAccDetails.userRole === 1 ? "Yes" : "No"}</Col>
                        </Row>
                        <Row className="mb-3"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                                borderRadius: '.5rem'
                            }}
                        >
                            <Col xs={2} className="p-3 text-white"
                                style={{
                                    borderRadius: '.5rem 0 0 .5rem',
                                    backgroundColor: '#b82d17'
                                }}
                            >Phone Number:</Col>
                            <Col className="p-3"
                                style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#250905',
                                    borderRadius: '0 .5rem .5rem 0'
                                }}
                            >{userAccDetails.userPhone}</Col>
                        </Row>
                        <Row className="mb-3"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                                borderRadius: '.5rem'
                            }}
                        >
                            <Col xs={2} className="p-3 text-white"
                                style={{
                                    borderRadius: '.5rem 0 0 .5rem',
                                    backgroundColor: '#b82d17'
                                }}
                            >Points:</Col>
                            <Col className="p-3"
                                style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#250905',
                                    borderRadius: '0 .5rem .5rem 0'
                                }}
                            >{userAccDetails.userPoint}</Col>
                        </Row>
                    </Container>
                    <div style={{ width: '100%', marginTop: '3rem' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                            marginTop: '1rem'
                        }}>
                            <Link to={`/account/update`}>
                                <button
                                    style={{ width: '100%', padding: '.8rem 3rem', borderRadius: '1rem' }}
                                    class="btn btn-primary">
                                    Cập nhật tài khoản
                                </button>
                            </Link>

                            <Link to={`/account/delete/`}>
                                <button
                                    style={{ width: '100%', padding: '.8rem 3rem', borderRadius: '1rem' }}
                                    class="btn btn-danger">
                                    Xoá tài khoản
                                </button>
                            </Link>
                        </div>
                    </div>
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

export default AccountPage
