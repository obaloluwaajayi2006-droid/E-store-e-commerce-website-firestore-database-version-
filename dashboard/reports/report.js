import { getAllOrders } from '../../firebase/firestore.js';

let orders = [];

const initializeReportsPage = async () => {
  try {
    orders = await getAllOrders();
    displayReportData();
  } catch (error) {
    console.error('Error loading report data:', error);
  }
};

const displayReportData = () => {
  let totalRevenue = 0;

  orders.forEach((balance) => {
    totalRevenue += Number(balance.totalPrice || 0);
  });

  const revenueElement = document.getElementById("totalRevenue");
  if (revenueElement) {
    revenueElement.textContent = totalRevenue.toFixed(2);
  }

  displayChart();
};

// function getDailySales(orders) {
//   const daily = {};

//   orders.forEach(order => {
//     const day = order.date; // saved as YYYY-MM-DD

//     if (!daily[day]) {
//       daily[day] = 0;
//     }

//     daily[day] += Number(order.totalPrice);
//   });

//   return daily;
// }

// const dailySales = getDailySales(orders);



// function getWeekday(dateString) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", { weekday: "short" });
// }


// const labels = Object.keys(dailySales).map(date => getWeekday(date));

// const salesData = Object.values(dailySales);



// const ctx = document.getElementById('dailyChart').getContext('2d');



// function getDailySales(orders) {
//   const daily = {};

//   orders.forEach(order => {
//     const day = order.date; // saved as YYYY-MM-DD

//     if (!daily[day]) {
//       daily[day] = 0;
//     }

//     daily[day] += Number(order.totalPrice);
//   });

//   return daily;
// }

// const dailySales = getDailySales(orders);



// function getWeekday(dateString) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", { weekday: "short" });
// }


// const labels = Object.keys(dailySales).map(date => getWeekday(date));

// const salesData = Object.values(dailySales);



// const ctx = document.getElementById('dailyChart').getContext('2d');

// new Chart(ctx, {
//   type: 'bar',  // <-- CHANGED TO BAR CHART
//   data: {
//     labels: labels,  // Mon, Tue, Wed...
//     datasets: [{
//       label: 'Revenue (₦)',
//       data: salesData,
//       backgroundColor: '#6b4eff',
//       borderWidth: 2
//     }]
//   },
//   options: {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });


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

  const ctx = document.getElementById('dailyChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rotatedLabels,
      datasets: [{
        label: 'Revenue (₦)',
        data: rotatedData,
        borderWidth: 2,
        backgroundColor: '#6b4eff',
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

// Initialize reports page
initializeReportsPage();