const userSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    photoURL: String, // Store the GridFS ObjectID here
  });
  
  const User = mongoose.model("User", userSchema);