import { getAllOrders } from '../firebase/firestore.js';

// GET ORDERS
let orders = [];

// Load orders from Firestore
const initializeDashboard = async () => {
  try {
    orders = await getAllOrders();
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt?.toDate?.() || a.createdAt || 0);
      const dateB = new Date(b.createdAt?.toDate?.() || b.createdAt || 0);
      return dateB - dateA;
    });

    displayDashboardData();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const displayDashboardData = () => {
  const recentOrders = orders.slice(0, 2);

  // DISPLAY RECENT ORDERS
  let recentHTML = "";
  recentOrders.forEach((sales, index) => {
    const dateStr = sales.createdAt?.toDate?.()?.toLocaleDateString?.() ||
      (typeof sales.createdAt === 'string' ? sales.createdAt : new Date().toLocaleDateString());
    recentHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${sales.shippingAddress?.firstName} ${sales.shippingAddress?.lastName}</td>
        <td>₦${sales.totalPrice}</td>
        <td>${dateStr}</td>
        <td>${sales.reference}</td>
      </tr>
    `;
  });

  document.getElementById("salesOrder").innerHTML = recentHTML;

  // total revenue (all-time)
  let totalRevenue = 0;

  orders.forEach(order => {
    totalRevenue += Number(order.totalPrice || 0);
  });

  const revenueElement = document.getElementById("totalRevenue");
  if (revenueElement) revenueElement.textContent = totalRevenue.toFixed(2);

  const revenueElement2 = document.getElementById("totalRevenue2");
  if (revenueElement2) revenueElement2.textContent = totalRevenue.toFixed(2);

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  let totalThisMonth = 0;

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt?.toDate?.() || order.createdAt || new Date());
    if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
      totalThisMonth += Number(order.totalPrice || 0);
    }
  });

  const monthlyRevenueElement = document.getElementById("totalThisMonth");
  if (monthlyRevenueElement) monthlyRevenueElement.textContent = totalThisMonth.toFixed(2);

  // total quantity sold this year
  let totalQuantityThisYear = 0;

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt?.toDate?.() || order.createdAt || new Date());
    if (orderDate.getFullYear() === currentYear) {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          totalQuantityThisYear += Number(item.quantity || 0);
        });
      }
    }
  });

  const quantityYearElement = document.getElementById("totalQuantityYear");
  if (quantityYearElement) quantityYearElement.textContent = totalQuantityThisYear;

  displayChart();
};

function getSalesByWeekday(orders) {
  const weekdays = {
    "Mon": 0,
    "Tue": 0,
    "Wed": 0,
    "Thu": 0,
    "Fri": 0,
    "Sat": 0,
    "Sun": 0
  };

  orders.forEach(order => {
    const dateObj = new Date(order.createdAt?.toDate?.() || order.createdAt || new Date());
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    weekdays[weekday] += Number(order.totalPrice || 0);
  });

  return weekdays;
}

const displayChart = () => {
  const weekdaySales = getSalesByWeekday(orders);

  const baseLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  const todayIndex = baseLabels.indexOf(today);

  const rotatedLabels = [
    ...baseLabels.slice(todayIndex + 1),
    ...baseLabels.slice(0, todayIndex + 1)
  ];

  const rotatedData = rotatedLabels.map(day => weekdaySales[day]);

  // display chart
  const ctx = document.getElementById('dailyChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: rotatedLabels,
      datasets: [{
        label: 'Total Sales Per Day (₦)',
        data: rotatedData,
        borderWidth: 2,
        tension: 0.4,
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'blue'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// Initialize dashboard
initializeDashboard();

