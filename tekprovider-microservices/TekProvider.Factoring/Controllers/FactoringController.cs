using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekProvider.Factoring.Services;
using TekProvider.Shared.DTOs;

namespace TekProvider.Factoring.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FactoringController : ControllerBase
{
    private readonly IFactoringService _factoringService;

    public FactoringController(IFactoringService factoringService)
    {
        _factoringService = factoringService;
    }

    /// <summary>
    /// Obtener todas las solicitudes de factoraje del usuario
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FactoringRequestDto>>> GetFactoringRequests()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var requests = await _factoringService.GetFactoringRequestsByUserAsync(userId);
        return Ok(requests);
    }

    /// <summary>
    /// Obtener solicitud de factoraje por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<FactoringRequestDto>> GetFactoringRequest(int id)
    {
        var request = await _factoringService.GetFactoringRequestByIdAsync(id);
        if (request == null)
        {
            return NotFound();
        }
        return Ok(request);
    }

    /// <summary>
    /// Crear nueva solicitud de factoraje
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<FactoringRequestDto>> CreateFactoringRequest([FromBody] CreateFactoringRequestDto createFactoringRequestDto)
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

        createFactoringRequestDto.UserId = userId;

        if (createFactoringRequestDto.InvoiceIds == null || !createFactoringRequestDto.InvoiceIds.Any())
        {
            return BadRequest("Debe seleccionar al menos una factura");
        }

        var request = await _factoringService.CreateFactoringRequestAsync(createFactoringRequestDto);
        return CreatedAtAction(nameof(GetFactoringRequest), new { id = request.Id }, request);
    }

    /// <summary>
    /// Actualizar solicitud de factoraje
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<FactoringRequestDto>> UpdateFactoringRequest(int id, [FromBody] UpdateFactoringRequestDto updateFactoringRequestDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var request = await _factoringService.UpdateFactoringRequestAsync(id, updateFactoringRequestDto);
        if (request == null)
        {
            return NotFound();
        }

        return Ok(request);
    }

    /// <summary>
    /// Eliminar solicitud de factoraje
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFactoringRequest(int id)
    {
        var result = await _factoringService.DeleteFactoringRequestAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Obtener solicitudes por estatus
    /// </summary>
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<FactoringRequestDto>>> GetFactoringRequestsByStatus(string status)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var requests = await _factoringService.GetFactoringRequestsByStatusAsync(userId, status);
        return Ok(requests);
    }

    /// <summary>
    /// Obtener total de factoraje del usuario
    /// </summary>
    [HttpGet("total")]
    public async Task<ActionResult<decimal>> GetTotalFactoringAmount()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var total = await _factoringService.GetTotalFactoringAmountByUserAsync(userId);
        return Ok(total);
    }

    /// <summary>
    /// Aprobar solicitud de factoraje (Admin only)
    /// </summary>
    [HttpPost("{id}/approve")]
    public async Task<ActionResult> ApproveFactoringRequest(int id, [FromBody] ApproveFactoringDto approveDto)
    {
        var result = await _factoringService.ApproveFactoringRequestAsync(id, approveDto.CommissionRate, approveDto.AdvanceAmount);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Solicitud aprobada exitosamente" });
    }

    /// <summary>
    /// Rechazar solicitud de factoraje (Admin only)
    /// </summary>
    [HttpPost("{id}/reject")]
    public async Task<ActionResult> RejectFactoringRequest(int id, [FromBody] RejectFactoringDto rejectDto)
    {
        var result = await _factoringService.RejectFactoringRequestAsync(id, rejectDto.RejectionReason);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Solicitud rechazada" });
    }
}

public class ApproveFactoringDto
{
    public decimal CommissionRate { get; set; }
    public decimal AdvanceAmount { get; set; }
}

public class RejectFactoringDto
{
    public string RejectionReason { get; set; } = string.Empty;
}