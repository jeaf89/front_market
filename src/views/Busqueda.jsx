import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import MyContext from "../my_context";
//Esto de abajo es nuevo
import axios from 'axios';
const urlServer = "http://localhost:3000";
//Esto de arriba es nuevo
const Busqueda = () => {
    const { artworks, setArtworks, setNavTotal, updatingNavTotal, user, setReloadData} = useContext(MyContext);
    const [input_filter, setInput_filter] = useState('');


    const navigate = useNavigate();

    const Add_Click = async (id, counter = null) => {
        // const artwork_id = artworks.findIndex((element) => element.product_id === id);
        // console.log(artwork_id);
        // artworks[artwork_id].amount = artworks[artwork_id].amount + 1;
        // console.log(artworks[artwork_id]);
        // setArtworks([...artworks]);
        // setNavTotal(updatingNavTotal);
        try {
            const selectedProduct = artworks.filter((element) => element.product_id === id);
            
            const body = {
                "user_id": user.user_id,
                "product_id": selectedProduct[0].product_id,
                "price": selectedProduct[0].price,
                "quantity": counter !== null ? counter : undefined
            };
            await axios.post(urlServer+"/cart", body);
    
            const artwork_index = artworks.findIndex((element) => element.product_id === id);
    
            if (counter === null) {
              artworks[artwork_index].amount = artworks[artwork_index].amount + 1;
            } else {
              artworks[artwork_index].amount = artworks[artwork_index].amount + counter;
            }
            
            setArtworks([...artworks]);
            setNavTotal(updatingNavTotal);
    
            setReloadData(true);
        } catch (error) {
          console.error("Error en petición POST:", error);
          throw error;
        }
    }

    const handleInputFilter = (e) => {
        setInput_filter(e.target.value);
    }

    return (
        <div className="row w-100">
            <input className=" fixed-top mt-5 form-control bg-light text-center text-dark" placeholder="Busca en ©Artworks Marketplace" onChange={handleInputFilter}></input>
            {artworks.filter((elemento) => {           
                 if (input_filter === '') {
                     return elemento;                    
                 } else if (elemento.title.toLocaleLowerCase().includes(input_filter.toLocaleLowerCase()) || elemento.description.toLocaleLowerCase().includes(input_filter.toLocaleLowerCase())) {
                     return elemento;
                }
            }).map(
            //{artworks.map(
                (element, index) => (
                    <div key={index} className='col-12 col-md-6 col-xl-3'>
                        <div className='card m-auto my-4 tarjeta'>
                            <img onClick={() => navigate(`/artwork/${element.product_id}`)} src={element.url_image} alt="imagen obra" className="card-img-top heart_pointer"></img>
                            <div className="card-body">
                                <h5>{element.title}</h5>
                                <hr></hr>
                                <p>{element.description}</p>
                                <div className="d-flex justify-content-around">
                                    <button onClick={() => Add_Click(element.product_id)} className="btn btn-secondary">Añadir <i class="fa-solid fa-cart-shopping"></i></button>
                                    <button className="btn" >Value: {element.price}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )
            }
        </div>
    )
}

export default Busqueda;