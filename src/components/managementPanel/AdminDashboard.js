import { Loader, Center } from '@mantine/core'
import { useFetch } from '../../hooks/useFetch.js'
import dayjs from 'dayjs'
import './adminDashboard.scss'

const Dashboard = () => {
  const { data: stats, loading: loadingStats, error: fetchError } = useFetch('/stats/')

  if (loadingStats) {
    return (
      <Center className="dashboard__center">
        <Loader size="md" />
      </Center>
    )
  }

  if (fetchError) {
    return (
      <Center className="dashboard__center">
        <div className="dashboard__error">{fetchError}</div>
      </Center>
    )
  }

  return (
    <div className="dashboard">
      <h4 className="dashboard__title">Dashboard</h4>

      <div className="dashboard__status">
        <div className="dashboard__card">
          <h5 className="dashboard__card-title">Total Sold</h5>
          <div className="dashboard__card-item">
            <span>Orders:</span>
            <span>{stats?.totalOrders}</span>
          </div>
          <div className="dashboard__card-item">
            <span>Revenue:</span>
            <span>&#163;{stats?.totalRevenue}</span>
          </div>
        </div>

        <div className="dashboard__card">
          <h5 className="dashboard__card-title">Sold Last 7 Days</h5>
          <div className="dashboard__card-item">
            <span>Orders:</span>
            <span>{stats?.last7DaysOrders}</span>
          </div>
          <div className="dashboard__card-item">
            <span>Revenue:</span>
            <span>&#163;{stats?.last7DaysRevenue}</span>
          </div>
        </div>

        <div className="dashboard__card">
          <h5 className="dashboard__card-title">Website Visits</h5>
          <div className="dashboard__card-item">
            <span>Total:</span>
            <span>{stats?.totalVisitors}</span>
          </div>
          <div className="dashboard__card-item">
            <span>Last 7 Days:</span>
            <span>{stats?.last7DaysVisitors}</span>
          </div>
        </div>
      </div>

      <div className="dashboard__section">
        <h5 className="dashboard__section-title">Latest Transactions</h5>
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.last7DaysOrdersList?.map((order, index) => {
              const formattedDate = dayjs(order.updatedAt).format('DD/MM/YYYY') || ''
              return (
                <tr key={index}>
                  <td>{order.orderNumber}</td>
                  <td>&#163;{order.totalPrice}</td>
                  <td>{formattedDate}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="dashboard__section">
        <h5 className="dashboard__section-title">Most Popular Products</h5>
        <table className="dashboard__table">
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

export default Dashboard
