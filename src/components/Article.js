import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL;

const Article = ({ id, name, description, image }) => {

    const navigate = useNavigate();
    const [modelImage, setModelImage] = useState();
    useEffect(() => {
        setModelImage(image ? MEDIA_BASE_URL + image : "https://www.w3schools.com/howto/img_avatar.png");
    }, [image]);

    const handleArticleClick = (id, name) => {
    navigate(`/model/${id}`, { state: { name, id } });
  };
    return (
        <div style={styles.article}>
            <div 
            style={styles.imageContainer}
            onClick={() => handleArticleClick(id, name)}
            >
                <img src={modelImage} alt={name} style={styles.image} />
                <div style={styles.overlay}>
                    <h3 style={styles.title}>{name}</h3>
                    <p style={styles.description}>{description}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    article: {
        position: "relative",
        width: "200px",
        height: "300px",
        overflow: "hidden",
        borderRadius: "10px",
        margin: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    overlay: {
        position: "absolute",
        top: "75%",
        left: 0,
        width: "100%",
        height: "20%",
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    description: {
        fontSize: "14px",
        margin: 0,
    },
};

export default Article;
