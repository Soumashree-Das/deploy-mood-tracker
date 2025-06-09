import { journalModel } from '../models/journalEntry.model.js';
import { userModel } from '../models/user.model.js';

/**
 * Add a new journal entry for a user
 */
export const createJournalEntry = async (req, res) => {
  const { title, content, mood, grateful, selfReflection } = req.body;
  const userId = req.user.id; // comes from auth middleware

  try {
    const newEntry = new journalModel({
      title,
      content,
      mood,
      grateful,
      selfReflection,
      user: userId
    });

    await newEntry.save();

    return res.status(201).json({
      message: 'Journal entry added successfully',
      entry: newEntry
    });
  } catch (error) {
    console.error('Error adding entry:', error);
    return res.status(500).json({ message: 'Server error while adding entry' });
  }
};

/**
 * Get all journal entries for a user
 */
export const getAllJournalEntries = async (req, res) => {
  const userId = req.params.userId;

  try {
    const entries = await journalModel.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: `All entries retrieved successfully`,
      entries
    });
  } catch (error) {
    console.error('Error retrieving entries:', error);
    return res.status(500).json({ message: 'Server error while retrieving entries' });
  }
};

// export const getMoodData = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const entries = await journalModel.find(
//       { user: userId },
//       { _id: 0, mood: 1 }
//     );

//     // Main mood categories
//     const moodCategories = [
//       "joyful",
//       "happy",
//       "calmAndContent",
//       "angry",
//       "anxious",
//       "sad",
//       "depressed"
//     ];

//     const moodCounts = {};

//     entries.forEach(entry => {
//       moodCategories.forEach(category => {
//         if (entry.mood && entry.mood[category]) {
//           moodCounts[category] = (moodCounts[category] || 0) + 1;
//         }
//       });
//     });

//     res.status(200).json({ moodCounts });
//   } catch (err) {
//     console.error("Error fetching mood data:", err);
//     res.status(500).json({ message: "Failed to retrieve mood data." });
//   }
// };

export const getMoodData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const now = new Date();
    
    // Calculate dates for filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Get all entries for the user within the last 30 days
    const entries = await journalModel.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }, { _id: 0, mood: 1, createdAt: 1 });

    // Main mood categories
    const moodCategories = [
      "joyful",
      "happy",
      "calmAndContent",
      "angry",
      "anxious",
      "sad",
      "depressed"
    ];

    // Initialize counts for all time periods
    const moodCounts = {
      last30Days: {},
      last7Days: {}
    };

    // Initialize all categories to 0
    moodCategories.forEach(category => {
      moodCounts.last30Days[category] = 0;
      moodCounts.last7Days[category] = 0;
    });

    // Count moods for both time periods
    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      
      moodCategories.forEach(category => {
        if (entry.mood && entry.mood[category]) {
          // Always count for last 30 days
          moodCounts.last30Days[category] += 1;
          
          // Count for last 7 days if within that period
          if (entryDate >= sevenDaysAgo) {
            moodCounts.last7Days[category] += 1;
          }
        }
      });
    });

    res.status(200).json({ moodCounts });
  } catch (err) {
    console.error("Error fetching mood data:", err);
    res.status(500).json({ message: "Failed to retrieve mood data." });
  }
};


/**
 * Edit a journal entry by ID
 */
export const editEntry = async (req, res) => {
  const entryId = req.params.id;
  const { title, content, mood, grateful, selfReflection } = req.body;
  const userId = req.user.id;

  try {
    // First check if the entry belongs to this user
    const entry = await journalModel.findOne({ _id: entryId, user: userId });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found or not authorized' });
    }

    const updatedEntry = await journalModel.findByIdAndUpdate(
      entryId,
      { title, content, mood, grateful, selfReflection },
      { new: true }
    );

    return res.status(200).json({
      message: 'Entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    return res.status(500).json({ message: 'Server error while updating entry' });
  }
};

/**
 * Delete a journal entry by ID
 */
export const deleteEntry = async (req, res) => {
  const entryId = req.params.id;
  const userId = req.user.id;

  try {
    // First check if the entry belongs to this user
    const entry = await journalModel.findOne({ _id: entryId, user: userId });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found or not authorized' });
    }

    await journalModel.findByIdAndDelete(entryId);

    return res.status(200).json({
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return res.status(500).json({ message: 'Server error while deleting entry' });
  }
};
