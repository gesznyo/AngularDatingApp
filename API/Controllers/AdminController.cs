using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AdminController : BaseApiController
  {
    private readonly UserManager<AppUser> _userManager;
    public AdminController(UserManager<AppUser> userManager)
    {
      _userManager = userManager;
    }

    // GET api/admin/users-with-roles
    [Authorize(Policy = "RequiredAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRole()
    {
      var users = await _userManager.Users
                  .Include(u => u.UserRoles)
                  .ThenInclude(r => r.Role)
                  .OrderBy(u => u.UserName)
                  .Select(u => new
                  {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(u => u.Role.Name).ToList()
                  })
                  .ToListAsync();

      return Ok(users);
    }

    // POST api/admin/edit-roles/lisa?roles=Moderator,Member
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
    {
      var selectedRoles = roles.Split(",").ToArray();
      var user = await _userManager.FindByNameAsync(username);

      if (user == null) return NotFound($"Could not find {username} user.");

      var userRoles = await _userManager.GetRolesAsync(user);

      var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
      if (!result.Succeeded) return BadRequest($"Failed to add {username} to selected roles.");

      result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
      if (!result.Succeeded) return BadRequest($"Failed to remove {username} from current roles.");

      return Ok(await _userManager.GetRolesAsync(user));
    }

    // GET api/admin/photos-to-moderate
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
      return Ok("Admins or moderators can see this.");
    }
  }
}
