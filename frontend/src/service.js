export const getShortnedUrl = async (url) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/getShortUrl`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );
  return response.json();
};
