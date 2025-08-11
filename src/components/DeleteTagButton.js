import React from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DeleteTagButton = ({setError, token, tag, handleGetPerson}) => {

    const handleDeleteTag = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}delete-tag/${tag}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token : token}),
            });
    
            if (!response.ok){
                throw new Error("Error al eliminar la tag");
            }
    
            const result = await response.json();
            handleGetPerson();
            } catch (error) {
                setError(error.message);
            }
        };

    return (
        <button 
        className=" btn btn-danger p-0 me-1" style={{width: "25px", height:"25px"}}
        onClick={handleDeleteTag}
        >
            <i className="bi bi-trash3-fill" style={{fontSize: "15px"}}/>
        </button>
    );
};

export default DeleteTagButton;