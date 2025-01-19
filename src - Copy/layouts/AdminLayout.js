import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <main className="admin-layout">
            <Outlet /> {/* Admin page here*/}
        </main>
    );
};

export default AdminLayout;
