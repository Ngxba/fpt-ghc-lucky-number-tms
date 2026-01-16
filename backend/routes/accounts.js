const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create new account
router.post('/', async (req, res) => {
  try {
    const { accountNumber, name } = req.body;

    // Validation
    if (!accountNumber || !accountNumber.trim()) {
      return res.status(400).json({ error: 'Account number is required' });
    }

    const trimmedAccountNumber = accountNumber.trim();

    // Check if account already exists (case-insensitive)
    const existingAccount = await Account.findOne({
      accountNumber: { $regex: new RegExp(`^${trimmedAccountNumber}$`, 'i') }
    });
    if (existingAccount) {
      return res.status(400).json({
        error: `Account number already exists as "${existingAccount.accountNumber}"`
      });
    }

    const account = new Account({
      accountNumber: trimmedAccountNumber,
      name: name ? name.trim() : ''
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Account number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { name: name ? name.trim() : '' },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
