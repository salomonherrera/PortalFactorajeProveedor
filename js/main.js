// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
        });
    }
    
    // Mobile sidebar toggle
    if (window.innerWidth <= 768) {
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            content.classList.remove('expanded');
        }
    });
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
});

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('selectedInvoices');
    localStorage.removeItem('factoringRequests');
    localStorage.removeItem('supportTickets');
    window.location.href = 'index.html';
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
            <div>
                <strong>${type === 'success' ? 'Éxito!' : type === 'danger' ? 'Error!' : 'Información'}</strong>
                <div>${message}</div>
            </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Export functions with working implementations
function exportTableToExcel(tableId, filename) {
    try {
        const table = document.getElementById(tableId);
        if (!table) {
            showAlert('Tabla no encontrada', 'danger');
            return;
        }
        
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        
        // Save file
        XLSX.writeFile(wb, filename + '.xlsx');
        showAlert('Archivo Excel exportado exitosamente', 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showAlert('Error al exportar a Excel', 'danger');
    }
}

function exportToPDF(elementId, filename) {
    try {
        // Simple PDF export using window.print()
        const element = elementId ? document.getElementById(elementId) : document.body;
        
        // Create a new window with the content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${filename || 'Reporte'}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .no-print { display: none !important; }
                    @media print {
                        .btn, .navbar, .sidebar { display: none !important; }
                        .card { box-shadow: none !important; border: 1px solid #ddd !important; }
                    }
                </style>
            </head>
            <body>
                <h1>TekProvider - ${filename || 'Reporte'}</h1>
                <p>Fecha: ${new Date().toLocaleDateString('es-MX')}</p>
                <hr>
                ${element.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        showAlert('Reporte PDF generado exitosamente', 'success');
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        showAlert('Error al generar PDF', 'danger');
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Number formatting
function formatNumber(num) {
    return new Intl.NumberFormat('es-MX').format(num);
}

// Date formatting
function formatDateInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Add smooth scrolling to top button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Loading spinner functions
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-spinner';
    loadingDiv.className = 'loading-spinner';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando...</span>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-spinner');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Enhanced filter functions
function applyFilters() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showAlert('Filtros aplicados correctamente', 'success');
        // Here you would implement the actual filtering logic
    }, 1000);
}

// Enhanced export functions for specific pages
function exportToExcel() {
    const currentPage = window.location.pathname.split('/').pop();
    let tableId = '';
    let filename = '';
    
    switch(currentPage) {
        case 'facturas.html':
            tableId = 'facturasTable';
            filename = 'facturas';
            break;
        case 'estatus.html':
            tableId = 'estatusTable';
            filename = 'estatus-operaciones';
            break;
        case 'reportes.html':
            tableId = 'reportesTable';
            filename = 'reportes-mensuales';
            break;
        case 'tickets.html':
            tableId = 'ticketsTable';
            filename = 'tickets-soporte';
            break;
        default:
            showAlert('No se puede exportar esta página', 'warning');
            return;
    }
    
    exportTableToExcel(tableId, filename);
}

// Initialize tooltips and popovers
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBootstrapComponents);