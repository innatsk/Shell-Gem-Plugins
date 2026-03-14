using System.Threading.Tasks;

namespace Shell_Gems.Plugins
{
    public class mockpluginPlugin
    {
        public async Task<object> GetParams(dynamic input)
        {
            return new object[]
            {
                new { key = "username", type = "text", label = "Username", defaultValue = "admin", required = true, placeholder = "Enter username" },
                new { key = "volume", type = "range", label = "Volume Level", min = 0, max = 100, step = 1, defaultValue = 50 },
                new { key = "enabled", type = "boolean", label = "Enable Feature", defaultValue = true },
                new { key = "timeout", type = "number", label = "Timeout (ms)", min = 0, max = 10000, defaultValue = 3000 },
                new { key = "inputFile", type = "file", label = "Input File", accept = ".csv,.txt", maxSizeKb = 5120, required = false }
            };
        }

        public async Task<object> UpdateParams(dynamic input)
        {
            return new { success = true, message = "Parameters applied successfully" };
        }
    }
}
