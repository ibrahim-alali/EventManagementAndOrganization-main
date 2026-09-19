import { getRole } from "../../utils/authRole";

// Mock user (current logged-in user)
export const getMockMe = () => ({
    full_name: "Mulham Salem",
    role: getRole(),
    email: "mulham@example.com",
    phone: "+963999888777",
    profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=mulham",
});