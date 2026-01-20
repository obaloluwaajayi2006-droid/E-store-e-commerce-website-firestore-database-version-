const orders = JSON.parse(localStorage.getItem("orders")) || [];


orders.sort((a, b) => new Date(b.date) - new Date(a.date));



let salesHTML = '';

orders.forEach((sales, index) => {
  salesHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${sales.name}</td>
      <td>₦${sales.totalPrice}</td>
      <td>${sales.date}</td>
      <td>${sales.reference}</td>
    </tr>
  `;
});

document.getElementById("salesOrder").innerHTML = salesHTML;





let totalRevenue = 0;

orders.forEach((balance) => {
  totalRevenue += Number(balance.totalPrice);
});

const revenueElement = document.getElementById("totalRevenue");
if (revenueElement) {
  revenueElement.textContent = totalRevenue.toFixed(2);
}


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

