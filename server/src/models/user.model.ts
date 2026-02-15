import mongoose, {Document} from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document{
    name: string, 
    email: string,
    password: string,
    role: "admin" | "student"
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,   
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "student"],
        default: "student",
        },
    }, 
    {timestamps: true}
)

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", userSchema)