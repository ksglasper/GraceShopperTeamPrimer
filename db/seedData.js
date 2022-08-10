const {
  client,
  createUser,
  createCart,
  createCartMovie,
  createMovie,
  createOrders,
  createReviews
} = require('./');

async function dropTables(){
  console.log("Starting to drop tables")
  try {
    await client.query(`
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_movies;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS movies;
    DROP TABLE IF EXISTS userData;
    DROP TABLE IF EXISTS users;
    `)

    console.log("Finished dropping tables")
  } catch(error){
    console.log("Error dropping tables")
    throw error
  }
}

async function buildTables() {
  console.log("Starting to build tables")
  try {
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email varchar(255) UNIQUE,
      name varchar(255) NOT NULL,
      password varchar(255) NOT NULL
    );
    CREATE TABLE userData(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      address varchar(255) NOT NULL
    );
    CREATE TABLE movies(
      id SERIAL PRIMARY KEY,
      title varchar(255) NOT NULL,
      genre varchar(255) NOT NULL,
      year INTEGER NOT NULL,
      rated varchar(255) NOT NULL,
      plot TEXT NOT NULL,
      actors varchar(255) NOT NULL,
      directors varchar(255) NOT NULL,
      poster varchar(255) NOT NULL,
      price INTEGER NOT NULL,
      inventory INTEGER NOT NULL
    );
    CREATE TABLE cart(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "isPurchased" BOOLEAN DEFAULT false
    );
    CREATE TABLE cart_movies(
      id SERIAL PRIMARY KEY,
      "cartId" INTEGER REFERENCES cart(id),
      "movieId" INTEGER REFERENCES movies(id),
      quantity INTEGER NOT NULL,
      UNIQUE ("cartId", "movieId")
    );
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "movieId" INTEGER REFERENCES movies(id),
      "userId" INTEGER REFERENCES users(id),
      review TEXT NOT NULL,
      UNIQUE ("movieId", "userId")
    );
    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "cartId" INTEGER REFERENCES cart(id),
      address varchar(255) NOT NULL,
      email varchar(255),
      quantity INTEGER NOT NULL,
      date INTEGER NOT NULL,
      price INTEGER NOT NULL
    );
    `)
   
    console.log("Finished building tables")
  } catch (error) {
    console.log("Error building tables")
    throw error;
  }
}

async function populateInitialData() {
  console.log("Starting to populate initial data")
  try {
    const usersToCreate = [
      { name: "albert", password: "bertie99", email:"albert@hotmail.com"},
      { name: "sandra", password: "sandra123", email:"sandra@hotmail.com"},
      { name: "glamgal", password: "glamgal123", email:"glamgal@hotmail.com"},
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log(users)

    const moviesToCreate = [
      { title:"Feeling vs Felt", genre:"Comedy", year:2022 , rated:"R", actors:"Josie Rodriguez", directors:"Hunter Norris", plot:"A hand puppet appears from the blue to shake Edie out of her funk. Sometimes you just have to be polite and let ethereal puppets complete their mission, even if it's kinda low on your to do list. They're on your hand, after all.", price:20 , poster:"img", inventory:1 }
    ]
    const movies = await Promise.all(moviesToCreate.map(createMovie))
    console.log(movies)

    const cartToCreate = [
      { userId:1 }
    ]
    const cart = await Promise.all(cartToCreate.map(createCart))
    console.log(cart)

    const cartMovieToCreate = [
      { cartId:1, movieId:1, quantity:2 }
    ]
    const cartMovie = await Promise.all(cartMovieToCreate.map(createCartMovie))
    console.log(cartMovie)

    const reviewsToCreate = [
      { movieId:1, userId:1, review:"I'm still laughing!" }
    ]
    const reviews = await Promise.all(reviewsToCreate.map(createReviews))
    console.log(reviews)

    const ordersToCreate = [
      { cartId:1, address:"1234 Albert Lane", email:"albert@hotmail.com", quantity:1 , date:1660157462019 , price:20 }
    ]
    const orders = await Promise.all(ordersToCreate.map(createOrders))
    console.log(orders)

    console.log("Finished populating initial data")
  } catch (error) {
    console.log("Error populating initial data")
    throw error;
  }
}

async function rebuildDB(){
  try {
    client.connect();

    await dropTables();
    await buildTables();
    await populateInitialData();
  } catch(error){
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
