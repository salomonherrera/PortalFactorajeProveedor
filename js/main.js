// Variable para controlar el orden de las fechas
let sortOrder = 'desc'; // 'desc' para más nueva a más antigua, 'asc' para más antigua a más nueva

function toggleSort() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    const icon = document.getElementById('sortIcon');
    icon.className = sortOrder === 'desc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
    loadFacturas();
}

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

function loadFacturas() {
    // Ordenar facturas por fecha
    const facturasOrdenadas = [...facturas].sort((a, b) => {
        const fechaA = new Date(a.fechaEmision).getTime();
        const fechaB = new Date(b.fechaEmision).getTime();
        return sortOrder === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    });
    
    const tbody = document.getElementById('facturasTableBody');
    tbody.innerHTML = '';
    
    facturasOrdenadas.forEach(factura => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="factura-checkbox" data-id="${factura.id}"></td>
            <td>${factura.folio}</td>
            <td>${factura.cliente}</td>
            <td><span class="badge ${factura.tipoOperacion === 'Proveedor' ? 'bg-primary' : 'bg-info'}">${factura.tipoOperacion}</span></td>
            <td><span class="badge ${factura.recurso === 'Con Recurso' ? 'bg-warning' : 'bg-success'}">${factura.recurso}</span></td>
            <td>${factura.cedente}</td>
            <td>${factura.pagador}</td>
            <td>$${factura.monto.toLocaleString()}</td>
            <td>${factura.fechaEmision}</td>
            <td>${factura.fechaVencimiento}</td>
            <td><span class="badge ${getStatusBadge(factura.estatus)}">${factura.estatus}</span></td>
        `;
        tbody.appendChild(row);
    });
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

// Quotation functionality
let selectedOperation = 'provider';
let selectedResource = 'with';
let currentQuotation = {};

function showQuotationModal() {
    const selectedIds = JSON.parse(localStorage.getItem('selectedInvoices') || '[]');
    
    if (selectedIds.length === 0) {
        showAlert('Seleccione al menos una factura para cotizar', 'warning');
        return;
    }
    
    // Calculate total amount
    const totalAmount = selectedIds.reduce((total, id) => {
        const factura = allFacturas.find(f => f.id == id);
        return total + (factura ? factura.monto : 0);
    }, 0);
    
    document.getElementById('montoTotal').value = '$' + totalAmount.toLocaleString();
    
    const modal = new bootstrap.Modal(document.getElementById('quotationModal'));
    modal.show();
    
    calculateQuotation();
}

function selectOperation(type) {
    selectedOperation = type;
    document.querySelectorAll('.operation-card').forEach(card => {
        card.classList.remove('border-primary', 'bg-primary', 'text-white');
        card.classList.add('border-secondary');
    });
    
    const selectedCard = event.currentTarget;
    selectedCard.classList.remove('border-secondary');
    selectedCard.classList.add('border-primary', 'bg-primary', 'text-white');
}

function selectResource(type) {
    selectedResource = type;
    document.querySelectorAll('.resource-card').forEach(card => {
        card.classList.remove('border-warning', 'border-success', 'bg-warning', 'bg-success', 'text-white');
    });
    
    const selectedCard = event.currentTarget;
    if (type === 'with') {
        selectedCard.classList.add('border-warning', 'bg-warning', 'text-white');
    } else {
        selectedCard.classList.add('border-success', 'bg-success', 'text-white');
    }
}

function calculateQuotation() {
    const montoTotal = parseFloat(document.getElementById('montoTotal').value.replace(/[$,]/g, '')) || 0;
    const adelanto = parseFloat(document.getElementById('adelanto').value) || 0;
    const retencion = parseFloat(document.getElementById('retencion').value) || 0;
    const tasa = parseFloat(document.getElementById('tasa').value) || 0;
    const comision = parseFloat(document.getElementById('comision').value) || 0;
    const plazo = parseInt(document.getElementById('plazo').value) || 30;
    
    // Cálculos
    const montoAdelanto = montoTotal * (adelanto / 100);
    const montoRetencion = montoTotal * (retencion / 100);
    const montoComision = montoTotal * (comision / 100);
    const montoNeto = montoAdelanto - montoComision;
    
    // Mostrar resultados
    const resultsHtml = `
        <div class="mb-2">
            <small class="text-muted">Monto Total:</small>
            <div class="fw-bold">$${montoTotal.toLocaleString()}</div>
        </div>
        <div class="mb-2">
            <small class="text-muted">Adelanto (${adelanto}%):</small>
            <div class="fw-bold text-success">$${montoAdelanto.toLocaleString()}</div>
        </div>
        <div class="mb-2">
            <small class="text-muted">Retención (${retencion}%):</small>
            <div class="fw-bold text-warning">$${montoRetencion.toLocaleString()}</div>
        </div>
        <div class="mb-2">
            <small class="text-muted">Comisión (${comision}%):</small>
            <div class="fw-bold text-danger">$${montoComision.toLocaleString()}</div>
        </div>
        <hr>
        <div class="mb-2">
            <small class="text-muted">Neto a Recibir:</small>
            <div class="fw-bold text-primary fs-5">$${montoNeto.toLocaleString()}</div>
        </div>
    `;
    
    document.getElementById('calculationResults').innerHTML = resultsHtml;
    
    // Generate payment schedule
    generatePaymentSchedule(montoTotal, plazo);
    
    // Store quotation
    currentQuotation = {
        montoTotal,
        adelanto,
        retencion,
        tasa,
        comision,
        plazo,
        montoAdelanto,
        montoRetencion,
        montoComision,
        montoNeto,
        operationType: selectedOperation,
        resourceType: selectedResource,
        cedente: document.getElementById('cedente').value,
        pagador: document.getElementById('pagador').value
    };
}

function generatePaymentSchedule(montoTotal, plazo) {
    const tbody = document.getElementById('paymentSchedule');
    tbody.innerHTML = '';
    
    // Generar 3 pagos como ejemplo
    const numPagos = 3;
    const montoPorPago = montoTotal / numPagos;
    
    for (let i = 1; i <= numPagos; i++) {
        const fechaPago = new Date();
        fechaPago.setDate(fechaPago.getDate() + (plazo / numPagos) * i);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${fechaPago.toLocaleDateString('es-MX')}</td>
            <td>$${montoPorPago.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    }
}

function applyQuotation() {
    if (!currentQuotation.cedente || !currentQuotation.pagador) {
        showAlert('Debe seleccionar cedente y pagador', 'warning');
        return;
    }
    
    // Store quotation data
    localStorage.setItem('currentQuotation', JSON.stringify(currentQuotation));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('quotationModal'));
    modal.hide();
    
    showAlert('Cotización aplicada exitosamente', 'success');
}