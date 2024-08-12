import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'


function SearchBarForProducts() {

    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            history.push(`/search/${searchTerm}`)
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <span
                    style={{ display: "flex",
                    borderRadius: '3px',
                    backgroundColor: '#e7e0eb',
                    justifyContent: 'space-between',
                    padding: '5px 5px',
                    // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 10px'
                     }}
                    className=""
                >
                    <input
                        style={{
                            borderRadius: '5px',
                            outline: '0px solid orange',
                            width: '90%',
                            border: 'none',
                            padding: '0 10px',
                            backgroundColor: '#e7e0eb'
                        }}
                        type="text"
                        value={searchTerm}
                        placeholder="Tìm kiếm sản phẩm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        style={{ backgroundColor: '#fb6445', width: '8%', borderRadius: '3px', color: 'white' }}
                        type="submit"
                        className="btn ml-2 button-focus-css"
                    ><i className="fas fa-search"></i>
                    </button>
                </span>
            </form>
        </div>
    )
}

export default SearchBarForProducts
