// models/user.js

const users = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user1', role: 'user' },
    { id: 3, username: 'user2', role: 'user' }
];

// Função para buscar usuário por ID
const getUserById = (id) => users.find(user => user.id === id);

// Função para autenticar usuário pelo nome (exemplo)
const authenticateUser = (username) => users.find(user => user.username === username);

module.exports = { getUserById, authenticateUser };
