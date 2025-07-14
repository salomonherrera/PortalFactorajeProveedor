using TekProvider.Shared.DTOs;

namespace TekProvider.Factoring.Services;

public interface IFactoringService
{
    Task<IEnumerable<FactoringRequestDto>> GetFactoringRequestsByUserAsync(int userId);
    Task<FactoringRequestDto?> GetFactoringRequestByIdAsync(int id);
    Task<FactoringRequestDto> CreateFactoringRequestAsync(CreateFactoringRequestDto createFactoringRequestDto);
    Task<FactoringRequestDto?> UpdateFactoringRequestAsync(int id, UpdateFactoringRequestDto updateFactoringRequestDto);
    Task<bool> DeleteFactoringRequestAsync(int id);
    Task<IEnumerable<FactoringRequestDto>> GetFactoringRequestsByStatusAsync(int userId, string status);
    Task<decimal> GetTotalFactoringAmountByUserAsync(int userId);
    Task<bool> ApproveFactoringRequestAsync(int id, decimal commissionRate, decimal advanceAmount);
    Task<bool> RejectFactoringRequestAsync(int id, string rejectionReason);
}