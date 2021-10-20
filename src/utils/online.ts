import * as isOnline from 'is-online';
import axios from 'axios';

export async function checkOnline() {
  if (await isOnline()) {
    if (await checkLocalHost()) {
      // console.log("is online");
      return true;
    } else {
      // console.log("can't connect to 192.168.8.188:8088");
      return false;
    }
  }
  
  console.log('is offline')
  return false;
}

export async function checkLocalHost() {
  let result = false;
  try {
    const response = await axios.get("http://192.168.8.188:8088/", { timeout: 2000  });
    result = response.status === 200 ? true : false;
  } catch (error) {
    // console.log("can't connect to 192.168.8.188:8088");
    result = false;
  }
  return result;
}
