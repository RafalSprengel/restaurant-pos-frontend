import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './styles/App.scss'
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import HomePage from './pages/HomePage.js';
import EventsPage from './pages/EventsPage.js';
import Kontakt from './pages/Kontakt.js';
import Menu from './pages/Menu.js';
import ONas from './pages/ONas.js';
import Promocje from './pages/Promocje.js';
import NotFound from './pages/NotFound.js';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js'
import meals from './data/meals.json';
import mealsCategories from './data/mealCategories.json'
import Checkout from './pages/Checkout.js';


function App() {
  console.log('Page starting...');
  return (
    <>
      <ShoppingCartProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/menu' element={<Menu mealCategories={mealsCategories} mealsList={meals} />} />
              <Route path='/menu' element={<Menu mealCategories={mealsCategories} mealsList={meals} />} />
              {/* <Route index element={<Menu mealCategories={mealCategories} mealsList={mealsList} />} /> */}
              {/* <Route path='product/:id' element={<Product mealsList={mealsList} />} /> */}
              {/* <Route path=':id' element={<Menu mealCategories={mealCategories} mealsList={mealsList} />} />
              <Route path='search/:se' element={<Menu mealCategories={mealCategories} mealsList={mealsList} />} /> */}
              {/* </Route> */}
              <Route path='/order/checkout' element={<Checkout />} />
              <Route path='/imprezy-okolicznosciowe' element={<EventsPage />} />
              <Route path='/kontakt' element={<Kontakt />} />
              <Route path='/promocje' element={<Promocje />} />
              <Route path='/o-nas' element={<ONas />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div >
      </ShoppingCartProvider>
    </>

  );
}

export default App;
