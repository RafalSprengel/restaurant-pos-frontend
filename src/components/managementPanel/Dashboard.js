
import {useFetch} from '../../hooks/useFetch.js';
import dayjs from 'dayjs';

const Dashboard = () => {
    const {data:stats, loading: loadingStats, error: fetchError} = useFetch('/stats/');
    
    return (
        <div className="dashboard" style={{minWidth: "80%", padding: "20px"}}>
            <h4>Dashboard</h4>
            <div className="dashboard__status" style={{padding: "20px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Total sold</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Orders: </div>
                        <div>{stats?.totalOrders}</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Revenue: </div>
                        <div>&nbsp;&#163;{stats?.totalRevenue}</div>
                    </div>
                   
                </div>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Sold last 7 days</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Orders: </div>
                        <div>{stats?.last7DaysOrders}</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Revenue: </div>
                        <div>&#163; {stats?.last7DaysRevenue}</div>
                    </div>

                </div>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Website visits</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Total: </div>
                        <div>{stats?.totalVisitors}</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Last 7 days: </div>
                        <div>{stats?.last7DaysVisitors}</div>
                    </div>

                </div>
        </div>
        <div className="dashboard__latest-transactions">
            <h5>Latest transactions</h5>
            <table>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>

                {stats?.ordersLast7days?.map((order, index) => {
                    const formattedDate = dayjs(order.updatedAt).format('DD/MM/YYYY') || '';
                    return(
                        <tr key={index}>
                            <td>{order.orderNumber}</td>
                            <td>&#163;{order.totalPrice}</td>
                            <td>{formattedDate}</td>
                        </tr>
                )})
                }

                </tbody>
            </table>

        </div>
        <br></br>
        <div className="dashboard__most-popular-products">
            <h5>Most popular products</h5>
            <table>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                </tr>
                </thead>
                <tbody>

                {stats?.topProducts?.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.totalQuantity}</td>
                        </tr>
                ))}

                </tbody>
            </table>
            </div>
        </div>
    )
}
export default Dashboard;