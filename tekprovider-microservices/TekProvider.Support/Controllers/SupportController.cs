using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekProvider.Support.Services;
using TekProvider.Shared.DTOs;

namespace TekProvider.Support.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SupportController : ControllerBase
{
    private readonly ISupportService _supportService;

    public SupportController(ISupportService supportService)
    {
        _supportService = supportService;
    }

    /// <summary>
    /// Obtener todos los tickets del usuario
    /// </summary>
    [HttpGet("tickets")]
    public async Task<ActionResult<IEnumerable<SupportTicketDto>>> GetTickets()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var tickets = await _supportService.GetTicketsByUserAsync(userId);
        return Ok(tickets);
    }

    /// <summary>
    /// Obtener ticket por ID
    /// </summary>
    [HttpGet("tickets/{id}")]
    public async Task<ActionResult<SupportTicketDto>> GetTicket(int id)
    {
        var ticket = await _supportService.GetTicketByIdAsync(id);
        if (ticket == null)
        {
            return NotFound();
        }
        return Ok(ticket);
    }

    /// <summary>
    /// Crear nuevo ticket
    /// </summary>
    [HttpPost("tickets")]
    public async Task<ActionResult<SupportTicketDto>> CreateTicket([FromBody] CreateSupportTicketDto createTicketDto)
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

        createTicketDto.UserId = userId;

        var ticket = await _supportService.CreateTicketAsync(createTicketDto);
        return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
    }

    /// <summary>
    /// Actualizar ticket
    /// </summary>
    [HttpPut("tickets/{id}")]
    public async Task<ActionResult<SupportTicketDto>> UpdateTicket(int id, [FromBody] UpdateSupportTicketDto updateTicketDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var ticket = await _supportService.UpdateTicketAsync(id, updateTicketDto);
        if (ticket == null)
        {
            return NotFound();
        }

        return Ok(ticket);
    }

    /// <summary>
    /// Eliminar ticket
    /// </summary>
    [HttpDelete("tickets/{id}")]
    public async Task<ActionResult> DeleteTicket(int id)
    {
        var result = await _supportService.DeleteTicketAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Obtener tickets por estatus
    /// </summary>
    [HttpGet("tickets/status/{status}")]
    public async Task<ActionResult<IEnumerable<SupportTicketDto>>> GetTicketsByStatus(string status)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var tickets = await _supportService.GetTicketsByStatusAsync(userId, status);
        return Ok(tickets);
    }

    /// <summary>
    /// Obtener tickets por prioridad
    /// </summary>
    [HttpGet("tickets/priority/{priority}")]
    public async Task<ActionResult<IEnumerable<SupportTicketDto>>> GetTicketsByPriority(string priority)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var tickets = await _supportService.GetTicketsByPriorityAsync(userId, priority);
        return Ok(tickets);
    }

    /// <summary>
    /// Cerrar ticket
    /// </summary>
    [HttpPost("tickets/{id}/close")]
    public async Task<ActionResult> CloseTicket(int id)
    {
        var result = await _supportService.CloseTicketAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Ticket cerrado exitosamente" });
    }

    /// <summary>
    /// Asignar ticket (Admin only)
    /// </summary>
    [HttpPost("tickets/{id}/assign")]
    public async Task<ActionResult> AssignTicket(int id, [FromBody] AssignTicketDto assignDto)
    {
        var result = await _supportService.AssignTicketAsync(id, assignDto.AssignedTo);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Ticket asignado exitosamente" });
    }
}

public class AssignTicketDto
{
    public string AssignedTo { get; set; } = string.Empty;
}