import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  AreaChart, Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function OrdersTab({ API_URL }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [highPriceData, setHighPriceData] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
      processChartData(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatMonth = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const processChartData = (data) => {
    // Process status data
    const statusCount = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    // Process daily, monthly, and city data
    const dailyData = {};
    const monthlyData = {};
    const cityData = {};
    const ordersByPrice = [...data].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);

    data.forEach(order => {
      // Count by status
      statusCount[order.status]++;

      // Process daily data
      const dateStr = formatDate(order.createdAt);
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { orders: 0, revenue: 0 };
      }
      dailyData[dateStr].orders++;
      if (order.status === 'Delivered') {
        dailyData[dateStr].revenue += order.totalAmount;
      }

      // Process monthly data
      const monthStr = formatMonth(order.createdAt);
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { orders: 0, revenue: 0 };
      }
      monthlyData[monthStr].orders++;
      if (order.status === 'Delivered') {
        monthlyData[monthStr].revenue += order.totalAmount;
      }

      // Process city data
      if (!cityData[order.city]) {
        cityData[order.city] = { orders: 0, revenue: 0 };
      }
      cityData[order.city].orders++;
      cityData[order.city].revenue += order.totalAmount;
    });

    // Transform data for charts
    setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
    
    setDailyRevenue(Object.entries(dailyData).map(([date, data]) => ({ 
      date,
      ...data
    })));
    
    setMonthlyTrends(Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })));

    setCityData(Object.entries(cityData)
      .map(([city, data]) => ({
        city,
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => b.orders - a.orders)
    );

    setHighPriceData(ordersByPrice.map(order => ({
      orderNo: `#${order.orderNo}`,
      amount: order.totalAmount,
      customer: order.customerName
    })));
  };

  return (
    <div>
      {/* Analytics Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Order Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold">{filteredOrders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Completed Orders</h3>
            <p className="text-2xl font-bold">
              {filteredOrders.filter(o => o.status === 'Delivered').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Pending Orders</h3>
            <p className="text-2xl font-bold">
              {filteredOrders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Completed Revenue</h3>
            <p className="text-2xl font-bold">
              Rs{filteredOrders
                .filter(o => o.status === 'Delivered')
                .reduce((sum, order) => sum + order.totalAmount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* City-based Orders Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by City</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Number of Orders" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highest Value Orders Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Highest Value Orders</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={highPriceData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="orderNo" type="category" />
                <Tooltip 
                  content={({ payload, label }) => {
                    if (payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p>Order: {label}</p>
                          <p>Amount: Rs {payload[0].value}</p>
                          <p>Customer: {payload[0].payload.customer}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Revenue (Completed Orders)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Orders Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Order Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue (Completed Orders)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (Rs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Orders List ({filteredOrders.length} orders)
          </h3>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              onClick={() => {
                // Export functionality placeholder
                alert('Export functionality will be implemented');
              }}
            >
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p>{order.contactNumber}</p>
                    <p className="text-xs">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="border rounded px-2 py-1"
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order #{selectedOrder.orderNo} Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p className="mb-1">Name: {selectedOrder.customerName}</p>
                <p className="mb-1">Email: {selectedOrder.email}</p>
                <p className="mb-1">Phone: {selectedOrder.contactNumber}</p>
                <p className="mb-1">Address: {selectedOrder.address}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <p className="mb-1">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p className="mb-1">Status: 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${STATUS_COLORS[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="mb-1">Total Amount: Rs{selectedOrder.totalAmount}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Order Items</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">{item.productId.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.color} - Size {item.size}
                        </p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">Price: Rs{item.price}</p>
                        <p className="text-sm font-medium mt-1">
                          Subtotal: Rs{item.price * item.quantity}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <img 
                          src={item.frontImage} 
                          alt={`${item.productId.name} front`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <img 
                          src={item.backImage} 
                          alt={`${item.productId.name} back`}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <select
                    className="border rounded px-3 py-1"
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    // Print functionality placeholder
                    alert('Print functionality will be implemented');
                  }}
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}