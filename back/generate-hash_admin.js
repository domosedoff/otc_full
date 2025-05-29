// generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Secretyu26061976'; // <--- ЗАМЕНИ НА ЖЕЛАЕМЫЙ ПАРОЛЬ ДЛЯ АДМИНА
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Пароль для админа:', password);
  console.log('Хеш пароля:', hash);
}

generateHash();
