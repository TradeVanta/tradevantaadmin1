// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtCfsMkc_Z_9ZeF0TEHTDFBzLlkU-egSc",
  authDomain: "tradevanta-a3e0d.firebaseapp.com",
  projectId: "tradevanta-a3e0d",
  storageBucket: "tradevanta-a3e0d.appspot.com",
  messagingSenderId: "441098922985",
  appId: "1:441098922985:web:163878a0ef5b2054f8b978"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to users collection
const usersRef = db.collection('users');

// Real-time listener
usersRef.onSnapshot(snapshot => {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';

  snapshot.forEach(doc => {
    const user = doc.data();
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', doc.id);

    tr.innerHTML = `
      <td contenteditable="false" class="username">${user.username}</td>
      <td contenteditable="false" class="email">${user.email}</td>
      <td contenteditable="false" class="number">${user.number}</td>
      <td contenteditable="false" class="balance">${user.balance}</td>
      <td contenteditable="false" class="registrationdatetime">${user.registrationdatetime}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="save-btn" style="display:none;">Save</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    usersList.appendChild(tr);

    const editBtn = tr.querySelector('.edit-btn');
    const saveBtn = tr.querySelector('.save-btn');
    const deleteBtn = tr.querySelector('.delete-btn');

    // Edit button
    editBtn.addEventListener('click', () => {
      tr.querySelectorAll('td[contenteditable]').forEach(cell => {
        cell.setAttribute('contenteditable', true);
      });
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
    });

    // Save button
    saveBtn.addEventListener('click', () => {
      const updatedData = {
        username: tr.querySelector('.username').innerText,
        email: tr.querySelector('.email').innerText,
        number: tr.querySelector('.number').innerText,
        balance: tr.querySelector('.balance').innerText,
        registrationdatetime: tr.querySelector('.registrationdatetime').innerText
      };

      usersRef.doc(doc.id).update(updatedData)
        .then(() => {
          alert('User updated successfully!');
          tr.querySelectorAll('td[contenteditable]').forEach(cell => {
            cell.setAttribute('contenteditable', false);
          });
          editBtn.style.display = 'inline-block';
          saveBtn.style.display = 'none';
        })
        .catch(error => {
          console.error('Error updating document:', error);
          alert('Failed to update user.');
        });
    });

    // Delete button
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this user?')) {
        usersRef.doc(doc.id).delete()
          .then(() => {
            alert('User deleted successfully!');
          })
          .catch(error => {
            console.error('Error deleting document:', error);
            alert('Failed to delete user.');
          });
      }
    });
  });
});
