const express = require('express')
const router = express.Router()
const db = require('../config/db')

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Obté tots els items
 *     description: Retorna una llista de tots els items disponibles a la base de dades.
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Llista d'items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   descripcio:
 *                     type: string
 *                   preu:
 *                     type: number
 *                     format: float
 *       500:
 *         description: Error en obtenir els items.
 */
router.get('/', (req, res) => {
  const query = 'SELECT * FROM items'
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

module.exports = router
