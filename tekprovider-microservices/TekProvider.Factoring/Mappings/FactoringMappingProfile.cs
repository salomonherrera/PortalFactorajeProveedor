using AutoMapper;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;

namespace TekProvider.Factoring.Mappings;

public class FactoringMappingProfile : Profile
{
    public FactoringMappingProfile()
    {
        CreateMap<FactoringRequest, FactoringRequestDto>()
            .ForMember(dest => dest.Invoices, opt => opt.Ignore()); // Will be populated manually
        
        CreateMap<CreateFactoringRequestDto, FactoringRequest>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.RequestNumber, opt => opt.Ignore())
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.FactoringRequestInvoices, opt => opt.Ignore());
        
        CreateMap<UpdateFactoringRequestDto, FactoringRequest>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Invoice, InvoiceDto>();
    }
}