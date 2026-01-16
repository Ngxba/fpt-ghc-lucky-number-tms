const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Search by ticket number
router.get('/ticket/:ticketNumber', async (req, res) => {
  try {
    const ticketNumber = req.params.ticketNumber.trim();
    const account = await Account.findOne({ tickets: ticketNumber });

    if (!account) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      ticketNumber,
      account: {
        _id: account._id,
        accountNumber: account.accountNumber,
        name: account.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search by account number (case-insensitive)
router.get('/account/:accountNumber', async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber.trim();
    const account = await Account.findOne({
      accountNumber: { $regex: new RegExp(`^${accountNumber}$`, 'i') }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      account: {
        _id: account._id,
        accountNumber: account.accountNumber,
        name: account.name
      },
      tickets: account.tickets
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
