using ForumAPI.Models;
using ForumAPI.Repositories;

namespace ForumApi.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<User?> GetByUsernameAsync(string username)
        {
            return _userRepository.GetByUsernameAsync(username);
        }

        public Task<User?> GetByEmailAsync(string email)
        {
            return _userRepository.GetByEmailAsync(email);
        }

        public Task CreateAsync(User user)
        {
            return _userRepository.CreateAsync(user);
        }
    }
}
