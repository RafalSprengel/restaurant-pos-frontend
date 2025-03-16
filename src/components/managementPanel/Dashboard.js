import { faDisplay } from "@fortawesome/free-solid-svg-icons";


const Dashboard = () => {
    return (
        <div className="dashboard" style={{minWidth: "80%", padding: "20px"}}>
            <h4>Dashboard</h4>
            <div className="dashboard__status" style={{padding: "20px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Total sold</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Orders: </div>
                        <div>21</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Sales: </div>
                        <div>&#163;152</div>
                    </div>
                   
                </div>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Sold last 7 days</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Orders: </div>
                        <div>5</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Sales: </div>
                        <div>&#163;39</div>
                    </div>

                </div>
                <div style={{marginRight: "20px", border: "1px solid #ccc", padding: "20px"}}>
                    <h5>Website visits</h5>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Total: </div>
                        <div>112</div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>Last 7 days: </div>
                        <div>&#163;29</div>
                    </div>

                </div>
        </div>
        <div className="dashboard__latest-transactions">
            <h5>Latest transactions</h5>
            <table>
                <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>&#163;20</td>
                    <td>12/12/2021</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>&#163;30</td>
                    <td>12/12/2021</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>&#163;40</td>
                    <td>12/12/2021</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>&#163;50</td>
                    <td>12/12/2021</td>
                </tr>
            </table>

        </div>
        <div className="dashboard__most-popular-products">
            <h5>Most popular products</h5>
            <table>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                </tr>
                <tr>
                    <td>Product 1</td>
                    <td>20</td>
                </tr>
                <tr>
                    <td>Product 2</td>
                    <td>30</td>
                </tr>
                <tr>
                    <td>Product 3</td>
                    <td>40</td>
                </tr>
                <tr>
                    <td>Product 4</td>
                    <td>50</td>
                </tr>
            </table>
            </div>
        </div>
    )
}
export default Dashboard;