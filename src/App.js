import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import './styles/Bootstrap.scss';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage.js';
import EventsPage from './pages/EventsPage.js';
import Contact from './pages/Contact.js';
import Menu from './pages/Menu.js';
import AboutUs from './pages/AboutUs.js';
import Promotions from './pages/Promotions.js';
import Admin from './pages/Admin.js';
import NotFound from './pages/NotFound.js';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';
import meals from './data/meals.json';
import mealsCategories from './data/mealCategories.json';
import Checkout from './pages/Checkout.js';
global.c=(...arg)=>console.log(...arg)

function App() {
  return (
    <>
      <ShoppingCartProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/menu' element={<Menu mealCategories={mealsCategories} mealsList={meals} />} />
            <Route path='/order/checkout' element={<Checkout />} />
            <Route path='/events' element={<EventsPage />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/promotions' element={<Promotions />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='*' element={<NotFound />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path='/admin/*' element={<Admin />} />
          </Route>
        </Routes>
      </ShoppingCartProvider>
    </>
  );
}

export default App;