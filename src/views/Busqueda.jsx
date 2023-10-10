import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import MyContext from "../my_context";
//Esto de abajo es nuevo
import axios from 'axios';
// const urlServer = "http://localhost:3000";
const urlServer = "https://artmarketback.onrender.com";
//Esto de arriba es nuevo
const Busqueda = () => {
    const { artworks, setArtworks, setNavTotal, updatingNavTotal, user, setReloadData} = useContext(MyContext);
    const [input_filter, setInput_filter] = useState('');
    const [input_minPrice, setInput_minPrice] = useState('');
    const [input_maxPrice, setInput_maxPrice] = useState('');


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

    const handleInputFilterMinPrice = (e) => {
    // console.log(e.target.value)
        setInput_minPrice(e.target.value);
    }

    const handleInputFilterMaxPrice = (e) => {
    //console.log(e.target.value)
        setInput_maxPrice(e.target.value);
    }

    return (
        <div className="row w-100">
            {/* <h5 className=" filtroBusqueda">Filtra</h5> */}
            <div className="d-flex flex-column" >
                {/* <h5 className=" filtroBusqueda">Utiliza los siguientes filtros en ArtMarket</h5> */}
                <div className="d-flex align-items-center">
                    <input className="mt-5 form-control bg-light text-center text-dark" placeholder="Filtro precio desde" onChange={handleInputFilterMinPrice}></input>
                    <input className="mt-5 form-control bg-light text-center text-dark" placeholder="Filtro precio hasta" onChange={handleInputFilterMaxPrice}></input>
                    <input className="mt-5 form-control bg-light text-center text-dark" placeholder="Busca en ©Artworks Marketplace" onChange={handleInputFilter}></input>
                </div>
            </div>
            {artworks.filter((elemento) => {     
                 if (input_filter === '' && input_minPrice === '' && input_maxPrice === '') {
                     return elemento;                    
                 } 
                 else if (((elemento.title.toLocaleLowerCase().includes(input_filter.toLocaleLowerCase()) || elemento.description.toLocaleLowerCase().includes(input_filter.toLocaleLowerCase())) && input_minPrice === '' && input_maxPrice === '')) {
                    return elemento;
                 } 
                 else if(input_minPrice !== '' && input_filter === '' && input_maxPrice === ''){
                    var minPrice = parseFloat(elemento.price);
                    var filterMinPrice = parseFloat(input_minPrice)
                    console.log(input_minPrice)
                    if(!isNaN(minPrice) && !isNaN(filterMinPrice) && minPrice >= filterMinPrice){
                       return elemento;
                    }
                }
                else if(input_maxPrice !== '' && input_filter === '' && input_minPrice === ''){
                    var maxPrice = parseFloat(elemento.price);
                    var filterMaxPrice = parseFloat(input_maxPrice)                    
                    if(!isNaN(maxPrice) && !isNaN(filterMaxPrice) && maxPrice <= filterMaxPrice){
                       return elemento;
                    }
                }
                else if(input_minPrice !== '' && input_maxPrice!== '' && input_filter === ''){
                    var elementPrice = parseFloat(elemento.price);  
                    var inputMinPrice = parseFloat(input_minPrice);
                    var inputMaxPrice = parseFloat(input_maxPrice)                   
                    if(!isNaN(elementPrice) && !isNaN(inputMinPrice) && !isNaN(inputMaxPrice) && ((inputMinPrice <= elementPrice) && (elementPrice <= inputMaxPrice))){
                       return elemento;
                    }
                }
                else if(input_minPrice !== '' && input_maxPrice!== '' && input_filter !== ''){                 
                    if(!isNaN(elementPrice) && !isNaN(inputMaxPrice) 
                        && (
                        (inputMinPrice <= elementPrice) && (elementPrice <= inputMaxPrice)
                        ) 
                        )
                        {
                            return elemento;
                        }
                    }
            }).map(
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