// Chart.js configuration and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts with proper responsive configuration
    initMonthlyChart();
    initDonutChart();
    initLineChart();
    initAreaChart();
});

function initMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Facturas',
                data: [65, 78, 90, 81, 95, 102, 118, 125, 132, 148, 155, 142],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 8
                }
            }
        }
    });
}

function initDonutChart() {
    const ctx = document.getElementById('donutChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Anticipos Recibidos', 'Pendientes'],
            datasets: [{
                data: [75, 25],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function initLineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Factorajes',
                data: [120, 135, 150, 165, 180, 195],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

function initAreaChart() {
    const ctx = document.getElementById('areaChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Pagos',
                data: [85, 92, 78, 105, 98, 112],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

// Chart utilities
function updateChartData(chart, newData) {
    if (chart && chart.data && chart.data.datasets[0]) {
        chart.data.datasets[0].data = newData;
        chart.update();
    }
}

function downloadChart(chartId, filename) {
    try {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            showAlert('Gráfica no encontrada', 'danger');
            return;
        }
        
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showAlert('Gráfica descargada exitosamente', 'success');
    } catch (error) {
        console.error('Error downloading chart:', error);
        showAlert('Error al descargar la gráfica', 'danger');
    }
}

// Initialize charts for reports page
function initReportsCharts() {
    // Commission Chart
    const commissionCtx = document.getElementById('commissionChart');
    if (commissionCtx) {
        new Chart(commissionCtx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Comisiones',
                    data: [24000, 27000, 30000, 25600, 33000, 28400],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    y: {beginAtZero: true}
                }
            }
        });
    }

    // Advances Chart
    const advancesCtx = document.getElementById('advancesChart');
    if (advancesCtx) {
        new Chart(advancesCtx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Anticipos',
                    data: [850000, 920000, 1050000, 890000, 1150000, 980000],
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales: {
                    y: {beginAtZero: true}
                }
            }
        });
    }

    // Effectiveness Chart
    const effectivenessCtx = document.getElementById('effectivenessChart');
    if (effectivenessCtx) {
        new Chart(effectivenessCtx, {
            type: 'doughnut',
            data: {
                labels: ['Efectivo', 'No Efectivo'],
                datasets: [{
                    data: [87, 13],
                    backgroundColor: ['#10b981', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%'
            }
        });
    }

    // Comparative Chart
    const comparativeCtx = document.getElementById('comparativeChart');
    if (comparativeCtx) {
        new Chart(comparativeCtx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Facturas',
                    data: [120, 135, 150, 128, 165, 142],
                    backgroundColor: '#3b82f6',
                    yAxisID: 'y'
                }, {
                    label: 'Anticipos (miles)',
                    data: [850, 920, 1050, 890, 1150, 980],
                    backgroundColor: '#10b981',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize reports charts if on reports page
if (window.location.pathname.includes('reportes.html')) {
    document.addEventListener('DOMContentLoaded', initReportsCharts);
}