import React, { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import { createNewCart } from "../api";

export const BASE = `https://radiant-citadel-20620.herokuapp.com/api`;
export async function createMovie(movieObj) {
    try {
      const response = await fetch(`${BASE}/movies`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
            movieObj
          ),
      });
      const result = await response.json();
  
      return result;
    } catch (error) {}
}


export async function editMovieAPI(movieObj) {
    const id = movieObj.id
    try {
      const response = await fetch(`${BASE}/movies/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
            movieObj
          ),
      });
      const result = await response.json();
  
      return result;
    } catch (error) {}
}
export async function deleteMovieAPI(id) {
    try {
      const response = await fetch(`${BASE}/movies/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
  
      return result;
    } catch (error) {}
}

export async function specificMovieList(searchMethod, searchFlow, limitNumber, offsetNumber) {
    try {
      const response = await fetch(`${BASE}/movies/${searchMethod}/${searchFlow}/${limitNumber}/${offsetNumber}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
  
      return result;
    } catch (error) {}
}

const Movies = ({allMovies, token, userDataObj}) =>{
    const [cssActive, setCSSActive] = useState(null)
    const [activeCart, setActiveCart] = useState(null)
    const [purchaseAmount, setPurchaseAmount] = useState(0)
    const cartId = 1

    const handleFilter = (event) =>{
    event.preventDefault()
    console.log(event.target)

    }
    const handleSubmit = (event) =>{
        event.preventDefault()
        console.log(event.target)
        event.target.reset()
        }
    return(
        <>
        <h1 id="movieHeader">Welcome, Find a Movie!</h1>
        <div>
            <form onSubmit={handleSubmit}>
            <input type="search" id="movieSearch" placeholder="Search Movies" name="movieSearchBar"></input>

            {/* <button type="submit">Search</button> */}
            </form>

        </div>
        <div id="movieComponent">

        {allMovies && allMovies.length ? allMovies.map((movie, index)=>{
            let title = movie.title
            let genre = movie.genre
            let year = movie.year
            let plot = movie.plot
            let displayPrice = movie.price
            let id = movie.id
            let inventory = movie.inventory
            let className = null
            if(cssActive === movie.id){
                className = 'activeSeeMore'
            }
            
            return(
            <div key={id} className="movieContainer" >
            <div className="topRowContainer">
            <img className="moviePoster" src={movie.poster}/>
              <div className="textContainer">
                <div className="priceText movieText">
                    <span>${displayPrice}.99</span>
                    <br></br>
                    {inventory < 10 && inventory > 0  ? <><span className="almostOutOfStock">Only {inventory} left in stock</span><br></br></> : <br></br>}
                    {inventory === 0 ? <><span className="outOfStock">Out of stock</span><br></br></> : <br></br>}
                    <label htmlFor="quantity">Qty: </label>
                    <input type="number" id={movie.id} name="quantity" min="1" max={movie.inventory} onBlur={(event)=>event.target.value = ''} onChange={(event)=>{
                        console.log(event.target.value)
                        setPurchaseAmount(Number(event.target.value))
                        if(event.target.value > inventory){
                            alert('You cannot purchase more than what is in stock')
                            setPurchaseAmount(1)
                            event.target.value = 1
                        }}} ></input>
                    <button value={index} className="addToCart" onClick={()=>{
                        console.log(id, 'movie id')
                        console.log(purchaseAmount, 'how many we buying')
                        if(activeCart){
                            addMovieToCart(id, cartId )
                        }
                        }}><span><CartMovies id={id} purchaseAmount={purchaseAmount}/></span></button>
                    </div>
              </div>
              </div>
              <div className="movieInfoContainer"> <NavLink style={{color: 'black'}} to={`/movies/${title}`}>{title}  ({year})</NavLink>
              <div className={`${className} movieInfo`}>{genre}  
              <br></br> 
              <br></br> 
              <span className='furtherMovieInfo'>{plot} </span>
              <br></br> 
              <br></br> 
              <span className='furtherMovieInfo'>Starring: {movie.actors} </span>
              <br></br>
              <br></br> 
              <span className='furtherMovieInfo'>Directors: {movie.directors} </span>
              <br></br> 
              <span className='furtherMovieInfo'>{movie.rated} </span>
              </div>
              <p className="seeMoreTag"><a className="seeMoreLink" href="#" onClick={
                (event)=>{
                event.preventDefault()
                cssActive && cssActive === movie.id ? setCSSActive(null) : setCSSActive(movie.id) 
                console.log(cssActive)}}>
                    { cssActive === movie.id ? '↑ See less' : '↓ See more' }</a>
                </p>
              </div>
              
            </div>
            )
        }) : <>Something Broke</>}
        </div>
        </>
    )
}



export default Movies