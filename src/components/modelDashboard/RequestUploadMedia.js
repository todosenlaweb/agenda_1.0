import { useEffect } from "react"

export default function RequestUploadMedia ({modelName}) {
    useEffect(()=>{

    }, [])

    return(
    <div className="d-flex flex-column align-items-center">
        <h2 className="w-75 text-center mb-3">Solicitar subida de multimedia</h2>
        
        {/* Documento de Identidad Obligatorio */}
        <div className="w-75 mb-4">
            <h4 className="text-danger mb-2">📋 Documento de Identidad (OBLIGATORIO)</h4>
            <p className="mb-3">
                <strong>Enviar foto del Documento de Identidad</strong> - Obligatorio para corroborar la mayoría de edad.
            </p>
        </div>

        {/* Archivos Multimedia */}
        <div className="w-75 mb-4">
            <h4 className="mb-2">📸 Archivos multimedia para el perfil</h4>
            <p className="mb-3">
                <strong>Videos y Fotos</strong> - Estos archivos deberán cumplir las siguientes reglas:
            </p>
        </div>

        {/* Reglas Prohibidas */}
        <div className="w-75 mb-4">
            <h5 className="text-danger mb-2">🚫 PROHIBIDO</h5>
            <ul className="list-unstyled">
                <li className="mb-2">• Contenido EXPLÍCITO</li>
                <li className="mb-2">• Cualquier tipo de parafilias asociadas o alusivas a menores de edad y animales, entiéndase: Zoofilia, Pedofilia, Necrofilia</li>
            </ul>
        </div>

        {/* Reglas Permitidas */}
        <div className="w-75 mb-4">
            <h5 className="text-success mb-2">✅ PERMITIDO</h5>
            <ul className="list-unstyled">
                <li className="mb-2">• Cualquier tipo de contenido audiovisual en lencería</li>
                <li className="mb-2">• Editar sus fotos y proteger su identidad tapando su rostro</li>
            </ul>
        </div>

        {/* Información de contacto */}
        <div className="w-75 mb-4">
            <h5 className="mb-2">📧 Correo de soporte</h5>
            <p className="mb-3">
                <strong>hello@lobasvip.com.ve</strong>
            </p>
        </div>

        {/* Instrucciones de envío */}
        <div className="w-75">
            <p className="mb-3">
                Para subir tus fotos y que puedan ser visibles, debes enviar un correo al administrador de la página con la o las imágenes anexadas.
                Luego de esto pasarán por un proceso de verificación y recibirás una respuesta dentro de unos días y se subirán automáticamente.
            </p>
            <p>
                Puedes enviar tus fotos al correo <a
                    className="general-link"
                    href={`mailto:hello@lobasvip.com.ve?subject=Subida%20de%20multimedia%20para%20${modelName ? modelName : ""}
                        &body=Hola%2C%20quisiera%20que%20verificaran%20y%20subieran%20las%20fotos%20que%20estoy%20anexando%20en%20este%20correo%2C%20bonito%20dia`}
                >hello@lobasvip.com.ve</a> o dando <a
                    className="general-link"
                    href={`mailto:hello@lobasvip.com.ve?subject=Subida%20de%20multimedia%20para%20${modelName ? modelName : ""}
                        &body=Hola%2C%20quisiera%20que%20verificaran%20y%20subieran%20las%20fotos%20que%20estoy%20anexando%20en%20este%20correo%2C%20bonito%20dia`}
                >click aquí.</a>
            </p>
        </div>
    </div>)
}