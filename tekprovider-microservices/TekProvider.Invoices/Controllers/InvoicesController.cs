using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekProvider.Invoices.Services;
using TekProvider.Shared.DTOs;

namespace TekProvider.Invoices.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public InvoicesController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    /// <summary>
    /// Obtener todas las facturas del usuario
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoices()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var invoices = await _invoiceService.GetInvoicesByUserAsync(userId);
        return Ok(invoices);
    }

    /// <summary>
    /// Obtener factura por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceDto>> GetInvoice(int id)
    {
        var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
        if (invoice == null)
        {
            return NotFound();
        }
        return Ok(invoice);
    }

    /// <summary>
    /// Crear nueva factura
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<InvoiceDto>> CreateInvoice([FromBody] CreateInvoiceDto createInvoiceDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        createInvoiceDto.UserId = userId;

        // Verificar si el folio ya existe
        if (await _invoiceService.InvoiceExistsAsync(createInvoiceDto.Folio))
        {
            return BadRequest("El folio de factura ya existe");
        }

        var invoice = await _invoiceService.CreateInvoiceAsync(createInvoiceDto);
        return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
    }

    /// <summary>
    /// Actualizar factura
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<InvoiceDto>> UpdateInvoice(int id, [FromBody] UpdateInvoiceDto updateInvoiceDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var invoice = await _invoiceService.UpdateInvoiceAsync(id, updateInvoiceDto);
        if (invoice == null)
        {
            return NotFound();
        }

        return Ok(invoice);
    }

    /// <summary>
    /// Eliminar factura
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInvoice(int id)
    {
        var result = await _invoiceService.DeleteInvoiceAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Obtener facturas por estatus
    /// </summary>
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoicesByStatus(string status)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var invoices = await _invoiceService.GetInvoicesByStatusAsync(userId, status);
        return Ok(invoices);
    }

    /// <summary>
    /// Obtener facturas por rango de fechas
    /// </summary>
    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoicesByDateRange(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var invoices = await _invoiceService.GetInvoicesByDateRangeAsync(userId, startDate, endDate);
        return Ok(invoices);
    }

    /// <summary>
    /// Obtener total de facturas del usuario
    /// </summary>
    [HttpGet("total")]
    public async Task<ActionResult<decimal>> GetTotalAmount()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var total = await _invoiceService.GetTotalAmountByUserAsync(userId);
        return Ok(total);
    }
}