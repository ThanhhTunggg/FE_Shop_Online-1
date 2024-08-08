import axios from "axios"
import { useEffect, useState } from "react"
import apiRoot from "../Config/ConfigApi"

const ManageMoneyPage = () => {
    const [choose, setChoose] = useState(1)
    const [report1, setReport1] = useState([])
    const [userLst, setUserLst] = useState([])
    const [order, setOrder] = useState([])

    const handleChoose = (id) => {
        setChoose(id)
    }

    useEffect(() => {
        axios.get(`${apiRoot}User/report/${choose}`)
            .then(res => {
                setReport1(res.data)
            })

        axios.get(`${apiRoot}User`)
            .then(res => {
                setUserLst(res.data)
            })
        axios.get(`${apiRoot}GetAllOrder`)
            .then(res => {
                setOrder(res.data)
            })
    }, [choose])
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',

        }}>
            <div style={{
                width: '70%',
                margin: '7rem 2rem 2rem 2rem',
            }}>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    border: '1px solid grey',
                    borderRadius: '.5rem',
                    backgroundColor: 'white'
                }}>
                    <div className="manageleft">
                        <h4>Doanh thu</h4>
                        {choose === 1 ? <p style={{
                            backgroundColor: '#ff911a'
                        }} onClick={() => handleChoose(1)}>Tháng này</p> : <p onClick={() => handleChoose(1)}>Tháng này</p>}
                        {choose === 3 ? <p style={{
                            backgroundColor: '#ff911a'
                        }} onClick={() => handleChoose(3)}>3 tháng</p> : <p onClick={() => handleChoose(3)}>3 tháng</p>}
                        {choose === 6 ? <p style={{
                            backgroundColor: '#ff911a'
                        }} onClick={() => handleChoose(6)}>6 tháng</p> : <p onClick={() => handleChoose(6)}>6 tháng</p>}
                        {choose === 12 ? <p style={{
                            backgroundColor: '#ff911a'
                        }} onClick={() => handleChoose(12)}>1 năm</p> : <p onClick={() => handleChoose(12)}>1 năm</p>}
                    </div>
                    <div className="manageright">
                        <h4>Kết quả</h4>
                        <div className="manageData" style={{
                            backgroundColor: '#8be98c'
                        }}>
                            <h5>Số sản phẩm bán được</h5>
                            <p>{report1[0]} sản phẩm</p>
                        </div>

                        <div className="manageData" style={{
                            backgroundColor: '#efa16d'
                        }}>
                            <h5>Số tiền bán được</h5>
                            <p>{report1[1]} vnd</p>
                        </div>

                        <div className="manageData" style={{
                            backgroundColor: '#a3c6ff'
                        }}>
                            <h5>Sản phẩm được mua nhiều nhất</h5>
                            <p>{report1[2]}</p>
                        </div>
                    </div>
                </div>
                <div style={{
                    width: '100%',
                    margin: '2rem 0',
                    border: '1px solid grey',
                    borderRadius: '.5rem',
                    backgroundColor: 'white'
                }}>
                    <h4 style={{
                        margin: '.2rem 2rem'
                    }}>Các đơn hàng </h4>
                    <div style={{
                        width: '90%',
                        margin: '.2rem 4%'
                    }}>
                        {order.length > 0 && order.map((or, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '.5rem 1rem',
                                margin: '.5rem',
                                borderRadius: '.5rem',
                                backgroundColor: or.userRole === 1 ? '#FFA460' : '#eab676',
                                width: '100%'
                            }}>
                                <div>
                                    <p><b>Ngày đặt:</b> {or.orderDate.split('T')[0]}</p>
                                    <p><b>Tổng tiền:</b> {or.totalMoney}</p>
                                    <p><b>Địa chỉ:</b> {or.addressDetail}</p>
                                </div>
                                {or.orderStatus === 1 &&
                                    <button style={{
                                        backgroundColor: '#60bbff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                                    }}>Nhận</button>
                                }
                                {or.orderStatus === 3 &&
                                    <button style={{
                                        backgroundColor: '#60ffa4',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                                    }}>Đã nhận</button>
                                }
                                {or.orderStatus === 4 &&
                                    <button style={{
                                        backgroundColor: '#6460ff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                                    }}>Đã giao</button>
                                }
                                {or.orderStatus === 5 &&
                                    <button style={{
                                        backgroundColor: '#ff6075',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                                    }}>Đã Huỷ</button>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{
                width: '28%',
                height: '70vh',
                margin: '7rem 2rem 2rem 2rem',
                backgroundColor: 'white',
                borderRadius: '.5rem',
                border: '1px solid grey'
            }}>
                {userLst.length > 0 && userLst.map((us, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '.5rem 1rem',
                        margin: '.5rem',
                        borderRadius: '.5rem',
                        backgroundColor: us.userRole === 1 ? '#FFA460' : '#eab676'
                    }}>
                        <p>
                            {us.userName}
                        </p>
                        <p>
                            {us.userPhone}
                        </p>
                        <p>
                            {us.userRole === 1 ? 'Admin' : 'Thành viên'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageMoneyPage