let addressData = JSON.parse(localStorage.getItem('addressData')) || [];

const form = document.getElementById('addressForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
})


export const addressSave = () => {
  if (firstName.value.trim() === '' || lastName.value.trim() === '' || phone.value.trim() === '' || address.value.trim() === '' || additional.value.trim() === '') {
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
    const newAddressData = {
      fName: firstName.value,
      lName: lastName.value,
      pNumber: phone.value,
      add: address.value,
      addInfo: additional.value
    };
    if (firstName.value.length < 3 || lastName.value.length < 3 || phone.value.length < 10 || address.value.length < 5) {
      errorMessage2.style.display = 'block';
      errorMessage.style
    } else {
      errorMessage2.style.display = 'none';
      addressData.push(newAddressData);
      localStorage.setItem('addressData', JSON.stringify(addressData));
      console.log(addressData);
      window.location.href = '../delivery/delivery.html';
      firstName.innerHTML = fName;
      lastName.innerHTML = lName;
      phone.innerHTML = pNumber;
      address.innerHTML = add;
      additional.innerHTML = addInfo;
    }
  }

}
window.addressSave = addressSave;
