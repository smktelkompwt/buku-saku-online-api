const db = require('./db');
const dateFormat = require('./dateFormat')
const User = db.User;
const Aktivitas = db.Aktivitas;

async function insert(message,user_id) {
    let getUser = await User.find({ "_id": user_id });   
    let activityModel = {
        user_id: getUser[0]._id,
        username: getUser[0].name,
        activity: message,
        created_at: dateFormat(Date.now())
    }

    let activity = new Aktivitas(activityModel);
    await activity.save()
    let log = console.log(["LOG: " + activityModel.activity])
    return log
}

module.exports = insert