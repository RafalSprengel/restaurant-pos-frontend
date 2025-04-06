import { Outlet } from 'react-router-dom';

const ManagementLayout = () => {
     return (
          <main className="admin-layout">
               <Outlet /> {/* Admin page here*/}
          </main>
     );
};

export default ManagementLayout;
