export default function ClientSupport (){
    const ClientSupportNumber = "523333333333"
    const ClientSupportMessage = "Hola%2C%20necesito%20ayuda%20referente%20a%20la%20pagina%20de%20Lobas%20Vip"
    const supportEmail = "hello@lobasvip.com.ve"
    
    return(
    <div className="d-flex flex-column align-items-center">
        <h2 className="w-75 text-center mb-3">Soporte a cliente</h2>
        
        {/* Email Support Section */}
        <div className="w-75 mb-4">
            <h4 className="mb-3">📧 Soporte por correo electrónico</h4>
            <p className="mb-3">
                Si necesitas ayuda, tienes preguntas o quieres reportar algún problema, puedes escribirnos directamente a nuestro correo de soporte.
            </p>
            <p className="mb-3">
                <strong>Correo de soporte:</strong> <a
                    className="general-link"
                    href={`mailto:${supportEmail}?subject=Soporte%20Cliente%20-%20Consulta&body=Hola%2C%20necesito%20ayuda%20con%20la%20siguiente%20consulta%3A%0D%0A%0D%0A%0D%0A%0D%0AGracias%2C%20saludos.`}
                >{supportEmail}</a>
            </p>
            <p>
                O puedes escribir directamente dando <a
                    className="general-link"
                    href={`mailto:${supportEmail}?subject=Soporte%20Cliente%20-%20Consulta&body=Hola%2C%20necesito%20ayuda%20con%20la%20siguiente%20consulta%3A%0D%0A%0D%0A%0D%0A%0D%0AGracias%2C%20saludos.`}
                >click aquí</a> para abrir tu cliente de correo.
            </p>
        </div>

        {/* WhatsApp Support Section 
        <div className="w-75">
            <h4 className="mb-3">💬 Soporte por WhatsApp</h4>
            <p className="mb-3">
                Si necesitas ayuda para completar algún paso o tienes alguna duda acerca del servicio, no dudes en enviar mensaje al número
                <strong> +52 33 33 33 33 33</strong> o dando <a
                    className="general-link"
                    href={`https://wa.me/${ClientSupportNumber}?text=${ClientSupportMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >click aquí.</a>
            </p>
        </div>
        */}
    </div>);
}