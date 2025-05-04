import { getUserData } from "../../services/AuthService";

const UserLastLogin = () => {
  const user = getUserData();

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  console.log('Last login timestamp:', user?.last_login);

  return (
    <div>
      <p>Last login: {user?.last_login ? formatDate(user.last_login) : "N/A"}</p>
    </div>
  );
};

export default UserLastLogin;