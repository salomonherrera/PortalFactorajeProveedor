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
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editFactura(${factura.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFactura(${factura.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
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

// Upload functionality
function showUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
    modal.show();
}

function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            processFiles(files);
        });
    }
}

function processFiles(files) {
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResults = document.getElementById('uploadResults');
    const processedInvoices = document.getElementById('processedInvoices');
    
    uploadProgress.style.display = 'block';
    
    // Simulate file processing
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.querySelector('.progress-bar').style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            uploadProgress.style.display = 'none';
            uploadResults.style.display = 'block';
            
            // Generate mock extracted data
            const extractedInvoices = files.map((file, index) => ({
                fileName: file.name,
                folio: `F${(Math.floor(Math.random() * 900) + 100)}`,
                cliente: ['Nestlé México', 'Coca Cola', 'Walmart', 'Soriana'][Math.floor(Math.random() * 4)],
                monto: Math.floor(Math.random() * 500000) + 50000,
                fechaEmision: new Date().toISOString().split('T')[0],
                fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cedente: 'Servicios Demo S.A.',
                pagador: ['Nestlé México', 'Coca Cola', 'Walmart', 'Soriana'][Math.floor(Math.random() * 4)],
                tipoOperacion: Math.random() > 0.5 ? 'Proveedor' : 'Cliente',
                recurso: Math.random() > 0.5 ? 'Con Recurso' : 'Sin Recurso'
            }));
            
            processedInvoices.innerHTML = extractedInvoices.map(invoice => `
                <div class="card mb-2">
                    <div class="card-body p-3">
                        <div class="row">
                            <div class="col-md-3">
                                <strong>${invoice.folio}</strong><br>
                                <small class="text-muted">${invoice.fileName}</small>
                            </div>
                            <div class="col-md-3">
                                ${invoice.cliente}<br>
                                <small class="text-muted">Cliente</small>
                            </div>
                            <div class="col-md-2">
                                $${invoice.monto.toLocaleString()}<br>
                                <small class="text-muted">Monto</small>
                            </div>
                            <div class="col-md-2">
                                <span class="badge ${invoice.tipoOperacion === 'Proveedor' ? 'bg-primary' : 'bg-info'}">${invoice.tipoOperacion}</span><br>
                                <span class="badge ${invoice.recurso === 'Con Recurso' ? 'bg-warning' : 'bg-success'}">${invoice.recurso}</span>
                            </div>
                            <div class="col-md-2">
                                <span class="text-success"><i class="fas fa-check-circle"></i> Procesado</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('confirmUpload').style.display = 'block';
            window.extractedInvoices = extractedInvoices;
        }
    }, 200);
}

function confirmUploadedInvoices() {
    if (window.extractedInvoices) {
        // Add to facturas array
        window.extractedInvoices.forEach(invoice => {
            facturas.push({
                id: facturas.length + 1,
                ...invoice,
                estatus: 'Emitida'
            });
        });
        
        // Reload table
        loadFacturas();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
        modal.hide();
        
        showAlert(`${window.extractedInvoices.length} facturas cargadas exitosamente`, 'success');
        window.extractedInvoices = null;
    }
}

// Quotation functionality
function showQuotationModal() {
    const modal = new bootstrap.Modal(document.getElementById('quotationModal'));
    modal.show();
    updateQuotationCalculations();
}

function selectOperation(type) {
    document.querySelectorAll('.operation-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.operation-card').classList.add('selected');
    window.selectedOperation = type;
    updateQuotationCalculations();
}

function selectResource(type) {
    document.querySelectorAll('.resource-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.resource-card').classList.add('selected');
    window.selectedResource = type;
    updateQuotationCalculations();
}

function updateQuotationCalculations() {
    const selectedIds = JSON.parse(localStorage.getItem('selectedInvoices') || '[]');
    const totalAmount = selectedIds.reduce((total, id) => {
        const factura = allFacturas.find(f => f.id == id);
        return total + (factura ? factura.monto : 0);
    }, 0);
    
    document.getElementById('montoTotal').value = `$${totalAmount.toLocaleString()}`;
    calculateQuotation();
}

function calculateQuotation() {
    const montoTotal = parseFloat(document.getElementById('montoTotal').value.replace(/[$,]/g, '')) || 0;
    const adelanto = parseFloat(document.getElementById('adelanto').value) || 0;
    const retencion = parseFloat(document.getElementById('retencion').value) || 0;
    const tasa = parseFloat(document.getElementById('tasa').value) || 0;
    const comision = parseFloat(document.getElementById('comision').value) || 0;
    const plazo = parseInt(document.getElementById('plazo').value) || 0;
    
    const montoAdelanto = montoTotal * (adelanto / 100);
    const montoRetencion = montoTotal * (retencion / 100);
    const montoComision = montoTotal * (comision / 100);
    const netoRecibido = montoAdelanto - montoComision;
    
    // Cálculo del CAT
    const tasaMensual = tasa / 100 / 12;
    const periodos = plazo / 30;
    const cat = ((Math.pow(1 + tasaMensual, 12) - 1) * 100) + comision;
    
    document.getElementById('calculationResults').innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="mb-3">
                    <label class="fw-bold">Monto Total Facturas:</label>
                    <div class="fs-5">$${montoTotal.toLocaleString()}</div>
                </div>
                <div class="mb-3">
                    <label class="fw-bold text-success">Adelanto (${adelanto}%):</label>
                    <div class="fs-5 text-success">$${montoAdelanto.toLocaleString()}</div>
                </div>
                <div class="mb-3">
                    <label class="fw-bold text-warning">Retención (${retencion}%):</label>
                    <div class="fs-5 text-warning">$${montoRetencion.toLocaleString()}</div>
                </div>
                <div class="mb-3">
                    <label class="fw-bold text-danger">Comisión (${comision}%):</label>
                    <div class="fs-5 text-danger">$${montoComision.toLocaleString()}</div>
                </div>
                <div class="mb-3 border-top pt-2">
                    <label class="fw-bold text-primary">Neto a Recibir:</label>
                    <div class="fs-4 fw-bold text-primary">$${netoRecibido.toLocaleString()}</div>
                </div>
                <div class="mb-3 bg-info p-2 rounded">
                    <label class="fw-bold">CAT Estimado:</label>
                    <div class="fs-5 fw-bold">${cat.toFixed(2)}%</div>
                </div>
            </div>
        </div>
    `;
    
    // Generate payment schedule
    const paymentSchedule = document.getElementById('paymentSchedule');
    const fechaPago1 = new Date();
    const fechaPago2 = new Date(Date.now() + plazo * 24 * 60 * 60 * 1000);
    
    paymentSchedule.innerHTML = `
        <tr>
            <td>1</td>
            <td>${fechaPago1.toLocaleDateString('es-MX')}</td>
            <td>$${montoAdelanto.toLocaleString()}</td>
        </tr>
        <tr>
            <td>2</td>
            <td>${fechaPago2.toLocaleDateString('es-MX')}</td>
            <td>$${montoRetencion.toLocaleString()}</td>
        </tr>
    `;
}

function applyQuotation() {
    showAlert('Cotización aplicada exitosamente', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('quotationModal'));
    modal.hide();
}

// Financial quote functionality
function showFinancialQuote(requestId, amount) {
    window.currentRequestId = requestId;
    window.currentAmount = amount;
    const modal = new bootstrap.Modal(document.getElementById('financialQuoteModal'));
    modal.show();
}

function calculateFinancialQuote() {
    const amount = parseFloat(document.getElementById('quoteAmount').value) || 0;
    const rate = parseFloat(document.getElementById('quoteRate').value) || 0;
    const commission = parseFloat(document.getElementById('quoteCommission').value) || 0;
    const term = parseInt(document.getElementById('quoteTerm').value) || 0;
    
    const commissionAmount = amount * (commission / 100);
    const netAmount = amount - commissionAmount;
    
    // CAT calculation
    const monthlyRate = rate / 100 / 12;
    const cat = ((Math.pow(1 + monthlyRate, 12) - 1) * 100) + commission;
    
    document.getElementById('quoteResults').innerHTML = `
        <div class="alert alert-info">
            <h6>Resultados de la Cotización:</h6>
            <div class="row">
                <div class="col-6">
                    <strong>Monto Solicitado:</strong><br>
                    $${amount.toLocaleString()}
                </div>
                <div class="col-6">
                    <strong>Comisión:</strong><br>
                    $${commissionAmount.toLocaleString()}
                </div>
                <div class="col-6">
                    <strong>Neto a Recibir:</strong><br>
                    <span class="text-success fs-5 fw-bold">$${netAmount.toLocaleString()}</span>
                </div>
                <div class="col-6">
                    <strong>CAT:</strong><br>
                    <span class="text-primary fs-5 fw-bold">${cat.toFixed(2)}%</span>
                </div>
            </div>
        </div>
    `;
}

function submitFinancialQuote() {
    showAlert('Cotización enviada a la financiera exitosamente', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('financialQuoteModal'));
    modal.hide();
}

// View request details
function viewRequestDetails(requestId) {
    showAlert(`Mostrando detalles de la solicitud ${requestId}`, 'info');
}

// Edit and delete functions
function editFactura(id) {
    showAlert(`Editando factura ID: ${id}`, 'info');
}

function deleteFactura(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
        // Remove from array
        const index = facturas.findIndex(f => f.id === id);
        if (index > -1) {
            facturas.splice(index, 1);
            loadFacturas();
            showAlert('Factura eliminada exitosamente', 'success');
        }
    }
}

// Initialize upload functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupUploadArea();
    
    // Update header based on configuration
    updateHeaderBasedOnConfig();
});

function updateHeaderBasedOnConfig() {
    const savedConfig = localStorage.getItem('tekprovider_config');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        const userTypeText = config.userType === 'provider' ? 'Portal de Proveedores' : 'Portal de Clientes';
        const resourceText = config.resourceType === 'with' ? 'Con Recurso' : 'Sin Recurso';
        
        // Update sidebar header if exists
        const sidebarHeader = document.querySelector('.sidebar-header h3');
        if (sidebarHeader) {
            sidebarHeader.innerHTML = `TekProvider<br><small style="font-size: 0.7rem; opacity: 0.8;">${userTypeText}</small>`;
        }
        
        // Update page titles based on user type
        updatePageTitlesBasedOnUserType(config.userType);
    }
}

function updatePageTitlesBasedOnUserType(userType) {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'facturas.html') {
        const pageHeader = document.querySelector('.page-header h1');
        if (pageHeader) {
            pageHeader.textContent = userType === 'provider' ? 'Mis Facturas (Emitidas)' : 'Facturas de Proveedores';
        }
        
        const pageDescription = document.querySelector('.page-header p');
        if (pageDescription) {
            pageDescription.textContent = userType === 'provider' 
                ? 'Gestiona las facturas que emites a tus clientes'
                : 'Gestiona las facturas que recibes de tus proveedores';
        }
    }
});