import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './main-layout.scss';

const MainLayout = () => {
     return (
          <>
               <Header />
               <main>
                    <Outlet />
               </main>
               <Footer />
          </>
     );
};

export default MainLayout;
