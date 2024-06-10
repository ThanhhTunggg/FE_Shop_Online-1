import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { register } from '../actions/userActions'
import Message from '../components/Message'

function RegisterPage({ history, variant }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    const dispatch = useDispatch()

    // reducer
    const userRegisterReducer = useSelector(state => state.userRegisterReducer)
    const { error, userInfo } = userRegisterReducer

    useEffect(() => {
        if (userInfo) {
            history.push('/') // homepage
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!')
        } else {
            dispatch(register(username, email, password))
        }
    }

    return (
        <div>
            <Row className='justify-content-md-center' style={{
                backgroundColor: 'white',
                borderRadius: '2rem',
                height: '85vh',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
            }}>
                <Col xs={12} md={6}>
                    <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>Đăng ký để tiếp tục</h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Tên đăng nhập
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                required
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Email
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                required
                                type="email"
                                placeholder="Nhập Email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Mật khẩu
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                required
                                type="password"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='passwordConfirm'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Nhập lại mật khẩu
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                required
                                type="password"
                                placeholder="Nhập lại mật khẩu của bạn"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Button style={{ width: '100%', borderRadius: '1rem', height: '3rem' }} type="submit" variant='primary'>Sign Up</Button>
                    </Form>

                    <Row className="py-3">
                        <Col>
                            Bạn đã có tài khoản?
                            <Link
                                to={`/login`}
                            > Đăng nhập</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>

    )
}

export default RegisterPage