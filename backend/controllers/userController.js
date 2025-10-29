import { User } from "../models/index.js";

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
        const payload = req.body;
        // Note: password hashing should be applied here in a real app
        const user = await User.create(payload);
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
        // Avoid returning password in responses
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
