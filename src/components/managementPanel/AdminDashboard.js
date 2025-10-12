import { Loader, Center, SimpleGrid, Card, Group, Text, ThemeIcon } from '@mantine/core';
import { useFetch } from '../../hooks/useFetch.js';
import dayjs from 'dayjs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { IconShoppingCart, IconCalendarStats, IconUsers } from '@tabler/icons-react';
import './adminDashboard.scss';

const Dashboard = () => {
  const { data: stats, loading: loadingStats, error: fetchError } = useFetch('/stats/');

  const generateProductSalesData = (productNames, days) => {
    const salesData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('DD/MM');
      const dayEntry = { date };
      productNames.forEach(productName => {
        dayEntry[productName] = Math.floor(Math.random() * 10);
      });
      salesData.push(dayEntry);
    }
    return salesData;
  };

  const generateRevenueData = (days) => {
    const revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('DD/MM');
      const revenue = Math.floor(Math.random() * 901) + 100;
      revenueData.push({ date, revenue });
    }
    return revenueData;
  };

  const generateLatestTransactionsData = (count) => {
    const transactions = [];
    for (let i = 0; i < count; i++) {
      const orderNumber = `ORD-${String(100 + i).padStart(3, '0')}`;
      const totalPrice = (Math.random() * 150 + 10).toFixed(2);
      const updatedAt = dayjs().subtract(Math.floor(Math.random() * 7), 'day').subtract(Math.floor(Math.random() * 24), 'hour').format();
      transactions.push({ orderNumber, totalPrice, updatedAt });
    }
    return transactions;
  };

  const truncateName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength - 3) + '...';
    }
    return name;
  };

  if (loadingStats) {
    return (
      <Center className="dashboard__center">
        <Loader size="md" />
      </Center>
    );
  }

  if (fetchError) {
    return (
      <Center className="dashboard__center">
        <div className="dashboard__error">{fetchError}</div>
      </Center>
    );
  }

  const topProductsData = stats?.topProducts?.map(product => ({
    name: truncateName(product.name, 10),
    quantity: product.totalQuantity,
  })) || [];

  const simulatedLast7DaysRevenueData = generateRevenueData(7);

  const top5ProductNames = stats?.topProducts?.slice(0, 5).map(p => p.name) || [];
  const productSalesData = generateProductSalesData(top5ProductNames, 7);

  const simulatedLatestTransactions = generateLatestTransactionsData(5);

  return (
    <div className="dashboard">
      <h4 className="dashboard__title">Dashboard Overview</h4>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" className="dashboard__status">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="lg">Total Sales</Text>
            <ThemeIcon variant="light" size="lg" radius="md">
              <IconShoppingCart style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
          </Group>
          <Text size="sm" c="dimmed">
            Orders: <Text span fw={700}>{stats?.totalOrders}</Text>
          </Text>
          <Text size="sm" c="dimmed">
            Revenue: <Text span fw={700}>£{stats?.totalRevenue?.toFixed(2)}</Text>
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="lg">Last 7 Days Sales</Text>
            <ThemeIcon variant="light" size="lg" radius="md">
              <IconCalendarStats style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
          </Group>
          <Text size="sm" c="dimmed">
            Orders: <Text span fw={700}>{stats?.last7DaysOrders}</Text>
          </Text>
          <Text size="sm" c="dimmed">
            Revenue: <Text span fw={700}>£{stats?.last7DaysRevenue?.toFixed(2)}</Text>
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="lg">Website Visits</Text>
            <ThemeIcon variant="light" size="lg" radius="md">
              <IconUsers style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
          </Group>
          <Text size="sm" c="dimmed">
            Total: <Text span fw={700}>{stats?.totalVisitors}</Text>
          </Text>
          <Text size="sm" c="dimmed">
            Last 7 Days: <Text span fw={700}>{stats?.last7DaysVisitors}</Text>
          </Text>
        </Card>
      </SimpleGrid>

      <div className="dashboard__charts-grid">
        <div className="dashboard__chart-card">
          <h5 className="dashboard__chart-card-title">Most Popular Products</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topProductsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard__chart-card">
          <h5 className="dashboard__chart-card-title">Last 7 Days Revenue</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={simulatedLast7DaysRevenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (£)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard__chart-card">
          <h5 className="dashboard__chart-card-title">Product Sales (Top 5, Last 7 Days)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={productSalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {top5ProductNames.map((productName, index) => (
                <Line
                  key={productName}
                  type="monotone"
                  dataKey={productName}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  activeDot={{ r: 8 }}
                  name={productName}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
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
            {simulatedLatestTransactions.map((order, index) => {
              const formattedDate = dayjs(order.updatedAt).format('DD/MM/YYYY HH:mm') || '';
              return (
                <tr key={index}>
                  <td>{order.orderNumber}</td>
                  <td>£{order.totalPrice}</td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;