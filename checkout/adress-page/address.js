import { saveAddress, getCurrentUser } from "../../firebase/firestore.js";

const form = document.getElementById('addressForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
})

export const addressSave = async () => {
  if (firstName.value.trim() === '' || lastName.value.trim() === '' || phone.value.trim() === '' || address.value.trim() === '' || additional.value.trim() === '') {
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
    const newAddressData = {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      address: address.value,
      additionalInfo: additional.value
    };
    if (firstName.value.length < 3 || lastName.value.length < 3 || phone.value.length < 10 || address.value.length < 5) {
      errorMessage2.style.display = 'block';
      errorMessage.style.display = 'none';
    } else {
      try {
        errorMessage2.style.display = 'none';
        const user = getCurrentUser();
        if (!user) {
          alert('Please log in first');
          return;
        }
        await saveAddress(user.id, newAddressData);
        window.location.href = '../delivery/delivery.html';
      } catch (error) {
        console.error('Error saving address:', error);
        alert('Error saving address: ' + error.message);
      }
    }
  }
}
window.addressSave = addressSave;
