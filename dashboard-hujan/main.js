

// ini url yg asli:
//const API_URL = 'http://localhost:8000/get_ultrasonic.php';

//ini hasil tunneling server bintang
const API_URL = 'https://self-carrousel-culprit.ngrok-free.dev/get_ultrasonic.php';
const ctx = document.getElementById('rainChart').getContext('2d');
const rainChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Tinggi Air (cm)',
            data: [],
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
                    text: 'Jarak Ultrasonik (cm)'
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

function formatTimeLabel(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function updateChart(labels, values) {
    rainChart.data.labels = labels;
    rainChart.data.datasets[0].data = values;
    rainChart.update();
}

function updateSummary(latest) {
    document.getElementById('current-time').innerText = latest.waktu || 'Tidak ada data';
    document.getElementById('current-distance').innerHTML = `${latest.distance1 ?? '-'} <small style="font-size: 1rem;">cm</small>`;
    document.getElementById('distance1-value').innerText = latest.distance1 ?? '-';
    document.getElementById('distance2-value').innerText = latest.distance2 ?? '-';

    const statusBadge = document.getElementById('status-badge');
    if (latest.distance1 !== null && latest.distance1 !== undefined) {
        const value = parseFloat(latest.distance1);
        if (value <= 100) {
            statusBadge.innerText = 'SIAGA';
            statusBadge.style.backgroundColor = '#ff4d4f';
        } else if (value <= 200) {
            statusBadge.innerText = 'WASPADA';
            statusBadge.style.backgroundColor = '#ffcc00';
        } else {
            statusBadge.innerText = 'AMAN';
            statusBadge.style.backgroundColor = '#52c41a';
        }
    } else {
        statusBadge.innerText = 'Memuat...';
        statusBadge.style.backgroundColor = '#999';
    }
}

async function fetchSensorData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json.data || !Array.isArray(json.data)) {
            throw new Error('Respons API tidak valid');
        }

        const rows = json.data.slice().reverse();
        const labels = rows.map(row => formatTimeLabel(row.waktu));
        const values = rows.map(row => parseFloat(row.distance1) || 0);

        updateChart(labels, values);
        updateSummary(rows[rows.length - 1] || rows[0] || {});
    } catch (error) {
        console.error('Gagal ambil data sensor:', error);
    }
}

fetchSensorData();
setInterval(fetchSensorData, 10000);