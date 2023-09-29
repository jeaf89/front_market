import React, { useState } from 'react';
import {Card, Container} from 'react-bootstrap';
import CardGroup from 'react-bootstrap/CardGroup'


import { useContext } from "react";
import MyContext from "../my_context";

import { addArtwork } from '../services/artworksService';

import { useEffect } from 'react';
import { getCart } from '../services/cartService';

const UserViewBuyer = ({ user }) => {

    const { reloadData, setReloadData, setCartInfo } = useContext(MyContext);
    
    useEffect(() => {          
        console.log("EL RELOAD ESTA EN ESTADO (ANTES DE MONTAR componente): "+reloadData);
        getCart(user.user_id)
            .then((data) => {
                const cart = data.map((product => ({
                ...product
            })));
            setCartInfo([...cart]);
        })
        .catch((error) => console.error('Error al obtener informacion desde servidor.', error))
        .finally(() => {
            setReloadData(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps          
    }, [user.user_id]);

    const [artworkData, setArtworkData] = useState({
        title: '',
        description: '',
        price: 0,
        url_image: '',        
    });    
    
    const token = localStorage.getItem('token');
    
    const handleAddArtwork = async () => {
        try {
            const artworkWithSeller = {...artworkData, seller_id: user.user_id};
            const addedArtwork = await addArtwork(artworkWithSeller, token);           

            // addedArtwork.amount = 0;

            artworkWithSeller.amount = 0;
            artworkWithSeller.product_id = addedArtwork[0].product_id;
            setArtworks([...artworks, artworkWithSeller ]);            

            // probando
            setArtworkData({
                title: '',
                description: '',
                price: 0,
                url_image: '',        
            });

        } catch (error) {
            //Manejo Errores
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        let newValue;

        if (name === 'price') {
            newValue = !isNaN(Number(value)) ? Number(value) : 0;
        } else {
            newValue = value;
        }

        setArtworkData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));        
    };

    const { artworks, setArtworks } = useContext(MyContext);
    const artistCollection = artworks.filter((element) => element.seller_id === user.user_id);

    return (
        <div className='d-flex mt-5 mb-3 flex-column pt-5 perfil'>
            
            <h2 className='text-light'>Bienvenido {user.username}!</h2>
            
            <Container className='pt-3'>
                {/* <h1 className="text-center h3 text-light">Obras que has ingresado</h1>
                <CardGroup>
                {
                    artistCollection.map((element, index) => (
                    <Card className="bg-light text-white p-2">
                        <Card.Img 
                        key={index}
                        variant="top"
                        className="artist-collection" 
                        src={element.url_image} />
                        <Card.ImgOverlay>
                        <Card.Title>{element.title}</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                    ))
                }                
                </CardGroup> */}
                <Card className='mt-5 mb-5 text-center formulario bg-secondary'>
                    <h2 className='ancho'>Quieres agregar una Obra en ArtMarket?</h2>
                    <br></br>
                    <div className='form-group ancho'>
                        <label className='label-left'>Nombre de la obra</label>
                        <input className='form-control'  type='text' name='title' value={artworkData.title}  onChange={handleInputChange} placeholder='Ingresa el nombre de la obra' ></input>
                        <br></br>
                        <label className='label-left'>Descripción</label>
                        <input className='form-control' type='text' name='description' value={artworkData.description}  onChange={handleInputChange} placeholder='Descripción' ></input>
                        <br></br>
                        <label className='label-left'>Precio</label>
                        <input className='form-control' type='text' name='price' value={artworkData.price}  onChange={handleInputChange} placeholder='Valor'></input>
                        <br></br>
                        <label className='label-left'>URL imagen</label>
                        <input className='form-control' type='text' name='url_image' value={artworkData.url_image}   onChange={handleInputChange} placeholder='url imagen' ></input>
                        <br></br>
                        <button onClick={handleAddArtwork} className='btn btn-warning mb-2'>Agregar obra</button>
                    </div>
                    {console.log(artworks)}
                </Card>   
                <h1 className="text-center h3 text-light">Obras que has ingresado</h1>
                <CardGroup>
                {
                    artistCollection.map((element, index) => (
                    <Card className="bg-light text-white p-2">
                        <Card.Img 
                        key={index}
                        variant="top"
                        className="artist-collection" 
                        src={element.url_image} />
                        <Card.ImgOverlay>
                        <Card.Title>{element.title}</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                    ))
                }                
                </CardGroup>          
            </Container>            
        </div>
    );
};

export default UserViewBuyer;
