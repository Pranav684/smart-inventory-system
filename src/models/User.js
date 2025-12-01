const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const { unsubscribe } = require("../routes/auth");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim:true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email already exists!"],
      lowercase: true,
      trim:true,
    },
    password: {
      type: String,
      required: [true, "Please add a password!"],
      minlength: 6,
    },
    businessName:{
      type: String,
      trim:true,
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(){
  if(!this.isModified('password'))return ;

  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password, salt);
 
});

// Compare entered password with hashed password
userSchema.methods.matchPassword= async function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
