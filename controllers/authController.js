const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcryptjs') // Asegúrate de instalarlo con `npm install bcryptjs`
require('dotenv').config() // Asegúrate de cargar las variables del .env

const login = async (req, res) => {
  try {
    const { correu, contrasenya } = req.body

    // Buscar usuario por email
    const user = await User.findOne({ where: { correu } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contrasenya, user.contrasenya)
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET, // 🔐 Aquí usamos la clave secreta
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, // Usa el tiempo definido en el .env
    )

    res.json({ token, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

module.exports = { login }
