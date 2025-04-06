import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/MainLayout.scss';

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
