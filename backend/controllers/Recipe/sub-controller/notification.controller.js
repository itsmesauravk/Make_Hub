const Notification = require('../../../models/notification.model')




const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = req.query.limit || 6;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

  

    // Check if the limit is 0, return all notifications
    if (limit === "all") {
      console.log('je')
      const notifications = await Notification.find({ receiver: userId })
        .populate('sender', 'username')
        .populate('recipe', 'title slug')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: 'All notifications fetched successfully',
        data: notifications,
      });
    }

    // Fetch limited notifications based on the limit value
    const notifications = await Notification.find({ receiver: userId })
      .populate('sender', 'username')
      .populate('recipe', 'title slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


  const markAsRead = async (req, res) => {
    try {
        const userId = req.params.userId //reciver
      const updateNoti = await Notification.updateMany(
        { receiver: userId, read: false },
        { $set: { read: true } }
      );

      if (!updateNoti) {
        return res.status(400).json({success:false, message: 'Error marking notifications as read' });
      }
  
      res.status(200).json({success:true, message: 'Notifications marked as read' });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({success:false, message: 'Internal Server Error' });
    }
  };

// getting unread notifications count
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const unreadNotifications = await Notification.countDocuments({ receiver: userId, read: false });

    res.status(200).json({
      success: true,
      message: 'Unread notifications fetched successfully',
      data: unreadNotifications,
    });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};




module.exports = {
    getNotifications,
    markAsRead,
    getUnreadNotifications

}
  
  