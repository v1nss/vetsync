import ApprovalLog from "../models/approvalLogsModel.js";
import User from "../models/users/userModel.js";

export const createApprovalLog = async (req, res) => {
  try {
    const logData = req.body;
    const sysAdminId = req.user.id;
    
    // Ensure remarks is always a non-empty string
    const remarks = logData.remarks?.trim() || 
      (logData.action === 'approved' 
        ? 'Clinic application approved' 
        : 'Clinic application rejected');
    
    const newLog = await ApprovalLog.create({
      clinic_id: logData.clinic_id,
      action: logData.action,
      remarks: remarks,
      system_admin_id: sysAdminId
    });

    res.status(201).json({
      message: "Approval log created successfully",
      log: newLog
    });
  } catch (err) {
    console.error("Error creating approval log:", err.message);
    res.status(500).json({
      message: "Error creating approval log",
      error: err.message
    });
  }
};

export const getApprovalLogsByClinicId = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const logs = await ApprovalLog.findAll({
      where: { clinic_id: clinicId },
      order: [["timestamp", "DESC"]],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
    
    res.status(200).json({
      message: "Approval logs fetched successfully",
      logs: logs,
    });
  } catch (err) {
    console.error("Error fetching approval logs:", err.message);
    res.status(500).json({
      message: "Error fetching approval logs",
      error: err.message,
    });
  }
}