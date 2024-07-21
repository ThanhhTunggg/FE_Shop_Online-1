import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom";
import SearchBarForProducts from './SearchBarForProducts'


function NavBar() {

    let history = useHistory()
    const dispatch = useDispatch()

    const customTitleImage = './path/to/your/image.jpg';
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
        history.push("/login")
        window.location.reload()
    }

    const CustomTitle = ({ userName }) => {
        return (
            <span style={{ color: '#1d4670' }}>
                {userName}
            </span>
        );
    };

    return (
        <header style={{
            position: 'fixed',
            zIndex: 20,
            width: '100%',
            marginTop: 0,
            paddingTop: 0,
            top: 0
        }}>
            <Navbar bg="Light" variant="dark" expand="lg" collapseOnSelect style={{ backgroundColor: '#FF7D29' }}>
                <Container>
                    <LinkContainer to="/" style={{ width: '10%' }}>
                        <Navbar.Brand> <img src={`${process.env.PUBLIC_URL}/logoShopp.png`} alt="Logo" height={'40px'} /></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" style={{ width: '100%' }}>
                            <span className="" style={{ width: '95%' }}>
                                <SearchBarForProducts />
                            </span>
                        </Nav>

                        {/* login-logout condition here */}

                        {userInfo ?
                            <div style={{ width: '25%', display: 'flex', justifyContent: 'space-around' }}>
                                {userInfo && userInfo.userRole === 1 ?
                                    <LinkContainer to="/new-product/">
                                        <Nav.Link>{<CustomTitle userName={'Quản lý'} />}</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <LinkContainer to="/stripe-card-details/">
                                        <svg width={'1.7rem'} viewBox="0 0 576 512">
                                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                    </LinkContainer>
                                }
                                <NavDropdown className="navbar-nav text-capitalize" id='username'
                                    title={<CustomTitle userName={userInfo.userName} />}>
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item>Account Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-addresses/">
                                        <NavDropdown.Item>Address Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/stripe-card-details/">
                                        <NavDropdown.Item>Card Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item>All Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                            :

                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar
