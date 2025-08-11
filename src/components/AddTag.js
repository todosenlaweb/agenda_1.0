import {useState } from "react";
const AddTag = ({token, tagTipo, setError, modelToSearchId, handleGetPerson}) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [newTag, setNewTag] = useState({
        tipo: "",
        valor: "",
        token: token,
      })
    
      const handleChangeTag = (e) => {
        setNewTag({
          ...newTag,
          [e.target.name]: e.target.value,
        });
      };

      const handleCreateTag = async (e, tagTipo) => {
        e?.preventDefault();
        setError(null);      
        try {
          const response = await fetch(`${API_BASE_URL}add-tag/${modelToSearchId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(tagTipo ? {
              tipo: tagTipo,
              valor: newTag.valor,
              token: newTag.token,
            } : newTag),
          });
    
          if (!response.ok){
            throw new Error("Error al autenticar");
          }
    
          const result = await response.json();
          handleGetPerson();
          
        } catch (error) {
          setError(error.message);
        }
      };

    return (
        <div  className="model-tag d-inline-flex px-1 me-1 rounded-3 py-1" style={{marginBottom: "2px"}}> 
            {!tagTipo && (<>
                <input name="tipo" className="input-tag me-1" onChange={handleChangeTag} value={newTag.tipo}/>:            
            </>)}
            <input name="valor" className="input-tag ms-1" onChange={handleChangeTag} value={newTag.valor}/>
            {((newTag.tipo || tagTipo) && newTag.valor) && (
            <button type="button" className="create-tag ms-1" onClick={()=> {handleCreateTag(null, tagTipo)}}><i className="bi bi-plus"></i></button>
            )}
        </div>
    )
}

export default AddTag;