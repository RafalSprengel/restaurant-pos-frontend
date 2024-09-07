import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet /> {/* Tutaj będą renderowane strony */}
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
