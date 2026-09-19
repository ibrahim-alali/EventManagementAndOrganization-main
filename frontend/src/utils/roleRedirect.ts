export const getRedirectPathByRole = (role: string) => {
  switch (role) {
    case "provider":
      return "/provider/dashboard";
    case "organizer":
      return "/organizer/dashboard";
    case "client":
    default:
      return "/client/dashboard";
  }
};