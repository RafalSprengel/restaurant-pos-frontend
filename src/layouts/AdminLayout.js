import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <main className="admin-layout">
            <Outlet /> {/* Tutaj będzie renderowana strona admina */}
        </main>
    );
};

export default AdminLayout;
