import React from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DeleteMediaButton = ({setError, token, media, handleGetPerson}) => {

    const handleDeleteMedia = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}upload/${media.type}/${media.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token : token}),
            });
    
            if (!response.ok){
                throw new Error("Error al eliminar archivo de la galeria");
            }
    
            const result = await response.json();
            handleGetPerson();
            } catch (error) {
                setError(error.message);
            }
        };

    return (
        <button 
        className="position-absolute top-0 end-0 btn btn-danger m-2"
        onClick={handleDeleteMedia}
        >
            <i className="bi bi-trash3-fill"/>
        </button>
    );
};

export default DeleteMediaButton;