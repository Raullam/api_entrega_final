const jwt = require('jsonwebtoken')
const db = require('../config/db') // Asegúrate de que la conexión a la DB está bien hecha

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verificamos si el usuario existe en la base de datos
    db.query(
      'SELECT * FROM usuaris WHERE id = ?',
      [decoded.userId],
      (err, results) => {
        if (err) {
          console.error('🚨 Error al buscar usuario:', err)
          return res.status(500).json({ error: 'Error interno del servidor' })
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Usuario no encontrado' })
        }

        req.user = results[0] // Guardamos el usuario en req.user
        next()
      },
    )
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = auth // ✅ Exportamos correctamente el middleware
