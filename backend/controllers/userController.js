import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const loginUser = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return res
                .status(401)
                .json({ error: "Missing Authorization Basic header" });
        }
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString(
            "ascii"
        );
        const [username, password] = credentials.split(":");
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Invalid username or password" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({ error: "Invalid username or password" });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
        const safe = user.toJSON();
        delete safe.password;
        return res.json({ token, user: safe });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: "Invalid token" });
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
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
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }
        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res
                .status(409)
                .json({ error: "El email ya está registrado" });
        }
        const user = await User.create({ email, username, password });
        const safe = user.toJSON();
        delete safe.password;
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
        return res.status(201).json({ token, user: safe });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        
        if (req.file) {
            payload.profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;
        }
        
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
