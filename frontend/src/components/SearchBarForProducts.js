import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'


function SearchBarForProducts() {

    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            history.push(`/?searchTerm=${searchTerm}`)
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <span
                    style={{ display: "flex" }}
                    className=""
                >
                    <input
                        style={{ borderRadius: '1rem' }}
                        type="text"
                        value={searchTerm}
                        placeholder="search products"
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        style={{ backgroundColor: '#4444FF', width: '20%', borderRadius: '1rem' }}
                        type="submit"
                        className="btn btn-primary ml-2 button-focus-css"
                    ><i className="fas fa-search"></i>
                    </button>
                </span>
            </form>
        </div>
    )
}

export default SearchBarForProducts
