import { User } from "../models/index.js";
import bcrypt from "bcrypt";
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user;
        if (email) {
            user = await User.findOne({ where: { email } });
        } else {
            user = await User.findOne({ where: { username: req.body.username } });
        }
        if (!user) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        const safe = user.toJSON();
        delete safe.password;
        return res.json(safe);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
        });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }
    const user = await User.create({ email, username, password });
        const safe = user.toJSON();
        delete safe.password;
        return res.status(201).json(safe);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await User.update(payload, { where: { id } });
        const updated = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!updated) return res.status(404).json({ error: "User not found" });
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: "User not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
