import { User } from './class/user.js'

const user = new User()

if (user.isLoggedIn) {
  document.querySelectorAll('.nav-link[href="/login"], .mobile-login').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.logout-btn').forEach(el => {
    el.style.display = '';
  });
} else {
  document.querySelectorAll('.logout-btn').forEach(el => {
    el.style.display = 'none';
  });
}