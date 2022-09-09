const btn = document.getElementById("btn");
const password = document.getElementById("password");
const role = document.getElementById("role");
const idNum = document.getElementById("idNum");
const basicUrl = "http://localhost:4000/api/v1/";

//Set user in localstorage for three hours after which user is expired
export const setWithExpiry = (key, value, token, ttl = 1000 * 60 * 60 * 3) => {
  const now = new Date();

  const item = {
    token,
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

// export const getWithExpiry = (key) => {
const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  //If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);

  const now = new Date();
  //Compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    //If the item is expired, delete the item from local storage
    localStorage.removeItem(key);
    return null;
  }

  return item;
};

export const getCurrentUser = () => {
  const user = getWithExpiry("user");
  return user;
};
