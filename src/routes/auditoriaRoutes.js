const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Operaciones de gestión y auditoría de usuarios
 */

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@edutech.edu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secreta123"
 *               tarjeta_bancaria:
 *                 type: string
 *                 example: "1234-5678-9012-3456"
 *     responses:
 *       201:
 *         description: Usuario creado con éxito y evento auditado
 *       400:
 *         description: Datos de entrada inválidos o correo duplicado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", auditoriaController.createOne);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", auditoriaController.getAll);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar datos de un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "carlos@edutech.edu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "nuevaClave456"
 *               tarjeta_bancaria:
 *                 type: string
 *                 example: "9876-5432-1098-7654"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", auditoriaController.updateOne);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/:id", auditoriaController.deleteOne);

module.exports = router;