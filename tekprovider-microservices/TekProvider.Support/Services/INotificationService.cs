using TekProvider.Shared.DTOs;

namespace TekProvider.Support.Services;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetNotificationsByUserAsync(int userId);
    Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto createNotificationDto);
    Task<bool> MarkAsReadAsync(int notificationId);
    Task<bool> MarkAllAsReadAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task<bool> DeleteNotificationAsync(int id);
}