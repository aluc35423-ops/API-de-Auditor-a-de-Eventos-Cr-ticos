const Auditoria = require('../models/auditoriaSchemas');
const bcrypt = require('bcrypt');

const sanitizarCadena = (texto) => {
    if (typeof texto !== 'string') return '';
    return texto.replace(/[\r\n]/g, ' ');
};

const registrarEventoAuditoria = async (req, accionRealizada, codigoEstado) => {
    try {
        const ipOrigen = req.ip || req.connection.remoteAddress || '0.0.0.0';
        
        // 1. Prevención de Log Injection
        const accionSanitizada = sanitizarCadena(accionRealizada);
        const ipSanitizada = sanitizarCadena(ipOrigen);

        // 2. Control de Seguridad: NO ALMACENAMIENTO DE SECRETOS
        const placeholderSeguro = "[PROTEGIDO_POR_POLITICA_DE_AUDITORIA]";

        const textoLog = `ACCION: ${accionSanitizada} | IP: ${ipSanitizada} | STATUS: ${codigoEstado}`;

        const nuevoLog = new Auditoria({
            nombre: textoLog, // Guardamos la traza del log aquí para que sea visible
            email: sanitizarCadena(`audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@system.local`), // Correo único del sistema
            password: placeholderSeguro, 
            tarjeta_bancaria: placeholderSeguro 
        });

        await nuevoLog.save();
        return true;
    } catch (error) {
        console.error('CRITICAL_AUDIT_LOG_FAILURE:', error.message);
        return false;
    }
};

// ------------------------------------------------------------------
// CONTROLADORES EXPORTADOS (Asegúrate de que tus rutas usen estos nombres exactos)
// ------------------------------------------------------------------

// POST: Crea un nuevo usuario y registra el evento
exports.createOne = async (req, res) => {
    try {
        const { nombre, email, password, tarjeta_bancaria } = req.body;

        // 1. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Crear el usuario en la BD
        const nuevoUsuario = new Auditoria({
            nombre: nombre,
            email: email,
            password: passwordHash,
            tarjeta_bancaria: tarjeta_bancaria
        });

        await nuevoUsuario.save();

        // 3. Registrar en auditoría interna
        await registrarEventoAuditoria(req, `CREAR_USUARIO_${email}`, 201);

        res.status(201).json({ msg: "Usuario creado correctamente" });
    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario", message: error.message });
    }
};

// GET: Recupera todos los registros (tanto usuarios reales como trazas de log)
exports.getAll = async (req, res) => {
    try {
        const logs = await Auditoria.find().sort({ createdAt: -1 });
        res.status(200).json({
            ok: true,
            total_registros: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al recuperar los registros",
            message: error.message
        });
    }
};

// PUT: Actualiza un usuario (registro) y crea un log del evento de actualización
exports.updateOne = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Si la petición incluye un nuevo password, lo encriptamos
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // Buscamos y actualizamos el documento. { new: true } devuelve el doc ya actualizado.
        const usuarioActualizado = await Auditoria.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "El usuario no fue encontrado" });
        }

        // Ejecutamos la auditoría interna para registrar la modificación
        await registrarEventoAuditoria(req, `ACTUALIZAR_USUARIO_ID_${id}`, 200);

        res.status(200).json({ 
            msg: "Usuario actualizado correctamente",
            data: usuarioActualizado
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error al actualizar", 
            message: error.message 
        });
    }
};

// DELETE: Elimina un usuario (registro) y crea un nuevo registro con el log del evento.
exports.deleteOne = async (req, res) => {
    try {
        const usuario = await Auditoria.findByIdAndDelete(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no fue encontrado" });
        }

        await registrarEventoAuditoria(req, `ELIMINAR_USUARIO_ID_${req.params.id}`, 200);

        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar", message: error.message });
    }
};