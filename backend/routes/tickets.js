const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Add ticket to account
router.post('/', async (req, res) => {
  try {
    const { accountId, ticketNumber } = req.body;

    // Validation
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
    if (!ticketNumber || !ticketNumber.trim()) {
      return res.status(400).json({ error: 'Ticket number is required' });
    }

    const trimmedTicket = ticketNumber.trim();

    // Check if ticket already exists globally
    const existingTicket = await Account.findOne({ tickets: trimmedTicket });
    if (existingTicket) {
      return res.status(400).json({
        error: `Ticket ${trimmedTicket} already exists and is assigned to ${existingTicket.accountNumber}`
      });
    }

    // Add ticket to account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.tickets.push(trimmedTicket);
    await account.save();

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add ticket' });
  }
});

// Check if ticket exists (duplicate check)
router.get('/check/:ticketNumber', async (req, res) => {
  try {
    const ticketNumber = req.params.ticketNumber.trim();
    const account = await Account.findOne({ tickets: ticketNumber });

    if (account) {
      res.json({
        exists: true,
        ticketNumber,
        account: {
          _id: account._id,
          accountNumber: account.accountNumber,
          name: account.name
        }
      });
    } else {
      res.json({
        exists: false,
        ticketNumber
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check ticket' });
  }
});

// Remove ticket from account
router.delete('/:accountId/:ticketNumber', async (req, res) => {
  try {
    const { accountId, ticketNumber } = req.params;

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const ticketIndex = account.tickets.indexOf(ticketNumber);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found in this account' });
    }

    account.tickets.splice(ticketIndex, 1);
    await account.save();

    res.json({ message: 'Ticket removed successfully', account });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove ticket' });
  }
});

module.exports = router;
