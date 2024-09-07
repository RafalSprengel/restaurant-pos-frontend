import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage.js';
import EventsPage from './pages/EventsPage.js';
import Kontakt from './pages/Kontakt.js';
import Menu from './pages/Menu.js';
import ONas from './pages/ONas.js';
import Promocje from './pages/Promocje.js';
import Admin from './pages/Admin.js';
import NotFound from './pages/NotFound.js';
import { ShoppingCartProvider } from './context/ShoppingCartContext.js';
import meals from './data/meals.json';
import mealsCategories from './data/mealCategories.json';
import Checkout from './pages/Checkout.js';

function App() {
  return (
    <>
      <ShoppingCartProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/menu' element={<Menu mealCategories={mealsCategories} mealsList={meals} />} />
            <Route path='/order/checkout' element={<Checkout />} />
            <Route path='/imprezy-okolicznosciowe' element={<EventsPage />} />
            <Route path='/kontakt' element={<Kontakt />} />
            <Route path='/promocje' element={<Promocje />} />
            <Route path='/o-nas' element={<ONas />} />
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
