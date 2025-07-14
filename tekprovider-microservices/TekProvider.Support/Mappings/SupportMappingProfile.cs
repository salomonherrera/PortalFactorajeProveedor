using AutoMapper;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;

namespace TekProvider.Support.Mappings;

public class SupportMappingProfile : Profile
{
    public SupportMappingProfile()
    {
        CreateMap<SupportTicket, SupportTicketDto>();
        CreateMap<CreateSupportTicketDto, SupportTicket>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TicketNumber, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedTo, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ClosedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());
        
        CreateMap<UpdateSupportTicketDto, SupportTicket>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Notification, NotificationDto>();
        CreateMap<CreateNotificationDto, Notification>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsRead, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ReadAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());
    }
}