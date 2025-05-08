import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            sparse: true,
            unique: true,
        },
        password: {
            type: String,
            min: 6,
            required: true
        },
        phoneNumber: {
            type: String,
            sparse: true,
            validate: {
                validator: function (v) {
                    return !v || /^\d{10}$/.test(v); // allow empty or valid 10 digits
                },
                message: props => `${props.value} is not a valid 10 digit phone number!`
            },
            unique: true
        }
    },
    {
        timestamps: true,
    }
);

export const userModel = mongoose.model("userModel", UserSchema);


