using AutoMapper;
using TekProvider.Support.Services;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Support.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public NotificationService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<NotificationDto>> GetNotificationsByUserAsync(int userId)
    {
        var notifications = await _unitOfWork.Notifications.FindAsync(n => n.UserId == userId);
        return _mapper.Map<IEnumerable<NotificationDto>>(notifications.OrderByDescending(n => n.CreatedAt));
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto createNotificationDto)
    {
        var notification = _mapper.Map<Notification>(createNotificationDto);
        notification.CreatedAt = DateTime.UtcNow;
        notification.IsRead = false;

        await _unitOfWork.Notifications.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<NotificationDto>(notification);
    }

    public async Task<bool> MarkAsReadAsync(int notificationId)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(notificationId);
        if (notification == null) return false;

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;

        await _unitOfWork.Notifications.UpdateAsync(notification);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAllAsReadAsync(int userId)
    {
        var notifications = await _unitOfWork.Notifications.FindAsync(n => n.UserId == userId && !n.IsRead);
        
        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            await _unitOfWork.Notifications.UpdateAsync(notification);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _unitOfWork.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null) return false;

        await _unitOfWork.Notifications.DeleteAsync(notification);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}