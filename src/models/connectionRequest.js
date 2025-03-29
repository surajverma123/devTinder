const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'reject'],
            message: `{VALUE} is incorrect status type`
        }
    }
}, { timestamps: true }) 

connectionRequestSchema.index({ fromUserId: 1,toUserId: 1 })

connectionRequestSchema.pre("save", function(){
    const connectionRequest  = this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can not send connection request to your self")
    }
    next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;