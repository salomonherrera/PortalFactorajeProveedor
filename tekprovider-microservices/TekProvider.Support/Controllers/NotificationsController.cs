using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekProvider.Support.Services;
using TekProvider.Shared.DTOs;

namespace TekProvider.Support.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// Obtener todas las notificaciones del usuario
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var notifications = await _notificationService.GetNotificationsByUserAsync(userId);
        return Ok(notifications);
    }

    /// <summary>
    /// Crear nueva notificación
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] CreateNotificationDto createNotificationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var notification = await _notificationService.CreateNotificationAsync(createNotificationDto);
        return Ok(notification);
    }

    /// <summary>
    /// Marcar notificación como leída
    /// </summary>
    [HttpPost("{id}/read")]
    public async Task<ActionResult> MarkAsRead(int id)
    {
        var result = await _notificationService.MarkAsReadAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Notificación marcada como leída" });
    }

    /// <summary>
    /// Marcar todas las notificaciones como leídas
    /// </summary>
    [HttpPost("read-all")]
    public async Task<ActionResult> MarkAllAsRead()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var result = await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(new { message = "Todas las notificaciones marcadas como leídas" });
    }

    /// <summary>
    /// Obtener contador de notificaciones no leídas
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(count);
    }

    /// <summary>
    /// Eliminar notificación
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNotification(int id)
    {
        var result = await _notificationService.DeleteNotificationAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}