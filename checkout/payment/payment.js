import { getLastUserAddress, getCurrentUser } from "../../firebase/firestore.js";

const initializePaymentPage = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = '../../signin/index.html';
    return;
  }

  const lastAddress = await getLastUserAddress(currentUser.id);
  if (lastAddress) {
    deliveryName.innerHTML = lastAddress.firstName + ' ' + lastAddress.lastName;
    deliveryAddress.innerHTML = lastAddress.address;
  }
};

initializePaymentPage();