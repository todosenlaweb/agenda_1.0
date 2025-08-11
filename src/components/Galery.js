import React, {useEffect, useMemo, useState} from "react";
import {useUser} from "../context/UserContext";
import {getCookie} from "../utils/cookies";
import BaseModal from "./BaseModal";
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Galeria = ({ items, userId }) => {
    const [mediaItems, setMediaItems] = useState(items || []);
    useEffect(() => {
        if (items && items.length > 0 && mediaItems.length === 0) {
            setMediaItems(items);
        }
    }, [items]);
    const [filter, setFilter] = useState("all");
    const [modal, setModal] = useState(false);
    const [modalMediaIndex, setModalMediaIndex] = useState(0);
    const [media, setMedia] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [deleteMediaModal, setDeleteMediaModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setIsVideo(file.type.startsWith('video'));
        }
    };

    const {userRole} = useUser();
    const nextMedia = (next) => {
        if (items) {
            let newIndex = 0;
            if (next) {
                newIndex = modalMediaIndex + 1 < paths.length ? modalMediaIndex + 1 : 0;
            } else {
                newIndex = modalMediaIndex === 0 ? paths.length - 1 : modalMediaIndex - 1;
            }
            setModalMediaIndex(newIndex);
        }
    }

    const toggleModal = () => {
        setModal(!modal);
    }
    const paths = [];

    if (items) {
        for (let item of items) {
            paths.push({
                type: item.type,
                media: MEDIA_BASE_URL + item.file_path
            });
        }
    }

    const filteredItems = useMemo(() => {
        return mediaItems.filter((item) =>
            filter === "all" ? true : item.type === filter
        );
    }, [mediaItems, filter]);

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    const handleConfirmUpload = async () => {
        if (!media) return;

        const formData = new FormData();
        formData.append("file", media);
        formData.append("token", getCookie("token"));

        const endpoint = isVideo
            ? `${API_BASE_URL}upload/video/${userId}`
            : `${API_BASE_URL}upload/image/${userId}`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Error al subir archivo");

            const data = await res.json();
            setMediaItems((prev) => [...prev, data.media]);
            setMedia(null);
        } catch (err) {
            console.error("Falló la subida:", err);
        }
    };

    const handleDeleteMedia = async () => {
        if (!deleteTarget) return;
        const token = getCookie("token")
        const endpointType = deleteTarget.type === "image" ? "image" : "video";
        const url = `https://back.agenda.peryloth.com/api/upload/${endpointType}/${deleteTarget.id}`;

        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token}),
            });

            if (res.ok) {
                setMediaItems(prev => prev.filter(item => item.id !== deleteTarget.id));
                setDeleteTarget(null);
                setDeleteMediaModal(false);
            } else {
                console.error("Error al eliminar el archivo");
            }
        } catch (err) {
            console.error("Error en la petición", err);
        }
    };

    return (
        <>
            {deleteMediaModal && (<>
                <BaseModal closeModal={() => setDeleteMediaModal(false)}>
                    <h2 className="bg-base text-center">Seguro que quieres eliminar el archivo?</h2>
                    <p className="p-4">Esta acción no se puede deshacer</p>
                    <div className="d-flex justify-content-evenly w-100 pb-3">
                        <button className="btn general-btn" onClick={() => setDeleteMediaModal(false)}>Cancelar</button>
                        <button className="btn btn-danger" onClick={handleDeleteMedia}>Eliminar</button>
                    </div>
                </BaseModal>
            </>)}
            <div style={{padding: "20px"}}>
                <h2 style={{textAlign: "center"}} className="my-3">Galería</h2>

                <div className="d-flex flex-wrap gap-2 justify-content-center"
                     style={{marginBottom: "10px", gap: "8px"}}>
                    <button
                        type="button" className="btn"
                        style={{background: "var(--special-background-color)", color: "var(--special-color)"}}
                        onClick={() => setFilter("all")}
                    >
                        Todos
                    </button>
                    <button
                        type="button" className="btn"
                        style={{background: "var(--special-background-color)", color: "var(--special-color)"}}

                        onClick={() => setFilter("image")}
                    >
                        Fotos
                    </button>
                    <button
                        type="button" className="btn"
                        style={{background: "var(--special-background-color)", color: "var(--special-color)"}}

                        onClick={() => setFilter("video")}
                    >
                        Videos
                    </button>
                </div>

                <div
                >
                    {filteredItems?.map((item, index) => (
                        <div
                            className="mb-5"
                            key={index}
                            onClick={() => {

                                setModalMediaIndex(index);
                                toggleModal();
                            }}
                            style={{
                                width: "100%",
                                maxWidth: "500px",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0",
                                border: "0px",
                                padding: "0px",
                                margin: "auto",
                                marginBottom: "50px",
                            }}
                        >
                            {item.type === "image" ? (
                                <img
                                    src={MEDIA_BASE_URL + item.file_path}
                                    alt={item.alt || "Foto"}
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            ) : (
                                <video
                                    controls
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "cover",
                                    }}
                                >
                                    <source src={MEDIA_BASE_URL + item.file_path} type="video/mp4"/>
                                    Tu navegador no soporta videos.
                                </video>
                            )}
                            {userRole === "Admin" && (
                                <button
                                    type="button"
                                    className="btn rounded-circle position-absolute m-2"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que se abra el modal principal
                                        setDeleteTarget(item);
                                        setDeleteMediaModal(true);
                                    }}
                                    style={{
                                        backgroundColor: "rgba(255, 0, 0, 0.5)",
                                        color: "white",
                                        border: "none",
                                        width: "40px",
                                        height: "40px",
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                    ))}
                    {userRole === "Admin" && (
                        <>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="d-none"
                                id="upload-input"
                                onChange={handleMediaChange}
                            />

                            <div className="d-flex flex-column align-items-center gap-3 mt-4">

                                {!media && (
                                    <label
                                        htmlFor="upload-input"
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: 'var(--special-background-color)',
                                            borderRadius: '1rem',
                                            color: 'white',
                                            fontSize: '3rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                        }}
                                    >
                                        <span style={{color: 'var(--special-color)', paddingBottom: '15px'}}>+</span>
                                    </label>
                                )}

                                {media && (
                                    <>
                                        <div className="position-relative w-100" style={{maxWidth: '500px'}}>
                                            <div style={{
                                                filter: 'brightness(40%)',
                                                borderRadius: '5px',
                                                overflow: 'hidden'
                                            }}>
                                                {!isVideo ? (
                                                    <img
                                                        src={URL.createObjectURL(media)}
                                                        alt="Foto"
                                                        style={{width: '100%'}}
                                                    />
                                                ) : (
                                                    <video
                                                        controls
                                                        style={{
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    >
                                                        <source src={URL.createObjectURL(media)} type="video/mp4"/>
                                                        Tu navegador no soporta videos.
                                                    </video>
                                                )}
                                            </div>

                                            <label
                                                htmlFor="upload-input"
                                                className="position-absolute"
                                                style={{
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'var(--special-background-color)',
                                                    color: 'var(--special-color)',
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                <i className="bi bi-arrow-left-right"></i>
                                            </label>
                                        </div>

                                        <button
                                            className="btn general-btn px-4 py-2"
                                            onClick={handleConfirmUpload}
                                        >
                                            Confirmar
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
                {modal && (
                    <div className="modal1">
                        <div className="overlay1"
                             onClick={toggleModal}
                        ></div>
                        <div className="modal-content1 model-tag">
                            <button className="chevronButton fs-1" onClick={() => nextMedia(false)}><i
                                className="bi bi-chevron-left model-tag"></i></button>
                            <div
                                style={{height: "100%"}}
                            >
                                {paths[modalMediaIndex].type === "image" ? (
                                    <img
                                        style={{
                                            height: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                        }}
                                        src={paths[modalMediaIndex].media} alt="imagen"></img>
                                ) : (
                                    <video
                                        controls
                                        style={{
                                            height: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                        }}
                                    >
                                        <source src={paths[modalMediaIndex].media} type="video/mp4"/>
                                    </video>
                                )}
                            </div>
                            <button className="chevronButton fs-1" onClick={() => nextMedia(true)}><i
                                className="bi bi-chevron-right model-tag"></i></button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Galeria;
