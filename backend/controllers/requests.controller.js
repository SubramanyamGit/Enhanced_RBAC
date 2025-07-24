const requestModel = require('../models/requests.model');
const logAudit = require('../utils/auditLoggers');

exports.getRequests = async (req, res) => {
  try {
    const status = req.query.status || 'Pending'; // 'Pending', 'Approved', 'Rejected'    
    const isAdmin = req.user.role === "Admin"
    
    const requests = await requestModel.getAll({
      userId: req.user.user_id,
      isAdmin,
      status,
    });

    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};


exports.createRequest = async (req, res) => {
  try {
    const { permission_id, reason, expires_at } = req.body;
    const result = await requestModel.create({
      user_id: req.user.user_id,
      permission_id,
      reason,
      expires_at,
    });

    await logAudit({
      userId: req.user.user_id,
      actionType: 'CREATE_PERMISSION_REQUEST',
      details: { permission_id, reason, expires_at },
    });

    res.status(201).json({ message: "Request submitted", request_id: result.request_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    await requestModel.approve({
      request_id: req.params.id,
      reviewed_by: req.user.user_id,
    });

    await logAudit({
      userId: req.user.user_id,
      actionType: 'APPROVE_PERMISSION_REQUEST',
      details: { request_id: req.params.id },
    });

    res.json({ message: "Request approved" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to approve request" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    await requestModel.reject({
      request_id: req.params.id,
      reviewed_by: req.user.user_id,
      rejection_reason,
    });

    await logAudit({
      userId: req.user.user_id,
      actionType: 'REJECT_PERMISSION_REQUEST',
      details: { request_id: req.params.id, rejection_reason },
    });

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request" });
  }
};
