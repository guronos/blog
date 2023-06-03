export const checkToken = async()=> fetch(
    "http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
export const getToken = async (user, pass) => 
{
const data = await fetch(
    "http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    }
  ).catch()
    return data
};