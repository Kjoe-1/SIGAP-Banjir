// Konfigurasi Chart.js
const ctx = document.getElementById('rainChart').getContext('2d');
const rainChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM'],
        datasets: [{
            label: 'Tinggi Curah Hujan (mm)',
            data: [28, 30, 15, 42, 85, 48, 32, 25, 10, 5, 2, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Milimeter (mm)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Update waktu otomatis
function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerText = now.toLocaleString('id-ID');
    }
}
setInterval(updateClock, 1000);
updateClock();