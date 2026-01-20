// GET ORDERS
let orders = JSON.parse(localStorage.getItem("orders")) || [];


orders.sort((a, b) => new Date(b.date) - new Date(a.date));

const recentOrders = orders.slice(0, 2);

// DISPLAY RECENT ORDERS
let recentHTML = "";
recentOrders.forEach((sales, index) => {
  recentHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${sales.name}</td>
      <td>₦${sales.totalPrice}</td>
      <td>${sales.date}</td>
      <td>${sales.reference}</td>
    </tr>
  `;
});

document.getElementById("salesOrder").innerHTML = recentHTML;



// total revenue (all-time)
let totalRevenue = 0;

orders.forEach(order => {
  totalRevenue += Number(order.totalPrice);
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
  const orderDate = new Date(order.date);
  if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
    totalThisMonth += Number(order.totalPrice);
  }
});

const monthlyRevenueElement = document.getElementById("totalThisMonth");
if (monthlyRevenueElement) monthlyRevenueElement.textContent = totalThisMonth.toFixed(2);


// total quantity sold this year
let totalQuantityThisYear = 0;

orders.forEach(order => {
  const orderDate = new Date(order.date);
  if (orderDate.getFullYear() === currentYear) {

    if (order.quantity) {
      totalQuantityThisYear += Number(order.quantity);
    }


    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        totalQuantityThisYear += Number(item.quantity || 0);
      });
    }
  }
});

const quantityYearElement = document.getElementById("totalQuantityYear");
if (quantityYearElement) quantityYearElement.textContent = totalQuantityThisYear;



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
    const dateObj = new Date(order.date);
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    weekdays[weekday] += Number(order.totalPrice);
  });

  return weekdays;
}

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

