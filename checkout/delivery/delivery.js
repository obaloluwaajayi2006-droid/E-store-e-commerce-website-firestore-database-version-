let addressData = JSON.parse(localStorage.getItem('addressData')) || [];
const lastAdress = addressData[addressData.length - 1];
console.log(lastAdress.fName, lastAdress.lName)

deliveryName.innerHTML = lastAdress.fName + ' ' + lastAdress.lName;
deliveryAddress.innerHTML = lastAdress.add;