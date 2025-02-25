const express = require('express')
const router = express.Router()
const db = require('../config/db') // Asegúrate de ajustar la ruta según la ubicación de tu archivo db.js
const bcrypt = require('bcryptjs') // 🛠️ Usa bcryptjs en lugar de bcrypt normal
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth') // Importamos el middleware correctamente

require('dotenv').config()

/**
 * @swagger
 * tags:
 *   name: Usuaris
 *   description: Endpoints per a la gestió de usuaris
 */

/**
 * @swagger
 * /usuaris:
 *   get:
 *     summary: Obté tots els usuaris
 *     description: Retorna una llista de tots els usuaris registrats.
 *     tags:
 *       - Usuaris
 *     responses:
 *       200:
 *         description: Llista d'usuaris obtinguda correctament.
 *       500:
 *         description: Error en obtenir els usuaris.
 */
router.get('/', (req, res) => {
  const query = 'SELECT * FROM usuaris'
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

/**
 * @swagger
 * /usuaris/{id}:
 *   get:
 *     summary: Obté un usuari per ID
 *     description: Retorna les dades d'un usuari específic pel seu ID.
 *     tags:
 *       - Usuaris
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari a obtenir.
 *     responses:
 *       200:
 *         description: Usuari obtingut correctament.
 *       404:
 *         description: Usuari no trobat.
 *       500:
 *         description: Error en obtenir l'usuari.
 */
router.get('/:id', (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM usuaris WHERE id = ?'
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuari no trobat' })
    }
    res.json(result[0])
  })
})

// /**
//  * @swagger
//  * /usuaris:
//  *   post:
//  *     summary: Crea un nou usuari
//  *     description: Afegeix un nou usuari a la base de dades.
//  *     tags:
//  *       - Usuaris
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               nom:
//  *                 type: string
//  *               correu:
//  *                 type: string
//  *               contrasenya:
//  *                 type: string
//  *               edat:
//  *                 type: integer
//  *               nacionalitat:
//  *                 type: string
//  *               codiPostal:
//  *                 type: string
//  *               imatgePerfil:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Usuari creat correctament.
//  *       500:
//  *         description: Error en crear l'usuari.
//  */
// router.post('/', (req, res) => {
//   const {
//     nom,
//     correu,
//     contrasenya,
//     edat,
//     nacionalitat,
//     codiPostal,
//     imatgePerfil,
//   } = req.body
//   const query =
//     'INSERT INTO usuaris (nom, correu, contrasenya, edat, nacionalitat, codiPostal, imatgePerfil) VALUES (?, ?, ?, ?, ?, ?, ?)'
//   db.query(
//     query,
//     [nom, correu, contrasenya, edat, nacionalitat, codiPostal, imatgePerfil],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message })
//       }
//       res.status(201).json({
//         id: result.insertId,
//         nom,
//         correu,
//         contrasenya,
//         edat,
//         nacionalitat,
//         codiPostal,
//         imatgePerfil,
//       })
//     },
//   )
// })

/**
 * @swagger
 * /usuaris:
 *   post:
 *     summary: Crea un nou usuari
 *     description: Afegeix un nou usuari a la base de dades.
 *     tags:
 *       - Usuaris
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               correu:
 *                 type: string
 *               contrasenya:
 *                 type: string
 *               edat:
 *                 type: integer
 *               nacionalitat:
 *                 type: string
 *               codiPostal:
 *                 type: string
 *               imatgePerfil:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuari creat correctament.
 *       400:
 *         description: Error en la validació.
 *       500:
 *         description: Error en crear l'usuari.
 */
router.post('/', async (req, res) => {
  try {
    const {
      nom,
      correu,
      contrasenya,
      edat,
      nacionalitat,
      codiPostal,
      imatgePerfil,
      btc = 0,
    } = req.body

    // Validación básica
    if (!nom || !correu || !contrasenya) {
      return res
        .status(400)
        .json({ error: 'Nom, correu i contrasenya són obligatoris' })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasenya, 10)

    // Insertar usuario en la BD
    const query =
      'INSERT INTO usuaris (nom, correu, contrasenya, edat, nacionalitat, codiPostal, imatgePerfil, btc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    db.query(
      query,
      [
        nom,
        correu,
        hashedPassword,
        edat,
        nacionalitat,
        codiPostal,
        imatgePerfil,
        btc,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        // Generar token JWT
        const token = jwt.sign(
          { userId: result.insertId },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
        )

        res.status(201).json({
          id: result.insertId,
          nom,
          correu,
          contrasenya,
          edat,
          nacionalitat,
          codiPostal,
          imatgePerfil,
          btc,
          token, // Devuelve el token para que el usuario pueda autenticarse
        })
      },
    )
  } catch (error) {
    console.error('Error en el servidor:', error) // 👀 Ver en consola qué error ocurre
    res.status(500).json({ error: error.message }) // ✅ Ahora `error` sí está definido
  }
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /usuaris/{id}:
 *   put:
 *     summary: Actualitza un usuari
 *     description: Modifica la informació d'un usuari existent. Ruta protegida es necessita un token JWT a la capçalera `Authorization`.
 *     tags:
 *       - Usuaris
 *     security:
 *       - bearerAuth: []  # 🔐 Protecció amb JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari a actualitzar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               correu:
 *                 type: string
 *               contrasenya:
 *                 type: string
 *               edat:
 *                 type: integer
 *               nacionalitat:
 *                 type: string
 *               codiPostal:
 *                 type: string
 *               imatgePerfil:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuari actualitzat correctament.
 *       403:
 *         description: No tens permís per modificar aquest usuari. (Accés denegat)
 *       401:
 *         description: Token invàlid o no proporcionat.
 *       404:
 *         description: Usuari no trobat.
 *       500:
 *         description: Error intern del servidor en actualitzar l'usuari.
 */

// router.put('/:id', (req, res) => {
//   const { id } = req.params
//   const {
//     nom,
//     correu,
//     contrasenya,
//     edat,
//     nacionalitat,
//     codiPostal,
//     imatgePerfil,
//   } = req.body

//   const query =
//     'UPDATE usuaris SET nom = ?, correu = ?, contrasenya = ?, edat = ?, nacionalitat = ?, codiPostal = ?, imatgePerfil = ? WHERE id = ?'

//   db.query(
//     query,
//     [
//       nom,
//       correu,
//       contrasenya,
//       edat,
//       nacionalitat,
//       codiPostal,
//       imatgePerfil,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message })
//       }

//       // 🔹 Ahora obtenemos el usuario actualizado
//       const selectQuery =
//         'SELECT id, nom, correu, rol FROM usuaris WHERE id = ?'
//       db.query(selectQuery, [id], (err, results) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ error: 'Error al recuperar usuario actualizado' })
//         }
//         if (results.length === 0) {
//           return res.status(404).json({ error: 'Usuario no encontrado' })
//         }

//         const user = results[0] // ✅ Definir correctamente el usuario

//         // 🔹 Generar token con la información del usuario
//         const token = jwt.sign(
//           { userId: user.id, rol: user.rol },
//           process.env.JWT_SECRET,
//           { expiresIn: '1h' },
//         )

//         res.json({
//           message: 'Usuari actualitzat correctament',
//           token,
//           usuario: user,
//         })
//       })
//     },
//   )
// })

router.put('/:id', auth, (req, res) => {
  const { id } = req.params
  const {
    nom,
    correu,
    contrasenya,
    edat,
    nacionalitat,
    codiPostal,
    imatgePerfil,
  } = req.body

  console.log(`📩 Datos recibidos para actualizar el usuario ${id}:`, req.body)

  // Verificar si el usuario autenticado es el mismo que intenta modificar o si es ADMIN
  if (req.user.id !== parseInt(id) && req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'No tienes permiso para modificar este usuario' })
  }

  const query = `
    UPDATE usuaris 
    SET nom = ?, correu = ?, contrasenya = ?, edat = ?, nacionalitat = ?, codiPostal = ?, imatgePerfil = ? 
    WHERE id = ?
  `

  db.query(
    query,
    [
      nom,
      correu,
      contrasenya,
      edat,
      nacionalitat,
      codiPostal,
      imatgePerfil,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('🚨 Error en la consulta SQL:', err.message)
        return res.status(500).json({ error: 'Error interno del servidor' })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      console.log('✅ Usuario actualizado correctamente en la base de datos')

      // Obtener el usuario actualizado
      db.query('SELECT * FROM usuaris WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.error(
            '🚨 Error al recuperar usuario actualizado:',
            err.message,
          )
          return res
            .status(500)
            .json({ error: 'Error al recuperar usuario actualizado' })
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        const user = results[0]

        console.log('🔄 Usuario actualizado con éxito:', user)

        res.json({
          message: 'Usuario actualizado correctamente',
          usuario: user,
        })
      })
    },
  )
})

/**
 * @swagger
 * /usuaris/{id}:
 *   delete:
 *     summary: Elimina un usuari
 *     description: Elimina un usuari de la base de dades per l'ID proporcionat.
 *     tags:
 *       - Usuaris
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari a eliminar.
 *     responses:
 *       200:
 *         description: Usuari eliminat correctament.
 *       500:
 *         description: Error en eliminar l'usuari.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const query = 'DELETE FROM usuaris WHERE id = ?'
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: 'Usuari eliminat correctament' })
  })
})

/**
 * @swagger
 * /usuaris/correu/{correu}:
 *   get:
 *     summary: Cerca un usuari per correu
 *     description: Retorna un usuari basat en l'adreça de correu proporcionada.
 *     tags:
 *       - Usuaris
 *     parameters:
 *       - in: path
 *         name: correu
 *         required: true
 *         schema:
 *           type: string
 *         description: Correu de l'usuari a buscar.
 *     responses:
 *       200:
 *         description: Usuari trobat.
 *       404:
 *         description: Usuari no trobat.
 *       500:
 *         description: Error en la cerca de l'usuari.
 */
router.get('/correu/:correu', (req, res) => {
  const { correu } = req.params
  const query = 'SELECT * FROM usuaris WHERE correu = ?'
  db.query(query, [correu], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuari no trobat' })
    }
    res.json(result[0])
  })
})

// 🔹 Endpoint de Login (Verifica la contraseña con bcrypt)
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  console.log('📥 Petición recibida en /api/login')
  console.log(`📧 Email recibido: ${email}`)
  console.log(`🔑 Password recibido: ${password}`)

  // Verificar si email o password están vacíos
  if (!email || !password) {
    console.log('⚠️ Error: Faltan datos en la petición.')
    return res.status(400).json({ error: 'Faltan datos' })
  }

  // Buscar usuario en la base de datos
  const query = 'SELECT * FROM usuaris WHERE correu = ?'
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('❌ Error en la base de datos:', err)
      return res.status(500).json({ error: 'Error en la base de datos' })
    }

    console.log(`🛠 Resultado de la consulta: ${JSON.stringify(results)}`)

    if (results.length === 0) {
      console.log('🚫 Usuario no encontrado.')
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const usuario = results[0]
    console.log(`🔍 Usuario encontrado: ${JSON.stringify(usuario)}`)

    try {
      // Comparar la contraseña ingresada con la almacenada en la BD
      const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.contrasenya,
      )

      console.log(`🔍 Comparación de contraseña: ${passwordCorrecta}`)

      if (passwordCorrecta) {
        console.log('✅ Login exitoso.')
        return res.json({ message: 'Login exitoso', usuario })
      } else {
        console.log('🚫 Contraseña incorrecta.')
        return res.status(400).json({ error: 'Contraseña incorrecta' })
      }
    } catch (bcryptError) {
      console.error('❌ Error en bcrypt.compare:', bcryptError)
      return res.status(500).json({ error: 'Error al verificar contraseña' })
    }
  })
})

/**
 * @swagger
 * /usuaris/btc/{userId}:
 *   put:
 *     summary: Actualitza el saldo de BTC d'un usuari
 *     description: Permet actualitzar el saldo de BTC d'un usuari específic.
 *     tags:
 *       - Usuaris
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Saldo actualitzat amb èxit.
 *       400:
 *         description: Error en actualitzar el saldo.
 *       500:
 *         description: Error intern del servidor.
 */
router.put('/btc/:userId', async (req, res) => {
  const { userId } = req.params
  const { amount } = req.body
  try {
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE usuaris SET btc = btc + ? WHERE id = ?',
        [amount, userId],
        (err, result) => {
          if (err) reject(err)
          resolve(result)
        },
      )
    })
    res.json({ success: true, message: 'Saldo actualizado con éxito' })
  } catch (error) {
    console.error('Error al actualizar saldo:', error.message)
    res.status(400).json({ success: false, error: error.message })
  }
})

module.exports = router
