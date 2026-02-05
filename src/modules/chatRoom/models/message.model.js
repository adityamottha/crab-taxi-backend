import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ChatRoom",
      required: true 
    },

    senderRole: {
       type: String,
       enum: ["USER", "DRIVER", "ADMIN"], 
       required: true 
      },

    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },

    receiverRole: {
       type: String, 
       enum: ["USER", "DRIVER", "ADMIN"], 
       required: true 
      },

    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },

    text: { 
      type: String, 
      required: true 
    }
    
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
