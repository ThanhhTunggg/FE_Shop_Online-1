import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
//import { UPDATE_USER_ACCOUNT_RESET } from '../constants'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'
import { Button, Modal, notification } from 'antd'


function AccountPage() {


    let history = useHistory()
    const dispatch = useDispatch()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer
    const [checkOption, setCheckOption] = useState(1)
    const [city, setCity] = useState([])
    const [district, setDistrict] = useState([])
    const [ward, setWard] = useState([])

    const [selectedCity, setSelectedCity] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState()
    const [selectedWard, setSelectedWard] = useState()
    const [cityInput, setCityInput] = useState('')
    const [listAdd, setListAdd] = useState([])
    const [selectedAdd, setSelectedAdd] = useState('')
    const [showActiveBtn, setShowActiveBtn] = useState(true)
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [reNewPass, setReNewPass] = useState('')

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

    useEffect(() => {
        if (checkOption === 4) {
            getCity()
        }
    }, [checkOption])

    const HandleChangePass = async () => {
        if (newPass === reNewPass) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }

                const request = {
                    userId: userInfo.userId,
                    oldPass: oldPass,
                    newPass: newPass,
                    reNewPass: reNewPass
                }
                // api call
                await axios.post(
                    `${apiRoot}User/ChangePass`,
                    request,
                    config
                ).then(res => {
                    window.location.reload()
                })
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        }
    }

    const handleAddress = (nu) => {
        setCheckOption(nu)
        setCityInput(null)
        axios.get(`${apiRoot}Address/getByUsId/${userInfo.userId}`)
            .then(res => {
                setListAdd(res.data)
            }).catch(err => {
                console.log('loi');
            })
    }

    const handleCityInputChange = (e) => {
        setCityInput(e.target.value); // Cập nhật giá trị input của thành phố
    };

    const getCity = async () => {
        try {
            const response = await axios.get(`${apiRoot}Address/getCity`);
            setCity(response.data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const getDistrict = async (id) => {
        try {
            const response = await axios.get(`${apiRoot}Address/getDistrict/${id}`);
            setDistrict(response.data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };
    const getWard = async (id) => {
        try {
            const response = await axios.get(`${apiRoot}Address/getWard/${id}`);
            setWard(response.data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedDistrict('')
        setSelectedWard('')
        setSelectedCity(cityId);
        getDistrict(cityId);
    };

    const handleDistrictChange = (e) => {
        const cityId = e.target.value;
        setSelectedDistrict(cityId);
        setSelectedWard('')
        getWard(cityId);
    };

    const handleWardChange = (e) => {
        const cityId = e.target.value;
        setSelectedWard(cityId);
    };


    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const [api, contextHolder] = notification.useNotification();

    const AddAddress = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const cardData = {
                userId: userInfo.userId,
                matp: selectedCity,
                maqh: selectedDistrict,
                mapx: selectedWard,
                detail: cityInput
            }
            // api call
            await axios.post(
                `${apiRoot}Address/AddAddress`,
                cardData,
                config
            ).then(res => {
                axios.get(`${apiRoot}Address/getByUsId/${userInfo.userId}`)
                    .then(res => {
                        setListAdd(res.data)
                        setSelectedCity('')
                        setSelectedDistrict('')
                        setSelectedWard('')
                        setCityInput('')
                    }).catch(err => {
                        console.log('loi');
                    })
            })
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const UpdateAddress = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const cardData = {
                addressID: selectedAdd,
                userId: userInfo.userId,
                matp: selectedCity,
                maqh: selectedDistrict,
                mapx: selectedWard,
                detail: cityInput
            }
            // api call
            await axios.put(
                `${apiRoot}Address`,
                cardData,
                config
            ).then(res => {
                axios.get(`${apiRoot}Address/getByUsId/${userInfo.userId}`)
                    .then(res => {
                        setListAdd(res.data)
                        setSelectedCity('')
                        setSelectedDistrict('')
                        setSelectedWard('')
                        setCityInput('')
                    }).catch(err => {
                        console.log('loi');
                    })
            })
            api['success']({
                message: 'Thêm thành công',
                description:
                    'Sản phẩm đã được thêm thành công vào giỏ hàng',
            });
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const handleEditAdd = (item) => {
        setSelectedAdd(item.addressID)
        setSelectedCity(item.matp)
        getDistrict(item.matp)
        setSelectedDistrict(item.maqh)
        getWard(item.maqh)
        setSelectedWard(item.mapx)
        setCityInput(item.detail.split(',')[0])
        setShowActiveBtn(false)
    }

    const AddNewAd = () => {
        setShowActiveBtn(true)
        setSelectedCity('')
        setSelectedDistrict('')
        setSelectedWard('')
        setCityInput('')
    }

    const renderData = () => {
        try {
            return (
                <>
                    <div style={{
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '0 0 20px 20px',
                        height: '80vh',
                        justifyContent: 'center',
                        padding: '2rem',
                        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px'
                    }}>
                        <h3 style={{
                            textAlign: 'center',
                            marginBottom: '2rem'
                        }}>Thông tin tài khoản</h3>
                        {loading && <span style={{ display: "flex" }}><h5>Getting User Information</h5><span className="ml-2"><Spinner animation="border" /></span></span>}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderRadius: '1rem',
                            boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px'

                        }}>
                            <div style={{
                                width: '25%',
                                height: '50vh',
                                borderRight: '1px solid grey'
                            }} className='accountView'>
                                {checkOption === 1
                                    ? <p style={{ backgroundColor: 'rgb(251, 100, 69)', color: 'white' }}>Thông tin chung</p>
                                    : <p onClick={() => { setCheckOption(1) }}>Thông tin chung</p>
                                }
                                {checkOption === 2
                                    ? <p style={{ backgroundColor: 'rgb(251, 100, 69)', color: 'white' }}>Cập nhật Email</p>
                                    : <p onClick={() => { setCheckOption(2) }}>Cập nhật Email</p>
                                }
                                {checkOption === 3
                                    ? <p style={{ backgroundColor: 'rgb(251, 100, 69)', color: 'white' }}>Thay đổi mật khẩu</p>
                                    : <p onClick={() => { setCheckOption(3) }}>Thay đổi mật khẩu</p>
                                }
                                {checkOption === 4
                                    ? <p style={{ backgroundColor: 'rgb(251, 100, 69)', color: 'white' }}>Cập nhật địa chỉ</p>
                                    : <p onClick={() => { handleAddress(4) }}>Cập nhật địa chỉ</p>
                                }
                            </div>
                            {checkOption === 1 && <div style={{
                                width: '70%',
                                padding: '1rem .5rem',
                                height: '70%'
                            }}>
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
                            </div>}
                            {checkOption === 2 && <div style={{
                                width: '70%',
                                padding: '1rem .5rem',
                                height: '70%'
                            }}>
                                <div style={{
                                    marginBottom: '1rem',
                                    width: '100%'
                                }}>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>Nhập địa chỉ Email mới</p>
                                    <input placeholder='Nhập địa chỉ Email' style={{
                                        width: '50%',
                                        padding: '5px 10px',
                                        borderRadius: '.5rem',
                                        outline: 'none',
                                        marginTop: '.5rem'
                                    }} />
                                </div>
                                <div>
                                    <input placeholder='Nhập mã xác nhận' style={{
                                        width: '50%',
                                        padding: '5px 10px',
                                        borderRadius: '.5rem',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} />
                                    <button style={{
                                        border: 'none',
                                        backgroundColor: '#fb6445',
                                        color: 'white',
                                        padding: '6px 10px',
                                        borderRadius: '.5rem'
                                    }}>Gửi mã xác nhận</button>
                                </div>
                                <button style={{
                                    marginTop: '1rem',
                                    border: 'none',
                                    backgroundColor: '#fb6445',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '.5rem'
                                }}>Lưu Thay Đổi</button>
                            </div>}

                            {checkOption === 3 && <div style={{
                                width: '70%',
                                padding: '1rem .5rem',
                                height: '70%'
                            }}>
                                <div style={{
                                    marginBottom: '1rem',
                                    width: '100%'
                                }}>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>Nhập mật khẩu cũ</p>
                                    <input placeholder='Nhập mật khẩu cũ' style={{
                                        width: '50%',
                                        padding: '5px 10px',
                                        borderRadius: '.5rem',
                                        outline: 'none',
                                        marginTop: '.5rem'
                                    }} type='password' value={oldPass}
                                        onChange={(e) => setOldPass(e.target.value)} />
                                </div>
                                <div style={{
                                    marginBottom: '1rem',
                                    width: '100%'
                                }}>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>Nhập mật khẩu mới</p>
                                    <input placeholder='Nhập mật khẩu mới' style={{
                                        width: '50%',
                                        padding: '5px 10px',
                                        borderRadius: '.5rem',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} type='password' value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)} />
                                </div>
                                <div>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>Nhập lại mật khẩu mới</p>
                                    <input placeholder='Nhập lại mật khẩu mới' style={{
                                        width: '50%',
                                        padding: '5px 10px',
                                        borderRadius: '.5rem',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} type='password' value={reNewPass}
                                        onChange={(e) => setReNewPass(e.target.value)} />
                                </div>
                                <button style={{
                                    marginTop: '1rem',
                                    border: 'none',
                                    backgroundColor: '#fb6445',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '.5rem'
                                }} onClick={() => HandleChangePass()}>Lưu Thay Đổi</button>
                            </div>}

                            {checkOption === 4 && <div style={{
                                width: '70%',
                                padding: '1rem .5rem',
                                height: '70%',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    width: '50%'
                                }}>
                                    {listAdd.map((ad, index) => (
                                        <div key={index} style={{
                                            margin: '.5rem 0'
                                        }}>
                                            {ad.detail}
                                            <button onClick={() => handleEditAdd(ad)}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: '#1a71ff',
                                                    color: 'white',
                                                    padding: '.5rem 2rem',
                                                    borderRadius: '.5rem',
                                                    marginLeft: '.5rem'
                                                }}>Sửa</button>
                                        </div>
                                    ))}

                                    <button onClick={() => AddNewAd()} style={{
                                        border: 'none',
                                        backgroundColor: '#fb6445',
                                        color: 'white',
                                        padding: '.5rem 3rem',
                                        borderRadius: '.5rem'
                                    }}>Thêm</button>
                                </div>
                                <div style={{
                                    width: '50%'
                                }}>
                                    <p style={{ fontWeight: 'bold' }}>Chọn Tỉnh/Thành Phố</p>
                                    <select style={{
                                        appearance: 'none',
                                        webkitAppearance: 'none',
                                        mozAppearance: 'none',
                                        width: '50%',
                                        padding: '5px 10px',
                                        border: '1px solid grey',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} value={selectedCity} onChange={handleCityChange}>
                                        <option value="">Chọn Tỉnh/Thành Phố</option>
                                        {city.length > 0 &&
                                            city.map(c => (
                                                <option value={c.matp}>{c.name}</option>
                                            ))
                                        }
                                    </select>

                                    <p style={{ fontWeight: 'bold' }}>Chọn Quận/Huyện</p>
                                    <select style={{
                                        appearance: 'none',
                                        webkitAppearance: 'none',
                                        mozAppearance: 'none',
                                        width: '50%',
                                        padding: '5px 10px',
                                        border: '1px solid grey',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} value={selectedDistrict} onChange={handleDistrictChange}>
                                        <option value="">Chọn Quận/Huyện</option>
                                        {district.length > 0 &&
                                            district.map(c => (
                                                <option value={c.maqh}>{c.name}</option>
                                            ))
                                        }
                                    </select>

                                    <p style={{ fontWeight: 'bold' }}>Chọn Xã/Phường</p>
                                    <select style={{
                                        appearance: 'none',
                                        webkitAppearance: 'none',
                                        mozAppearance: 'none',
                                        width: '50%',
                                        padding: '5px 10px',
                                        border: '1px solid grey',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        marginTop: '.5rem',
                                        marginRight: '.5rem'
                                    }} value={selectedWard} onChange={handleWardChange}>
                                        <option value="">Chọn Xã/Phường</option>
                                        {ward.length > 0 &&
                                            ward.map(c => (
                                                <option value={c.xaid}>{c.name}</option>
                                            ))
                                        }
                                    </select>
                                    <div>
                                        <p style={{ fontWeight: 'bold' }}>Địa chỉ chi tiết</p>
                                        <input placeholder='Nhập địa chỉ chi tiết' style={{
                                            width: '50%',
                                            padding: '5px 10px',
                                            borderRadius: '.5rem',
                                            outline: 'none',
                                            marginTop: '.5rem',
                                            marginRight: '.5rem'
                                        }} value={cityInput}
                                            onChange={handleCityInputChange} />
                                    </div>
                                    {!showActiveBtn && <button style={{
                                        marginTop: '1rem',
                                        border: 'none',
                                        backgroundColor: '#fb6445',
                                        color: 'white',
                                        padding: '10px',
                                        borderRadius: '.5rem'
                                    }} onClick={() => UpdateAddress()}>Lưu Thay Đổi</button>}
                                    {showActiveBtn && <button style={{
                                        marginTop: '1rem',
                                        border: 'none',
                                        backgroundColor: '#fb6445',
                                        color: 'white',
                                        padding: '10px',
                                        borderRadius: '.5rem'
                                    }} onClick={() => AddAddress()}>Thêm Mới</button>}
                                </div>
                            </div>}
                        </div>
                        <div style={{ width: '100%', marginTop: '1rem' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                                marginTop: '1rem'
                            }}>
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
                </>
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
