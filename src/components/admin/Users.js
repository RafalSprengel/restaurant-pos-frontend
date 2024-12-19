import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { isAuthenticated } from '../../context/authContext';

const Users = () => {
    const navigate = useNavigate();
    const { data: users, loading, error, fetchData } = useFetch('http://localhost:3001/api/getUsers');

    console.log('users: ', users);
    return (
        <div>
            <h3>Users</h3>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    <div>
                        <input
                            type="button"
                            value="Add new"
                            className="btn btn-primary m-3"
                            onClick={() => navigate('/admin/add-user')}
                        />
                    </div>
                    {users?.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>email</th>
                                    <th>Role</th>
                                    <th>Created at</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{`${user.name} ${user.surname || ''}`}</td>
                                        <td>{user.email} </td>
                                        <td>{user.role}</td>
                                        <td>{user.createdAt}</td>
                                        <td>(options)</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>
                            <h1>No users</h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Users;
