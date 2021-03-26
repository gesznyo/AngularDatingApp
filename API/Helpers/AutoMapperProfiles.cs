using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
              .ForMember(dest => dest.PhotoUrl,
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
              .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            ;

            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<RegisterDto, AppUser>()
              .ForMember(dest => dest.UserName,
              opt => opt.MapFrom(src => src.Username.ToLower()));

            CreateMap<Message, MessageDto>()
              .ForMember(dest => dest.SenderPhotoUrl,
                opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(s => s.IsMain).Url))
              .ForMember(dest => dest.RecipientPhotoUrl,
                opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(r => r.IsMain).Url));
        }
    }
}
